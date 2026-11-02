import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createActor, createMachine, raise, SimulatedClock, stateIn } from 'xstate';

const directory = new URL('../public/assets/harel-statecharts/examples/', import.meta.url);
const actors = [];
const errors = [];
const load = async (name) => JSON.parse(await readFile(new URL(`${name}.json`, directory), 'utf8'));
const start = async (name, implementations = {}, options = {}) => {
  const actor = createActor(createMachine(await load(name)).provide(implementations), options);
  actor.subscribe({ error: (error) => errors.push(error) });
  actors.push(actor);
  actor.start();
  return actor;
};
const send = (actor, type, properties = {}) => actor.send({ type, ...properties });
const value = (actor) => actor.getSnapshot().value;
const matches = (actor, state) => assert(actor.getSnapshot().matches(state), JSON.stringify(value(actor)));

for (const condition of ['P', 'Q', 'R']) {
  const actor = await start('harel-conditional', {
    guards: Object.fromEntries(['P', 'Q', 'R'].map((name) => [name, ({ event }) => event.condition === name])),
  });
  send(actor, 'alpha', { condition: 'none' });
  assert.equal(value(actor), 'Outside');
  send(actor, 'alpha', { condition });
  matches(actor, { Inside: `${condition} branch` });
}

const updates = [];
const selection = await start('harel-selection', {
  actions: Object.fromEntries(['type', 'name', 'qty', 'place'].map((name) => [`update ${name}`, () => updates.push(name)])),
});
for (const field of ['type', 'name', 'qty', 'place']) {
  send(selection, `SELECT_${field.toUpperCase()}`);
  send(selection, 'UPDATE');
  send(selection, 'UPDATE');
  matches(selection, { Updating: field });
}
assert.deepEqual(updates, ['type', 'type', 'name', 'name', 'qty', 'qty', 'place', 'place']);

const clock = new SimulatedClock();
const timeout = await start('harel-timeout', {}, { clock });
send(timeout, 'LEAVE');
matches(timeout, { Waiting: 'Minimum not met' });
clock.increment(499);
send(timeout, 'LEAVE');
matches(timeout, { Waiting: 'Minimum not met' });
clock.increment(1);
send(timeout, 'LEAVE');
assert.equal(value(timeout), 'Completed');
send(timeout, 'RESET');
clock.increment(2000);
assert.equal(value(timeout), 'Timed out');

const unclustering = await start('harel-unclustering');
send(unclustering, 'ENTER');
send(unclustering, 'STEP');
matches(unclustering, { Cluster: 'Second' });
send(unclustering, 'LEAVE');
assert.equal(value(unclustering), 'Outside');

const actions = [];
const activities = await start('harel-activities', {
  actions: {
    ...Object.fromEntries(['S', 'T', 'U', 'V', 'W', 'start X', 'stop X'].map((name) => [name, () => actions.push(name)])),
    'raise beta': raise({ type: 'beta' }),
  },
});
send(activities, 'alpha');
matches(activities, { Left: { A: 'B' }, Right: 'D' });
assert.deepEqual(actions, ['S', 'start X', 'V']);
send(activities, 'TO_F');
matches(activities, { Left: { A: 'F' }, Right: 'D' });
assert.equal(actions.filter((name) => name === 'S').length, 1, 'Child movement does not reenter A');
send(activities, 'TO_B');
send(activities, 'gamma');
matches(activities, { Left: 'C', Right: 'E' });
assert(actions.includes('W'));
assert(actions.includes('T'));
assert(actions.includes('stop X'));
assert(actions.includes('U'));

const digit = await start('harel-digit', {
  guards: Object.fromEntries(Array.from({ length: 10 }, (_, n) => [`digit ${n}`, ({ event }) => event.digit === n])),
});
send(digit, 'c');
for (let n = 1; n <= 10; n++) {
  send(digit, 'd');
  matches(digit, { 'One minute': String(n % 10) });
}
send(digit, 'SYNC', { digit: 7 });
matches(digit, { 'One minute': '7' });
send(digit, 'c');
assert.equal(value(digit), 'Ten minutes');

