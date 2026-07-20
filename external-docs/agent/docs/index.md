---
title: "Agents"
description: "Author AI agents as typed XState state machines, where the machine decides and the host executes."
sourcePath: "docs/index.md"
sourceUrl: "https://github.com/statelyai/docs/blob/main/external-docs/agent/docs/index.md"
---

> **Alpha:** `@statelyai/agent` 2.0 is in alpha. APIs can change between releases; pin an exact version. Feedback: [github.com/statelyai/agent](https://github.com/statelyai/agent/issues).

## Overview

`@statelyai/agent` lets you author an AI agent as a typed XState state machine. The machine is a portable blueprint of what your agent can do; it never talks to a model directly. The core idea: **the machine decides, the host executes.**

The **machine** is the decision layer. It declares:

- which states exist
- which transitions are legal (enforced by guards)
- which model calls (**text requests** and **decisions**) each state makes
- which events the model may choose right now

The **host** is the execution layer. It supplies an executor set: three plain functions (`generateText`, `streamText`, `decide`) that take plain request objects and return plain results. `runAgent` drives the machine and calls them whenever the machine needs a model. Because the machine only knows the executor contract, the same machine runs unchanged against the Vercel AI SDK, Cloudflare Workers AI, a raw provider fetch, or anything else.

A [decision](/docs/packages/agent/decisions) is where this matters most: the model chooses exactly one **currently-legal** machine event, not free text and not an arbitrary tool call. An illegal choice is rejected before it takes effect, so illegal behavior is impossible by construction, not discouraged by a prompt.

## Why state machines for agents

- **Legal by construction.** The machine and its guards define every path. The model cannot drive the agent into a state you did not author.
- **Portable.** No dependency on any model SDK. Swap hosts, not agents.
- **Inspectable.** States, transitions, and requests are data you can read, diagram, and reason about before anything runs.
- **Serializable.** Every settle point produces a plain, JSON-serializable snapshot. Persist it anywhere and resume later.

Unlike a hand-rolled `while` loop or a graph framework, control flow is a state machine you can inspect, test, and resume, and the model can only ever pick a legal event. See [how this compares](/docs/packages/agent/comparison).

## Three ways in

- **Author a new agent.** Describe states, decisions, and typed requests, run locally with `runAgent`, then test and inspect it with no API key. Eject to any framework or runtime via `provideExecutors` with zero machine changes. Start at the [Quickstart](/docs/packages/agent/quickstart), then [Eject to your stack](/docs/packages/agent/eject).
- **Retrofit an existing agent.** Have a `while` loop or tangled control flow? Your existing SDK calls, tools, and retry code become the executors; the machine replaces only the control flow and runs in your existing setup. See [Migrating from a loop](/docs/packages/agent/from-a-loop).
- **Copy a known pattern.** ReAct, reflection, plan-and-execute, RAG, supervisor, swarm handoff, and more, each a single runnable file you lift in 60 seconds. Browse [Agent patterns](/docs/packages/agent/patterns).

## A quick teaser



```ts
import { z } from "zod";
import { runAgent, setupAgent } from "@statelyai/agent";
import { createAiSdkExecutors, defineModels } from "@statelyai/agent/ai-sdk";
import { openai } from "@ai-sdk/openai";

const models = defineModels({ quick: openai("gpt-5.4-mini") });
const answerSchema = z.object({ answer: z.string() });

const agentSetup = setupAgent({
  models,
  context: z.object({ prompt: z.string(), answer: z.string().nullable() }),
  input: z.object({ prompt: z.string() }),
  output: answerSchema,
  requests: {
    answerQuestion: {
      schemas: { input: z.object({ prompt: z.string() }), output: answerSchema },
      model: "quick",
      prompt: ({ input }) => input.prompt,
    },
  },
});

const machine = agentSetup.createMachine({
  context: ({ input }) => ({ prompt: input.prompt, answer: null }),
  initial: "answering",
  states: {
    answering: {
      invoke: {
        src: "answerQuestion",
        input: ({ context }) => ({ prompt: context.prompt }),
        onDone: ({ output }) => ({ target: "done", context: { answer: output.answer } }),
      },
    },
    done: { type: "final", output: ({ context }) => ({ answer: context.answer ?? "" }) },
  },
});

const result = await runAgent(machine, {
  input: { prompt: "Why state machines?" },
  executors: createAiSdkExecutors({ models }),
});

if (result.status === "done") console.log(result.output.answer);
```

See the [Quickstart](/docs/packages/agent/quickstart) for a step-by-step walkthrough.

## Alpha status



The API changed completely in 2.0 and is still settling. Expect breaking changes before 2.0 stable.

Explicitly not shipped yet:

- **Storage/checkpointer adapters.** Persisting snapshots or event logs is a documented recipe, not a package.
- **OpenTelemetry exporter.** Build your own from the observation seams on `runAgent`.
- **SSE/WebSocket transport helpers.** Host your own stream over what `onChunk` gives you.
- **Dynamic-parallelism primitive.** Fan-out is plain `Promise.all(...)` over host actors.
- **Visualization tooling.** Stately Studio and a VS Code extension own diagramming and inspection.

If something here blocks you, or the API surface feels wrong, open an issue. This alpha exists to find that out before 2.0 stable.

## Documentation map

- [Quickstart](/docs/packages/agent/quickstart): install and run your first agent machine end to end.
- [Eject to your stack](/docs/packages/agent/eject): one machine, three hosts (local, Express, Cloudflare), zero machine changes.
- [Agent machines](/docs/packages/agent/machines): `setupAgent`, states, invokes, typed context, and guards.
- [Decisions](/docs/packages/agent/decisions): the model choosing exactly one currently-legal machine event.
- [Plans](/docs/packages/agent/plans): the multi-event decision, `agent.plan`.
- [Text requests](/docs/packages/agent/text-requests): typed text and structured-output model calls.
- [Messages](/docs/packages/agent/messages): the parts-based `AgentMessage` model.
- [Human in the loop](/docs/packages/agent/human-in-the-loop): idle-first pauses and resuming by snapshot.
- [Hosts](/docs/packages/agent/hosts): executors, the AI SDK adapter, and writing your own.
- [Observability](/docs/packages/agent/observability): the Stately Inspector locally, and the trace stream to OpenTelemetry in production.
- [Steps](/docs/packages/agent/steps): the lower-level step path for durable hosts.
- [Machines as data](/docs/packages/agent/machines-as-data): authoring an agent machine as JSON.
- [Multi-agent](/docs/packages/agent/multi-agent): sub-agents and child actors.
- [Migrating from a loop](/docs/packages/agent/from-a-loop): convert a hand-rolled `while` loop into an agent machine.
- [Agent patterns](/docs/packages/agent/patterns): ReAct, reflection, RAG, supervisor, and more as copy-paste machines.
- [Examples](/docs/packages/agent/examples): a curated index of runnable examples.
