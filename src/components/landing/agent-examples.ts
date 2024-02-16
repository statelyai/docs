export const joke = `import OpenAI from 'openai';
import { fromPromise, setup } from 'xstate';
import { createAgent, createOpenAIAdapter } from '@statelyai/agent';
import { jokeRater } from './agents';

// Set up the services and models you want to use.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const llmAdapter = createOpenAIAdapter(openai, {
  model: 'gpt-3.5-turbo-1106',
});

// Stately Agents are state machine constructed XState actors.
// They accomplish goals by using other actors to perform tasks.
//
// Actors are built "from" some type of logic (the actor's logical model/brain/blueprint). 
// This describes how the actor should change behavior when receiving an event. 
// Actor logic can be scaffolded from general types like state machines,
// promises using \`fromPromise()\`,
// or more specific ones like \`fromChat()\`.
//
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

// Create the agent and start it.
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

const agent = createAgent(jokerAgentLogic);
agent.start();

// Send events to the agent to give it instructions.
// How it handles them will depend on its current state.
// This gives developers more safety and control.
agent.send({ type: 'giveTopic', topic: 'chickens' });

// See what the agent is doing at any time.
agent.subscribe((state) => {
  console.log(state.value, state.context);
})`