const telephones = await start('harel-telephones');
send(telephones, 'LIFT_1');
matches(telephones, { 'Telephone 1': { 'Off hook': 'Buzz' }, 'Telephone 2': 'On hook' });
send(telephones, 'LIFT_2');
matches(telephones, { 'Telephone 1': { 'Off hook': 'Conversing' }, 'Telephone 2': { 'Off hook': 'Buzz' } });
send(telephones, 'REPLACE_2');
matches(telephones, { 'Telephone 1': { 'Off hook': 'Buzz' }, 'Telephone 2': 'On hook' });

for (const event of ['alpha', 'beta']) {
  const shared = await start('harel-overlap-shared');
  send(shared, 'ACTIVATE_C');
  send(shared, event);
  assert.equal(value(shared), 'Outside');
}
const inactive = await start('harel-overlap-inactive');
send(inactive, 'ADVANCE_A');
send(inactive, 'DISABLE_B');
matches(inactive, { A: 'D', B: 'X' });
send(inactive, 'ENABLE_B');
matches(inactive, { A: 'D', B: 'E' });

for (const [event, expected] of [
  ['alpha', { A1: 'C1' }],
  ['beta', { Together: { A2: 'C2', B: 'E' } }],
  ['gamma', { Together: { A2: 'D2', B: 'E' } }],
  ['delta', { A1: 'D1' }],
]) {
  const overlap = await start('harel-overlap');
  send(overlap, event);
  matches(overlap, expected);
}
const alone = await start('harel-overlap');
send(alone, 'delta');
send(alone, 'omega');
matches(alone, { A1: 'D1' });
send(alone, 'epsilon');
assert.equal(value(alone), 'Outside');
const together = await start('harel-overlap');
send(together, 'gamma');
send(together, 'omega');
assert.equal(value(together), 'Outside');

for (const [choice, expected] of [
  ['ALPHA_CHOOSE_LEFT', { 'Left choice': { Upper: 'E', Lower: 'H' } }],
  ['ALPHA_CHOOSE_RIGHT', { 'Right choice': { Upper: 'G', Lower: 'F' } }],
]) {
  const conflict = await start('harel-conflict', { guards: { 'both ready': stateIn({ Source: { Upper: 'C', Lower: 'D' } }) } });
  send(conflict, choice);
  matches(conflict, { Source: { Upper: 'A', Lower: 'B' } });
  send(conflict, 'alpha');
  matches(conflict, { Source: { Upper: 'C', Lower: 'D' } });
  send(conflict, choice);
  matches(conflict, expected);
}

const cycle = await start('harel-broadcast-cycle');
send(cycle, 'alpha');
matches(cycle, { Left: 'L1', Right: 'R0' });
send(cycle, 'beta');
send(cycle, 'gamma');
send(cycle, 'delta');
matches(cycle, { Left: 'L0', Right: 'R0' });

const semantics = await start('harel-semantics', {
  actions: { 'raise entered B': raise({ type: 'entered B' }) },
  guards: { 'in A': stateIn('#harel-semantics-A') },
});
send(semantics, 'alpha');
matches(semantics, { First: 'B', Second: 'D', Third: 'F' });

for (const [input, expected] of [
  [{ alpha: true, beta: true }, 'B'],
  [{ alpha: true, beta: false }, 'C'],
  [{ gamma: true }, 'A'],
]) {
  const simultaneous = await start('harel-simultaneous', {
    guards: {
      'alpha and beta': ({ event }) => event.alpha === true && event.beta === true,
      'alpha without beta': ({ event }) => event.alpha === true && event.beta !== true,
    },
  });
  send(simultaneous, 'INPUT', input);
  assert.equal(value(simultaneous), expected);
}

for (const actor of actors) actor.stop();
assert.deepEqual(errors, [], 'Every adaptation executes without actor errors');
console.log('Harel advanced adaptations: guarded entry, selection, timer bounds, activity lifetime, digit cycle, scoped overlap workarounds, explicit conflict policy, symbolic broadcast cycle, and declared XState microsteps PASS');
