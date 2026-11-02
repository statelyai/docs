import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createActor, createMachine, stateIn, or, assign } from 'xstate';

const directory = new URL('../public/assets/harel-statecharts/examples/', import.meta.url);
const load = async (name) => JSON.parse(await readFile(new URL(`${name}.json`, directory), 'utf8'));
const guards = {
  P: ({ event }) => event.P === true,
  'in G': stateIn('#parallel-G'),
  'entry in G': stateIn('#entry-G'),
  'entry in B': stateIn('#entry-B'),
  'entry in B and G': stateIn({ Y: { A: 'B', D: 'G' } }),
  'stopwatch running': stateIn('#stopwatch-running'),
  'watch stopwatch running': stateIn('#watch-stopwatch-running'),
  'battery weak': stateIn('#watch-battery-weak'),
  'alarm 1 enabled': stateIn('#watch-alarm1-status.enabled'),
  'alarm 2 enabled': stateIn('#watch-alarm2-status.enabled'),
  'both alarms enabled': stateIn({ alive: { 'alarm 1 status': 'enabled', 'alarm 2 status': 'enabled' } }),
  'in alarm 1 off': stateIn('#watch-alarm1-off'),
  'in alarm 1 on': stateIn('#watch-alarm1-on'),
  'in alarm 2 off': stateIn('#watch-alarm2-off'),
  'in alarm 2 on': stateIn('#watch-alarm2-on'),
  'in chime off': stateIn('#watch-chime-off'),
  'in chime on': stateIn('#watch-chime-on'),
  'b up': or([stateIn('#watch-beep-test.00'), stateIn('#watch-beep-test.01')]),
};
const actions = {
  'increment selected field': () => {},
  'increment month': assign({ month: ({ context }) => context.month % 12 + 1 }),
  'clear history of main (host restart)': () => {},
};
const machines = new Map();
for (const name of [
  'harel-flat', 'harel-clustered', 'harel-history-shallow', 'harel-history-deep',
  'harel-history-selective', 'harel-displays', 'harel-updates', 'harel-parallel',
  'harel-product', 'harel-avionics', 'harel-parallel-entry', 'harel-stopwatch',
  'harel-beep-test', 'harel-watch',
]) {
  const config = await load(name);
  machines.set(name, createMachine({ ...config, context: { month: 1 } }, { guards, actions }));
}
const start = (name) => {
  const actor = createActor(machines.get(name));
  actor.subscribe({ error: (error) => { throw error; } });
  actor.start();
  assert.equal(actor.getSnapshot().status, 'active', `${name} starts`);
  return actor;
};
const send = (actor, ...events) => {
  for (const event of events) {
    actor.send(typeof event === 'string' ? { type: event } : event);
    assert.notEqual(actor.getSnapshot().status, 'error', actor.getSnapshot().error?.message);
  }
};

for (const name of machines.keys()) {
  const actor = start(name);
  actor.stop();
}

for (const name of ['harel-flat', 'harel-clustered']) {
  const actor = start(name);
  send(actor, { type: 'gamma', P: false });
  assert(actor.getSnapshot().matches(name === 'harel-flat' ? 'A' : { D: 'A' }));
  send(actor, { type: 'gamma', P: true }, 'beta');
  assert.equal(actor.getSnapshot().value, 'B');
  send(actor, 'delta');
  assert(actor.getSnapshot().matches(name === 'harel-flat' ? 'C' : { D: 'C' }));
  actor.stop();
}
for (const [mode, expected] of [['shallow', 'C'], ['deep', 'D'], ['selective', 'D']]) {
  const actor = start(`harel-history-${mode}`);
  send(actor, 'ENTER', 'GO_F', 'GO_D', 'LEAVE', 'ENTER');
  assert.deepEqual(actor.getSnapshot().value, { K: { F: expected } });
  send(actor, 'GO_G', 'GO_A', 'LEAVE', 'ENTER');
  assert.deepEqual(actor.getSnapshot().value, { K: { G: mode === 'deep' ? 'A' : 'B' } });
  actor.stop();
}
const displays = start('harel-displays');
send(displays, 'A_PRESS', 'D_PRESS', 'A_PRESS', 'A_PRESS', 'A_PRESS', 'A_PRESS', 'A_PRESS');
assert(displays.getSnapshot().matches({ displays: { 'alarm 1': 'on' } }), 'alarm toggle survives display cycle');
send(displays, 'T_HITS_T1_ONLY');
assert(displays.getSnapshot().matches({ 'alarms-beep': 'alarm 1 beeps' }));
send(displays, 'ALARM_30_SECONDS');
assert(displays.getSnapshot().matches({ displays: { 'alarm 1': 'on' } }), 'alarm returns through deep display history');
displays.stop();

const updates = start('harel-updates');
send(updates, 'C_PRESS', 'C_RELEASE');
assert.equal(updates.getSnapshot().value, 'time', 'release before two seconds cancels update entry');
send(updates, 'C_PRESS', 'HOLD_C_2_SECONDS', 'D_PRESS');
assert.deepEqual(updates.getSnapshot().value, { update: 'sec' });
send(updates, ...Array(8).fill('C_PRESS'));
assert.deepEqual(updates.getSnapshot().value, { update: 'mode' });
send(updates, 'C_PRESS');
assert.equal(updates.getSnapshot().value, 'time', 'only final field exits on C');
send(updates, 'A_PRESS', 'C_PRESS', 'C_PRESS', 'C_PRESS');
assert.deepEqual(updates.getSnapshot().value, { 'update 1': '1 min' });
send(updates, 'B_PRESS');
assert(updates.getSnapshot().matches({ 'alarm 1': 'off' }));
updates.stop();

