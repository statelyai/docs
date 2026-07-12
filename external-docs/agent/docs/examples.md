---
title: "Examples"
description: "A curated index of runnable @statelyai/agent examples, grouped by what they demonstrate."
sourcePath: "docs/examples.md"
sourceUrl: "https://github.com/statelyai/docs/blob/main/external-docs/agent/docs/examples.md"
---

## Running the examples

The examples live in the repo under `examples/`, one flat directory per example with an `index.ts` entrypoint. Clone the repo, install dependencies, and run any example directly with `tsx`:

```bash
OPENAI_API_KEY=... npx tsx examples/<name>/index.ts
```

Every example is dual-mode: run it directly with a real model as above, while its tests use injected mocks. Most examples that call a real model expect a provider key in the environment, for example `OPENAI_API_KEY`. Each file notes what it needs at the top.



## Start here

These five cover the core ideas: text requests, decisions, messages, and JSON authoring.

- [twenty-questions](./_assets/examples/twenty-questions/index.ts): a decision loop where the model picks one legal event (ASK or GUESS) each turn, with guard-enforced legality, machine-held score, play-again reset, and machine-owned user prompts.
- [joke](./_assets/examples/joke/index.ts): a minimal streaming text workflow.
- [email-drafter](./_assets/examples/email-drafter/index.ts): reusable text logic, parts-based [messages](/docs/packages/agent/messages), and schema-typed state and transition meta.
- [game-agent](./_assets/examples/game-agent/index.ts): `allowedEvents` narrowed as a function of input, gating moves by HP.
- [json-agent](./_assets/examples/json-agent/index.ts): a full workflow (decision, text request, idle human step) authored as a real `.json` file and run with `runAgent`. See [Machines as data](/docs/packages/agent/machines-as-data).

## Human in the loop and persistence

These show the idle-first pause for human input and resuming a run by snapshot. See [Human in the loop](/docs/packages/agent/human-in-the-loop).

- [human-in-the-loop](./_assets/examples/human-in-the-loop/index.ts): a machine that settles idle to wait for a human, then resumes with the human's event, persisting a snapshot between iterations and resuming in a later process.
- [long-running-onboarding](./_assets/examples/long-running-onboarding/index.ts): a multi-day onboarding coordinator with durable typed state, two idle dormancy gates, delegated IT provisioning, and JSON snapshot resume.
- [file-snapshot-store](./_assets/examples/file-snapshot-store/index.ts): a file-backed snapshot store for durable threads across processes.

## Host adapters and the step path

These implement the executor contract against different SDKs and runtimes, and use the lower-level step path for durable checkpointing. See [Hosts](/docs/packages/agent/hosts) and [Steps](/docs/packages/agent/steps).

- [ai-sdk-host](./_assets/examples/ai-sdk-host/index.ts): running with Vercel AI SDK host actors.
- [ai-sdk-game-host](./_assets/examples/ai-sdk-game-host/index.ts): a Vercel AI SDK step runner that checkpoints every model call.
- [openai-sdk-host](./_assets/examples/openai-sdk-host/index.ts): the same executor contract against the raw `openai` package (Chat Completions), no Vercel AI SDK in between.
- [anthropic-sdk-host](./_assets/examples/anthropic-sdk-host/index.ts): the same contract against the raw `@anthropic-ai/sdk` package (Messages API).
- [cloudflare-workers-ai-host](./_assets/examples/cloudflare-workers-ai-host/index.ts): a step runner against Cloudflare Workers AI's binding.
- [cloudflare-agent-host](./_assets/examples/cloudflare-agent-host/index.ts): a Cloudflare Agents host persisting snapshots in Durable Object state.

## Sub-agents and composition

These compose agent machines as sub-agents or child actors. See [Multi-agent](/docs/packages/agent/multi-agent).

- [subflows](./_assets/examples/subflows/index.ts): a nested child machine keeping its own executor binding.
- [ai-sdk-sub-agents](./_assets/examples/ai-sdk-sub-agents/index.ts): Vercel AI SDK ToolLoopAgent workers exposed as host-owned tools.
- [debate-sub-agents](./_assets/examples/debate-sub-agents/index.ts): a facilitator scheduling two event-based debater sub-agents.
- [long-running-onboarding](./_assets/examples/long-running-onboarding/index.ts): a coordinator invoking typed IT provisioning between two event-driven waits.
- [supervisor](./_assets/examples/supervisor/index.ts): a routing request whose structured output hands off to a format-specific worker.
- [swarm-handoff](./_assets/examples/swarm-handoff/index.ts): a persistent multi-agent network handing off between typed child actors across turns.

## Multi-step agent patterns

Common agent workflows expressed as explicit XState machines.

- [react-agent](./_assets/examples/react-agent/index.ts): ReAct as an explicit loop — one reason-or-act request per iteration (discriminated union: call a tool or answer), typed tool actors execute, a step-budget guard breaks the loop with a best-effort answer.
- [tool-calling](./_assets/examples/tool-calling/index.ts): the model selects a tool (structured output), typed tool actors execute, progress reported via transitions.
- [rag](./_assets/examples/rag/index.ts): retrieve (typed plain actor over a sample corpus) then a grounded answer, with conversational memory in context.
- [plan-and-execute](./_assets/examples/plan-and-execute/index.ts): a planner request produces structured output, execution states iterate the plan (keeps the ReWOO evidence-map idea).
- [sql-agent](./_assets/examples/sql-agent/index.ts): query generation, DB execution, and answer synthesis as separate typed states.
- [triage](./_assets/examples/triage/index.ts): structured-output support ticket triage.
- [parallel-streams](./_assets/examples/parallel-streams/index.ts): fan-out over parallel worker streams relayed through a side channel.
- [sse-transport](./_assets/examples/sse-transport/index.ts): relaying provider stream chunks over an SSE transport.

## AI SDK pattern set

The [Vercel AI SDK agent patterns](https://sdk.vercel.ai/docs/foundations/agents), each rebuilt as an explicit XState machine.

- [ai-sdk-marketing-chain](./_assets/examples/ai-sdk-marketing-chain/index.ts): a sequential chain.
- [ai-sdk-routing](./_assets/examples/ai-sdk-routing/index.ts): routing.
- [ai-sdk-parallel-review](./_assets/examples/ai-sdk-parallel-review/index.ts): parallel review.
- [ai-sdk-orchestrator-worker](./_assets/examples/ai-sdk-orchestrator-worker/index.ts): an orchestrator-worker fan-out.
- [ai-sdk-evaluator-optimizer](./_assets/examples/ai-sdk-evaluator-optimizer/index.ts): an evaluator-optimizer loop.

> **Note:** The full example index, including framework-comparison notes, lives in [examples/README.md](https://github.com/statelyai/agent/blob/main/examples/README.md).
