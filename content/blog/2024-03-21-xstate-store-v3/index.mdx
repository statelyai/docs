---
title: 'XState Store v3'
description: 'XState Store v3 brings improved state management capabilities with better TypeScript support and a more streamlined API.'
tags: [xstate, store, state management, typescript]
authors: [david]
image: /blog/2025-02-26-xstate-store-v3.png
slug: 2025-02-26-xstate-store-v3
date: 2025-02-26
---

We're excited to announce the release of XState Store v3! This new version brings improved state management capabilities with better TypeScript support and a more streamlined API.

{/* truncate */}

The main motivation for this new version is to make the store more ergonomic and easier to use. Some key improvements include:

- **Simplified Context Updates**: Only one way to update context is now supported - using complete context assigner functions. This removes confusion around partial updates and makes the behavior more predictable. It's even now possible to use _typestates_ to ensure context updates are always complete and valid.

- **Enhanced TypeScript Experience**: The new `store.trigger.someEvent(...)` API provides better TypeScript autocompletion for events, making it easier to discover and use available events with proper typing.

- **Cleaner Event Emission**: The new `emits: { ... }` configuration replaces the more awkward `types: { emit: {} as ... }` syntax, making it more intuitive to define emitted events. You can even provide default side effects for these events.

- **Structured Side Effects**: Introduction of `enq.effect()` provides a "blessed" way to handle side effects, ensuring state transitions remain pure while making effects trackable and testable.

- **Store Selectors**: New selector API allows for efficient state subscriptions with fine-grained control over updates, preventing unnecessary re-renders and simplifying state access.

## Breaking Changes

The breaking changes in `@xstate/store` v3 include:

- The `createStore(config)` function now only accepts a _single_ configuration object
- Only complete context assigner functions are now supported
- The `config.types` property has been removed

```ts
import { createStore } from '@xstate/store';

const store = createStore({
  context: { count: 0 },
  on: {
    increment: (context, event: { by: number }) => ({
      ...context,
      count: context.count + event.by,
    }),
  },
});

// Sending an event object:
store.send({ type: 'increment', by: 5 });

// Triggering an event (equivalent to the above):
store.trigger.increment({ by: 5 });
```

## Triggering Events

The `store.trigger` API is a more ergonomic way to send events to the store:

```ts
import { createStore } from '@xstate/store';

const store = createStore({
  context: { count: 0 },
  on: {
    increment: (context, event: { by: number }) => ({
      ...context,
      count: context.count + event.by,
    }),
  },
});

// Sending an event object:
store.send({ type: 'increment', by: 5 });

// highlight-start
// Triggering an event:
store.trigger.increment({ by: 5 });
// highlight-end
```

While you can still use `store.send(…)` to send events, the `store.trigger` API is more ergonomic, since it provides for immediate autocompletion of event types.

## Handling Effects

You can now enqueue effects in state transitions:

```ts
import { createStore } from '@xstate/store';

const store = createStore({
  context: {
    count: 0,
  },
  on: {
    incrementDelayed: (context, event, enq) => {
      enq.effect(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        store.send({ type: 'increment' });
      });
      return context;
    },
    increment: (context) => ({ ...context, count: context.count + 1 }),
  },
});
```

