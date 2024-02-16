export const joke = `// Stately Agents are XState actors that are guided by a state machine.
// They can send and receive events, spawn other agents, 
// and make decisions based on their current state.
// To set one up we need to give it abilities then define its internal state machine.

import OpenAI from 'openai';
import { fromPromise, setup } from 'xstate';
import { createAgent, createOpenAIAdapter } from '@statelyai/agent';
import { jokeRater } from './agents';

// 1. Create an LLM adapter.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const llmAdapter = createOpenAIAdapter(openai, {
  model: 'gpt-3.5-turbo-1106',
});

// 2. Set up the abilities the agent will use.
// fromChat() lets the agent perform tasks using a basic prompt template.
const getJokeCompletion = llmAdapter.fromChat(
  (topic: string) => \`Tell me a joke about \${topic}.\`
);

// fromEvent() lets the agent decide what to do based on the prompt
// from the events connected to the current state.
const decide = llmAdapter.fromEvent(
  (lastRating: string) =>
    \`Choose what to do next, given the previous rating of the joke: \${lastRating}\`
);

// Not all abilities need to involve LLM processing.
const getTopic = fromPromise(async () => {
  const topic = await new Promise<string>((res) => {
    console.log('Give me a joke topic:');
    const listener = (data: Buffer) => {
    const result = data.toString().trim();
    process.stdin.off('data', listener);
    res(result);
    };
    process.stdin.on('data', listener);
  });
  return topic;
});

const schemas = createSchemas({
  // ... Define schemas ...
});

// 3. Create a state machine that describes the agent's behavior.
const jokerAgentLogic = setup({
  schemas,
  types: schemas.types,
  actors: {
    getJokeCompletion,
    getTopic,
    rateJoke: jokeRater,
    decide,
  },
}).createMachine(
  // ... Define an XState machine that invokes abilities as needed ...
);

// 4. Create the agent and start it.
const agent = createAgent(jokerAgentLogic);
agent.start();

// 5. Use the agent.
// Send events to the agent to give it instructions.
// How it handles them will depend on its current state.
// This gives developers more safety and control.
agent.send({ type: 'giveTopic', topic: 'chickens' });

// See what the agent is doing at any time.
agent.subscribe((state) => {
  console.log(state.value, state.context);
})`