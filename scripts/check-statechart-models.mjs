import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createActor, createMachine } from 'xstate';

const load = async (name) =>
  JSON.parse(
    await readFile(
      new URL(
        `../public/assets/statecharts/examples/${name}.json`,
        import.meta.url,
      ),
      'utf8',
    ),
  );
const send = (actor, ...events) =>
  events.forEach((type) => actor.send({ type }));
const coffeeConfig = await load('coffee-order');
const coffee = createActor(createMachine(coffeeConfig)).start();
send(coffee, 'BREWED');
assert.equal(coffee.getSnapshot().value, 'Ready');
send(coffee, 'ORDER', 'CANCEL');
assert.equal(coffee.getSnapshot().value, 'Ready');
send(coffee, 'ORDER', 'BREWED');
assert.equal(coffee.getSnapshot().value, 'Served');
assert.equal(coffee.getSnapshot().status, 'done');

const nested = await load('coffee-nested');
for (const progress of [[], ['GROUND'], ['GROUND', 'BREWED']]) {
  const actor = createActor(createMachine(nested)).start();
  send(actor, 'ORDER', ...progress, 'CANCEL');
  assert.equal(
    actor.getSnapshot().value,
    'Ready',
    'Parent CANCEL applies at every preparation step',
  );
  actor.stop();
}
const latte = createActor(createMachine(nested)).start();
send(latte, 'ORDER', 'GROUND', 'BREWED', 'STEAMED');
assert.equal(latte.getSnapshot().status, 'done');
assert.equal(latte.getSnapshot().value, 'Served');

const parallel = await load('coffee-donut-parallel');
for (const events of [
  ['COFFEE_READY', 'DONUT_READY'],
  ['DONUT_READY', 'COFFEE_READY'],
]) {
  const actor = createActor(createMachine(parallel)).start();
  send(actor, events[0]);
  assert.equal(
    actor.getSnapshot().status,
    'active',
    'One ready item does not complete the order',
  );
  send(actor, events[1]);
  assert.equal(actor.getSnapshot().status, 'done');
  assert.equal(actor.getSnapshot().value, 'Ready for pickup');
}

const guide = await readFile(
  new URL('../content/docs/statecharts.mdx', import.meta.url),
  'utf8',
);
const snippet = guide.match(/```ts\n([\s\S]*?)\n```/)[1];
const executable = snippet.replace(
  /import \{ createActor, createMachine \} from 'xstate';\n/,
  '',
);
let result;
new Function('createActor', 'createMachine', 'console', executable)(
  createActor,
  createMachine,
  {
    log: (value) => {
      result = value;
    },
  },
);
assert.equal(
  result,
  'Served',
  'The published code example executes as documented',
);
console.log(
  'Coffee cancellation, nested parent handling, both parallel completion orders, and published snippet: PASS',
);