const alphabet = ['alpha', 'beta', 'gamma', 'delta', 'mu'];
let traces = 0;
const checkTrace = (events) => {
  const parallel = start('harel-parallel');
  const product = start('harel-product');
  send(parallel, ...events);
  send(product, ...events);
  const value = parallel.getSnapshot().value;
  assert.equal(`${value.A},${value.D}`, product.getSnapshot().value, events.join(' '));
  parallel.stop();
  product.stop();
  traces++;
};
const enumerate = (events, depth) => {
  checkTrace(events);
  if (depth === 0) return;
  for (const event of alphabet) enumerate([...events, event], depth - 1);
};
enumerate([], 4);

const entry = start('harel-parallel-entry');
send(entry, 'delta');
assert.deepEqual(entry.getSnapshot().value, { Y: { A: 'B', D: 'E' } });
send(entry, 'gamma', 'omega');
assert.equal(entry.getSnapshot().value, 'K');
send(entry, 'alpha');
assert.deepEqual(entry.getSnapshot().value, { Y: { A: 'C', D: 'F' } }, 'one-region entry initializes other region');
send(entry, 'epsilon', 'beta');
assert.deepEqual(entry.getSnapshot().value, { Y: { A: 'C', D: 'F' } }, 'entry combines explicit target and region history');
send(entry, 'theta');
assert.equal(entry.getSnapshot().value, 'K', 'one region can exit the whole parallel state');
entry.stop();

const stopwatch = start('harel-stopwatch');
send(stopwatch, 'B_PRESS', 'D_PRESS');
assert(stopwatch.getSnapshot().matches({ stopwatch: { timing: { display: 'lap', run: 'on' } } }));
send(stopwatch, 'B_PRESS');
assert(stopwatch.getSnapshot().matches({ stopwatch: { timing: { display: 'lap', run: 'off' } } }));
send(stopwatch, 'A_PRESS', 'A_PRESS', 'A_PRESS');
assert(stopwatch.getSnapshot().matches({ stopwatch: { timing: { display: 'lap', run: 'off' } } }), 'deep history restores both regions');
send(stopwatch, 'D_PRESS', 'D_PRESS');
assert(stopwatch.getSnapshot().matches({ stopwatch: 'zero' }), 'D resets a stopped regular display');
stopwatch.stop();

const beep = start('harel-beep-test');
send(beep, 'D_PRESS', 'B_PRESS');
assert.deepEqual(beep.getSnapshot().value, { beep: 'on' });
send(beep, 'A_PRESS');
assert.deepEqual(beep.getSnapshot().value, { beep: 'off' });
send(beep, 'A_RELEASE', 'D_RELEASE');
assert.equal(beep.getSnapshot().value, '10');
beep.stop();

const alarmReturn = start('harel-watch');
send(alarmReturn, 'BATTERY_INSERTED', 'A_PRESS', 'D_PRESS', 'T_HITS_T1_ONLY');
assert(alarmReturn.getSnapshot().matches({ alive: { main: { 'alarms-beep': 'alarm 1 beeps' } } }));
send(alarmReturn, 'ALARM_30_SECONDS');
assert(alarmReturn.getSnapshot().matches({ alive: { main: { displays: { out: { 'alarm 1': 'on' } } } } }), 'full watch restores interrupted display after alarm');
alarmReturn.stop();

const watch = start('harel-watch');
send(watch, 'BATTERY_INSERTED', 'C_PRESS', 'HOLD_C_2_SECONDS', ...Array(4).fill('C_PRESS'));
assert(watch.getSnapshot().matches({ alive: { main: { displays: { regular: { controls: { update: 'mon' } } } } } }));
send(watch, 'D_PRESS', 'B_PRESS');
assert(watch.getSnapshot().matches({ alive: { main: { displays: { regular: { controls: 'time', 'beep-test': 'beep' } } }, light: 'on' } }), 'paper month-update scenario yields time + beep + light');
assert.equal(watch.getSnapshot().context.month, 2);
send(watch, 'B_RELEASE', 'D_RELEASE', 'C_PRESS');
assert(watch.getSnapshot().matches({ alive: { main: { displays: 'wait' } } }));
send(watch, 'D_PRESS', 'B_PRESS');
assert(watch.getSnapshot().matches({ alive: { main: { displays: 'wait' }, light: 'on' } }), 'beep-test is absent in wait');
send(watch, 'C_RELEASE', 'A_PRESS', 'D_PRESS');
assert(watch.getSnapshot().matches({ alive: { 'alarm 1 status': 'enabled' } }), 'D changes displayed alarm switch and orthogonal status together');
send(watch, 'BATTERY_REMOVED');
assert.equal(watch.getSnapshot().value, 'dead');
watch.stop();
const reset = start('harel-watch');
send(reset, 'BATTERY_INSERTED');
assert(reset.getSnapshot().matches({ alive: { main: { displays: { regular: { controls: 'time', 'beep-test': '00' } } }, 'alarm 1 status': 'disabled', light: 'off' } }), 'replacing the actor implements the documented battery reset boundary');
reset.stop();
console.log(`Harel watch models: hierarchy, history, update scopes, ${traces} parallel/product traces, entry/exit, stopwatch, beep-test, watch scenario and host restart PASS`);
