---
title: 'Testing'
description: 'How to test state machine and actor logic in XState'
---

## Testing logic

Testing actor logic is important for ensuring that the logic is correct and that it behaves as expected. You can test your state machines and actors using various testing libraries and tools. You should follow the **Arrange, Act, Assert** pattern when writing tests for your state machines and actors:

- **Arrange** - set up the test by creating the actor logics (such as a state machine) and the actors from the actor logics.
- **Act** - send event(s) to the actor(s).
- **Assert** - assert that the actor(s) reached their expected state(s) and/or executed the expected side effects.

```ts
import { setup, createActor } from 'xstate';
import { test, expect } from 'vitest';

test('some actor', async () => {
  const notifiedMessages: string[] = [];

  // 1. Arrange
  const machine = setup({
    actions: {
      notify: (_, params) => {
        notifiedMessages.push(params.message);
      }
    }
  }).createMachine({
    initial: 'inactive',
    states: {
      inactive: {
        on: { toggle: { target: 'active' } }
      },
      active: {
        entry: { type: 'notify', params: { message: 'Active!' } },
        on: { toggle: { target: 'inactive' } }
      }
    }
  });

  const actor = createActor(machine);

  // 2. Act
  actor.start();
  actor.send({ type: 'toggle' }); // => should be in 'active' state
  actor.send({ type: 'toggle' }); // => should be in 'inactive' state
  actor.send({ type: 'toggle' }); // => should be in 'active' state

  // 3. Assert
  expect(actor.getSnapshot().value).toBe('active');
  expect(notifiedMessages).toEqual(['Active!', 'Active!']);;
});
```

:::studio

You can now [generate test paths from your state machines in Stately Studio](generate-test-paths.mdx). You can try Stately Studio’s premium plans with a free trial. [Check out the features on our Pro plan](studio-pro-plan.mdx), [Team plan](studio-team-plan.mdx), [Enterprise plan](studio-enterprise-plan.mdx) or [upgrade your existing plan](https://stately.ai/registry/billing).

:::

## Testing actors

_Coming soon_

## Mocking effects

_Coming soon_

## Using `@xstate/test`

_Coming soon_