You might be wondering why we use `enq.effect(…)` instead of directly executing side effects in the transition. The answer is simple: **state transitions must be pure functions**. This makes it possible to compute the next state and its effects without actually executing those effects, which will be available in a [future `store.transition(state, event)` API](https://github.com/statelyai/xstate/pull/5215).

Internally, XState Store v3 computes a tuple of the next state and the effects to be executed `const [nextState, effects] = store.transition(state, event)`. Then, it notifies all observers with the next state, and executes the effects in the background.

<details>
<summary>Here's an example showing the difference:</summary>

```ts
// ❌ Impure store - side effects mixed with state updates
const impureStore = createStore({
  context: { count: 0 },
  on: {
    incrementDelayed: (context) => {
      // Bad: This directly executes side effects in the transition
      setTimeout(() => {
        impureStore.send({ type: 'increment' });
      }, 1000);
      return context;
    },
    increment: (context) => ({
      ...context,
      count: context.count + 1,
    }),
  },
});

// ✅ Pure store - effects are declared separately
const pureStore = createStore({
  context: { count: 0 },
  on: {
    incrementDelayed: (context, _event, enq) => {
      // Good: Effects are declared separately and handled by the store
      enq.effect(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        pureStore.send({ type: 'increment' });
      });
      return context;
    },
    increment: (context) => ({
      ...context,
      count: context.count + 1,
    }),
  },
});
```

</details>

## Emitting Events

XState Store v3 introduces a structured way to define and emit events:

```typescript
const store = createStore({
  context: { count: 0 },
  emits: {
    increased: (payload: { upBy: number }) => {
      // Optional side effects can go here
    },
  },
  on: {
    increment: (ctx, ev: { by: number }, enq) => {
      enq.emit.increased({ upBy: ev.by });
      return { ...ctx, count: ctx.count + ev.by };
    },
  },
});
```

This replaces the previous `types: { … }` configuration.

## Selectors

XState Store v3 introduces selectors that enable efficient state selection and subscription. Selectors allow you to:

- Get the current value of a specific part of the state
- Subscribe to changes in that specific part of the state
- Only receive updates when the selected value actually changes
- Control when updates happen with custom equality functions

Here's how to use selectors:

```ts
import { createStore } from '@xstate/store';

const store = createStore({
  context: {
    position: { x: 0, y: 0 },
    name: 'John',
    age: 30,
  },
  on: {
    positionUpdated: (
      context,
      event: { position: { x: number; y: number } },
    ) => ({
      ...context,
      position: event.position,
    }),
  },
});

// Create a selector for the position
const position = store.select((state) => state.context.position);

// Get the current position
position.get(); // { x: 0, y: 0 }

// Subscribe to position changes
position.subscribe((position) => {
  console.log('Position updated:', position);
});

// Update the position
store.trigger.positionUpdated({ position: { x: 100, y: 200 } });
// Logs: Position updated: { x: 100, y: 200 }
```

You can also provide a custom equality function to control when subscribers are notified:

```ts
import { shallowEqual } from '@xstate/store';

// Only notify when position changes (shallow equality)
const position = store.select((state) => state.context.position, shallowEqual);
```

This is particularly useful when selecting objects or arrays where you want to prevent unnecessary updates.

## The `useStore()` Hook

XState Store v3 introduces a new `useStore()` hook that allows you create a **local store** in your React components:

```tsx
import { useStore, useSelector } from '@xstate/store/react';

function Counter(props: { initialCount?: number }) {
  const store = useStore({
    context: {
      count: props.initialCount ?? 0,
    },
    emits: {
      increased: (payload: { upBy: number }) => {},
    },
    on: {
      inc: (ctx, { by }: { by: number }, enq) => {
        enq.emit.increased({ upBy: by });
        return { ...ctx, count: ctx.count + by };
      },
    },
  });
  const count = useSelector(store, (state) => state.count);

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={() => store.trigger.inc({ by: 1 })}>
        Increment by 1
      </button>
      <button onClick={() => store.trigger.inc({ by: 5 })}>
        Increment by 5
      </button>
    </div>
  );
}
```

The `useStore()` hook is a React hook that returns a store instance. You can:

- send events to the store via `store.trigger.inc({ by: 1 })` or `store.send({ type: 'inc', by: 1 })`
- select state via `useSelector(store, (state) => state.count)`
- listen to emitted events via `useEffect(…, [store])` to react to them:

```tsx
// …
useEffect(() => {
  const sub = store.on('increased', ({ upBy }) => {
    console.log(`Count increased by ${upBy}`);
  });

  return sub.unsubscribe;
}, [store]);
// …
```

## What's next?

We want `@xstate/store` to remain a small, simple, and focused library for state management. A few features were added to this version, but we still aim to keep the API surface area small.

If you've used Zustand, Redux, Pinia, or XState, you'll find `@xstate/store` very familiar. Please keep in mind that you should choose the state management library that best suits your requirements and your team's preferences. However, it is straightforward to migrate to `@xstate/store` from Redux, Zustand, Pinia, XState, or other state management libraries if needed (and vice versa).

Our goal with `@xstate/store` is to provide a simple yet powerful _event-based_ state management solution that is type-safe. We believe that indirect (event-based) state management leads to better organization of application logic, especially as it grows in complexity, and `@xstate/store` is a great starting point for that approach.

Give it a try, and feel free to ask any questions in [our Discord](https://discord.gg/xstate) or report bugs in [the XState GitHub repo](https://github.com/statelyai/xstate/issues). We're always looking for feedback on how we can improve the experience!
