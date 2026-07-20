---
title: "Examples"
description: "A curated index of runnable @statelyai/agent examples, grouped by what they demonstrate."
sourcePath: "docs/examples.md"
sourceUrl: "https://github.com/statelyai/docs/blob/main/external-docs/agent/docs/examples.md"
---

> **Alpha:** `@statelyai/agent` 2.0 is in alpha. APIs can change between releases; pin an exact version. Feedback: [github.com/statelyai/agent](https://github.com/statelyai/agent/issues).

## Running the examples

Examples live under `examples/`, one flat directory per example with an `index.ts` entrypoint. Clone the repo, install dependencies, and run any one with `tsx`:

```bash
OPENAI_API_KEY=... npx tsx examples/<name>/index.ts
```

Every example is dual-mode: run it directly with a real model as above, while its tests use injected mocks. Most expect a provider key in the environment (e.g. `OPENAI_API_KEY`); each file notes what it needs at the top.



## Start here

These seven cover the core ideas: text requests, decisions, messages, and JSON authoring.

- [twenty-questions](https://github.com/statelyai/agent/blob/main/examples/twenty-questions/index.ts): a decision loop where the model picks one legal event (ASK or GUESS) each turn; guard-enforced legality, machine-held score, play-again reset, machine-owned user prompts.
- [joke](https://github.com/statelyai/agent/blob/main/examples/joke/index.ts): a minimal streaming text workflow.
- [email-drafter](https://github.com/statelyai/agent/blob/main/examples/email-drafter/index.ts): reusable text logic, parts-based [messages](/docs/packages/agent/messages), schema-typed state and transition meta.
- [game-agent](https://github.com/statelyai/agent/blob/main/examples/game-agent/index.ts): `allowedEvents` narrowed as a function of input, gating moves by HP.
- [go-fish](https://github.com/statelyai/agent/blob/main/examples/go-fish/index.ts): hidden-information play with a checking-win → agent → human loop; the model chooses requests, the machine enforces the rules.
- [json-agent](https://github.com/statelyai/agent/blob/main/examples/json-agent/index.ts): a full workflow (decision, text request, idle human step) authored as a real `.json` file, run with `runAgent`. See [Machines as data](/docs/packages/agent/machines-as-data).
- [described-workflow](https://github.com/statelyai/agent/blob/main/examples/described-workflow/index.ts): a plain XState machine with zero invokes (prompts live in state `description`s and `meta`), run via `runAgent`'s `getRequests` option, message log aggregated onto `snapshot.messages`.

## Human in the loop and persistence

These show the idle-first pause for human input and resuming a run by snapshot. See [Human in the loop](/docs/packages/agent/human-in-the-loop).

- [human-in-the-loop](https://github.com/statelyai/agent/blob/main/examples/human-in-the-loop/index.ts): a machine that settles idle to wait for a human, then resumes with the human's event, persisting a snapshot between iterations and resuming in a later process.
- [long-running-onboarding](https://github.com/statelyai/agent/blob/main/examples/long-running-onboarding/index.ts): a multi-day onboarding coordinator with durable typed state, two idle dormancy gates, delegated IT provisioning, JSON snapshot resume.
- [file-snapshot-store](https://github.com/statelyai/agent/blob/main/examples/file-snapshot-store/index.ts): a file-backed snapshot store for durable threads across processes.

## Host adapters and the step path

These implement the executor contract against different SDKs and runtimes, and use the lower-level step path for durable checkpointing. See [Hosts](/docs/packages/agent/hosts) and [Steps](/docs/packages/agent/steps).

- [ai-sdk-host](https://github.com/statelyai/agent/blob/main/examples/ai-sdk-host/index.ts): running with Vercel AI SDK host actors.
- [ai-sdk-game-host](https://github.com/statelyai/agent/blob/main/examples/ai-sdk-game-host/index.ts): a Vercel AI SDK step runner that checkpoints every model call.
- [openai-sdk-host](https://github.com/statelyai/agent/blob/main/examples/openai-sdk-host/index.ts): the same executor contract against the raw `openai` package (Chat Completions), no AI SDK in between.
- [anthropic-sdk-host](https://github.com/statelyai/agent/blob/main/examples/anthropic-sdk-host/index.ts): the same contract against the raw `@anthropic-ai/sdk` package (Messages API).
- [cloudflare-workers-ai-host](https://github.com/statelyai/agent/blob/main/examples/cloudflare-workers-ai-host/index.ts): a step runner against Cloudflare Workers AI's binding.
- [cloudflare-agent-host](https://github.com/statelyai/agent/blob/main/examples/cloudflare-agent-host/index.ts): a Cloudflare Agents host persisting snapshots in Durable Object state.

## Sub-agents and composition

These compose agent machines as sub-agents or child actors. See [Multi-agent](/docs/packages/agent/multi-agent).

- [subflows](https://github.com/statelyai/agent/blob/main/examples/subflows/index.ts): a nested child machine keeping its own executor binding.
- [ai-sdk-sub-agents](https://github.com/statelyai/agent/blob/main/examples/ai-sdk-sub-agents/index.ts): Vercel AI SDK ToolLoopAgent workers exposed as host-owned tools.
- [debate-sub-agents](https://github.com/statelyai/agent/blob/main/examples/debate-sub-agents/index.ts): a facilitator scheduling two event-based debater sub-agents.
- [long-running-onboarding](https://github.com/statelyai/agent/blob/main/examples/long-running-onboarding/index.ts): a coordinator invoking typed IT provisioning between two event-driven waits.
- [supervisor](https://github.com/statelyai/agent/blob/main/examples/supervisor/index.ts): a routing request whose structured output hands off to a format-specific worker.
- [swarm-handoff](https://github.com/statelyai/agent/blob/main/examples/swarm-handoff/index.ts): a persistent multi-agent network handing off between typed child actors across turns.

## Multi-step agent patterns

Common agent workflows expressed as explicit XState machines.

- [react-agent](https://github.com/statelyai/agent/blob/main/examples/react-agent/index.ts): ReAct as an explicit loop: one reason-or-act request per iteration (discriminated union: call a tool or answer), typed tool actors execute, a step-budget guard breaks the loop with a best-effort answer.
- [tool-calling](https://github.com/statelyai/agent/blob/main/examples/tool-calling/index.ts): the model selects a tool (structured output), typed tool actors execute, progress reported via transitions.
- [rag](https://github.com/statelyai/agent/blob/main/examples/rag/index.ts): retrieve (typed plain actor over a sample corpus) then a grounded answer, with conversational memory in context.
- [context-compaction](https://github.com/statelyai/agent/blob/main/examples/context-compaction/index.ts): a chat loop that bounds its own context window; a `compacting` state folds stale turns into a running summary once history passes a threshold, keeps the last N messages verbatim, and feeds the summary back as a system message.
- [plan-and-execute](https://github.com/statelyai/agent/blob/main/examples/plan-and-execute/index.ts): a planner request produces structured output, execution states iterate the plan (the ReWOO evidence-map idea).
- [sql-agent](https://github.com/statelyai/agent/blob/main/examples/sql-agent/index.ts): query generation, DB execution, and answer synthesis as separate typed states.
- [triage](https://github.com/statelyai/agent/blob/main/examples/triage/index.ts): structured-output support ticket triage.
- [parallel-streams](https://github.com/statelyai/agent/blob/main/examples/parallel-streams/index.ts): fan-out over parallel worker streams relayed through a side channel.
- [sse-transport](https://github.com/statelyai/agent/blob/main/examples/sse-transport/index.ts): relaying provider stream chunks over an SSE transport.

## Migration and observability

- [retrofit](https://github.com/statelyai/agent/blob/main/examples/retrofit/index.ts): a genuinely tangled hand-rolled agent (`before.ts`) refactored stepwise into a machine, each step shippable, with `simulateAgent` tests pinning the before/after behavior. The worked proof for [Migrating from a loop](/docs/packages/agent/from-a-loop).
- [langsmith-otel](https://github.com/statelyai/agent/blob/main/examples/langsmith-otel/index.ts): the `onTrace` stream mapped to OpenTelemetry spans and exported to LangSmith; prints the trace stream to stdout without keys. See [Observability](/docs/packages/agent/observability).

## AI SDK pattern set

The [Vercel AI SDK agent patterns](https://sdk.vercel.ai/docs/foundations/agents), each rebuilt as an explicit XState machine.

- [ai-sdk-marketing-chain](https://github.com/statelyai/agent/blob/main/examples/ai-sdk-marketing-chain/index.ts): a sequential chain.
- [ai-sdk-routing](https://github.com/statelyai/agent/blob/main/examples/ai-sdk-routing/index.ts): routing.
- [ai-sdk-parallel-review](https://github.com/statelyai/agent/blob/main/examples/ai-sdk-parallel-review/index.ts): parallel review.
- [ai-sdk-orchestrator-worker](https://github.com/statelyai/agent/blob/main/examples/ai-sdk-orchestrator-worker/index.ts): an orchestrator-worker fan-out.
- [ai-sdk-evaluator-optimizer](https://github.com/statelyai/agent/blob/main/examples/ai-sdk-evaluator-optimizer/index.ts): an evaluator-optimizer loop.

> **Note:** The full example index, including framework-comparison notes, lives in [examples/README.md](https://github.com/statelyai/agent/blob/main/examples/README.md).
