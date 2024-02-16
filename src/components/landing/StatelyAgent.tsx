import React from 'react';
import { TextLink, classNames, ButtonLink } from './SharedComponents';
import { GithubIcon } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';
import { joke } from './agent-examples';

export function StatelyAgent() {
  return (
    <>
      <AgentIntro />
      <CodeExample />
      <Benefits />
      <div className="text-center mt-36">
        <ButtonLink
          size="large"
          background="pink"
          href="https://www.github.com/statelyai/agent"
        >
          <GithubIcon className="mr-4" /> Try out Stately Agent and XState
        </ButtonLink>
      </div>
    </>
  );
}

function AgentIntro() {
  return (
    <section className="pt-36 pb-72 bgimage-gradient-blue">
      <div className="container max-w-7xl">
        <h1 className="m-auto text-center max-w-2xl  text-5xl font-semibold tracking-tight md:text-6xl lg:text-6xl md:leading-tight lg:leading-tight text-white/90 drop-shadow-sm mb-24">
          Build reliable AI agents with state machines.
        </h1>

        <P>
          <TextLink href="https://github.com/statelyai/agent">
            Stately Agent
          </TextLink>{' '}
          enhances{' '}
          <TextLink href="https://github.com/statelyai/xstate">XState</TextLink>{' '}
          with actors that make it easy to harness the power of LLMs.
        </P>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          <FeatureBox>
            <FeatureP>
              Guide the agent with a pipeline of distinct steps that can be
              created visually using{' '}
              <TextLink href="/">Stately Studio</TextLink>.
            </FeatureP>
          </FeatureBox>
          <FeatureBox>
            <FeatureP>
              Agents can decide which action to take from the events available{' '}
              <em>at the current step</em>.
            </FeatureP>
          </FeatureBox>

          <FeatureBox>
            <FeatureP>
              Cycles let agents try steps again, perhaps with a refined input.
            </FeatureP>
          </FeatureBox>
        </div>
        <div className="w-full rounded-md shadow-md max-w-6xl m-auto">
          <img
            alt={`This state machine represents an agent that can play Tic-Tac-Toe against itself. It starts in the "playing" state and has two sub-states: "o" and "x", representing the two players. The agent takes turns playing as "o" and "x" by invoking a bot. Each player's move is validated before updating the game board. The state machine also has a "gameOver" state, which is entered when the game ends. It has two sub-states: "winner" and "draw", representing the different outcomes of the game. After each move, the state machine checks if there is a winner or if the game is a draw. If there is a winner, it transitions to the "winner" sub-state of the "gameOver" state. If the game is a draw, it transitions to the "draw" sub-state of the "gameOver" state. In the "gameOver" state, there is an option to reset the game and go back to the "playing" state. Overall, this state machine allows an agent to play Tic-Tac-Toe against itself and handles the game logic, including validating moves and determining the outcome of the game.`}
            src="/assets/landing/tictactoe.jpg"
            className="w-full mt-24 mb-12 rounded-md border-[0.5px] shadow-2xl shadow-blue-900 border-blue-850"
          />
        </div>
        <div className="flex flex-col items-center">
          <P>
            Write familiar JavaScript/TypeScript. Full control. <br />
            No lock-in. Open source.
          </P>
          <div>
            <ButtonLink
              size="large"
              background="pink"
              href="https://www.stately.ai/docs/agents"
            >
              Read the docs
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeExample() {
  return (
    <section className="container">
      <H2 styleOverrides="text-center mb-16">How Stately Agent works.</H2>
      <div className="max-w-5xl m-auto border-[0.5px] shadow-2xl shadow-blue-900 border-blue-850 rounded-3xl p-4 md:p-8 lg:p-16 bg-[rgb(1,22,39)]">
        <Code code={joke} />
      </div>
      <div className="flex justify-center mt-24">
        <ButtonLink
          background="orange"
          size="medium"
          href="https://github.com/statelyai/agent/tree/main/examples"
        >
          <GithubIcon className="mr-4" /> See complete examples
        </ButtonLink>
      </div>
    </section>
  );
}

export const Code = ({ code }) => (
  <Highlight theme={themes.jettwaveDark} code={code} language="tsx">
    {({ style, tokens, getLineProps, getTokenProps }) => (
      <pre style={style}>
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line })}>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);

function Benefits() {
  return (
    <section className="container pt-72 max-w-7xl m-auto">
      <H2 styleOverrides="text-center">Why use state machines with LLMs?</H2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16 mb-24 justify-center align-center">
        <FeatureBox>
          <FeatureP>
            Data can be processed in consistent, predictable ways.
          </FeatureP>
        </FeatureBox>
        <FeatureBox>
          <FeatureP>
            Performance can be improved by focusing on one crisply defined
            subtask at a time.
          </FeatureP>
        </FeatureBox>
        <FeatureBox>
          <FeatureP>
            Work can be distributed with subtasks being handled in different,
            explicitly designed ways.
          </FeatureP>
        </FeatureBox>
        <FeatureBox>
          <FeatureP>
            The output of each step can be validated, tested, and improved
            independently.
          </FeatureP>
        </FeatureBox>
        <FeatureBox>
          <FeatureP>
            They can be easier to maintain as requirements change and new AI
            capabilities are released.
          </FeatureP>
        </FeatureBox>
        <FeatureBox>
          <FeatureP>
            Easily connect multiple models and services, swapping out components
            as the frontier advances.
          </FeatureP>
        </FeatureBox>
      </div>
    </section>
  );
}

function H2({
  children,
  color,
  styleOverrides,
}: {
  children: React.ReactNode;
  color?: string;
  styleOverrides?: string;
}) {
  const numberBgColor =
    color === 'pink'
      ? 'bg-pink-600'
      : color === 'green'
      ? 'bg-green-600'
      : color === 'purple'
      ? 'bg-purple-600'
      : color === 'orange'
      ? 'bg-orange-600'
      : color === 'teal'
      ? 'bg-teal-600'
      : 'text-gray-600';
  const otherNumberStyles = `flex justify-center items-center rounded-full w-16 h-16 select-none shadow-lg`;

  const otherTextStyles = 'font-extrabold text-5xl pl-8 drop-shadow-sm';

  const textStyles = classNames(
    'text-white/90',
    otherTextStyles,
    styleOverrides,
  );
  return <h2 className={textStyles}>{children}</h2>;
}

function FeatureBox({ children, imgSrc = '/landing/DELETE-1.png' }) {
  return (
    <div className="flex flex-1 rounded-3xl bg-gradient-to-b from-gray-800/50 to-gray-800/10 border-[0.5px] shadow-md shadow-blue-900 border-blue-850 py-6 px-8 gap-12">
      {children}
    </div>
  );
}

function P({ children, color = 'text-white/60' }) {
  const otherTextStyles =
    'm-auto max-w-xl mt-12 mb-12 text-lg tracking-tight md:text-xl lg:text-2xl leading-normal md:leading-normal lg:leading-normal text-white/60 drop-shadow-sm';
  const textStyles = classNames('text-white/90', otherTextStyles);
  return <p className={textStyles}>{children}</p>;
}

function FeatureP({ children }) {
  return (
    <p className="text-sm leading-normal md:text-base md:leading-normal lg:text-lg lg:leading-normal text-white/90">
      {children}
    </p>
  );
}

function P2({ children }) {
  const otherTextStyles =
    'm-auto max-w-2xl mt-12 mb-12 text-lg tracking-tight md:text-xl lg:text-2xl leading-normal md:leading-normal lg:leading-normal text-white/60 drop-shadow-sm';
  const textStyles = classNames('text-white/90', otherTextStyles);
  return <p className={textStyles}>{children}</p>;
}
