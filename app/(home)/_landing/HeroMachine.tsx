'use client';
// The hero's checkout machine, simulated on a loop the way the editor plays
// one: a transition is taken (its path lights up, the target state flashes),
// the active outline moves, the next enabled transitions ring. The run goes
// idle → cart → address → payment → declined → cart → address → payment →
// confirmed, holds, fades, and starts over. It pauses while off screen or
// in a background tab, and stands still under prefers-reduced-motion.
import { useEffect, useRef, useState } from 'react';
import { checkoutMachine } from './machines';
import { Statechart, edgeKey, type Machine, type Sim } from './Statechart';

type Step = [from: string, event: string, to: string];
const run: Step[] = [
  ['idle', 'ADD_ITEM', 'cart'],
  ['cart', 'CHECKOUT', 'address'],
  ['address', 'SUBMIT', 'payment'],
  ['payment', 'FAIL', 'declined'],
  ['declined', 'CANCEL', 'cart'],
  ['cart', 'CHECKOUT', 'address'],
  ['address', 'SUBMIT', 'payment'],
  ['payment', 'PAID', 'confirmed'],
];
const key = (s: Step) => `${s[0]}:${s[1]}`;
const stateAt = (i: number) => (i === 0 ? 'idle' : run[i - 1][2]);
const enabledFrom = (m: Machine, state: string) => m.edges.filter((e) => e.from === state).map(edgeKey);

// rest: sitting in a state. tap: a transition fires. clear: highlights fade before the restart.
type Phase = { i: number; at: 'rest' | 'tap' | 'clear' };
const REST = 1100;
const TAP = 260;
const HOLD = 1800;
const CLEAR = 900;

function next(p: Phase): Phase {
  if (p.at === 'tap') return { i: p.i + 1, at: 'rest' };
  if (p.at === 'clear') return { i: 0, at: 'rest' };
  return p.i < run.length ? { i: p.i, at: 'tap' } : { i: p.i, at: 'clear' };
}

function simFor(m: Machine, p: Phase): Sim | undefined {
  if (p.at === 'clear') return undefined;
  const state = stateAt(p.i);
  const sim: Sim = { active: state, enabled: enabledFrom(m, state), taken: p.i > 0 ? key(run[p.i - 1]) : undefined };
  if (p.at === 'tap') {
    const s = run[p.i];
    sim.taken = key(s);
    sim.preview = s[2];
  }
  return sim;
}

// Paused in payment, with the ring on PAID and FAIL: the still frame.
const still: Phase = { i: 3, at: 'rest' };

export function HeroMachine({ label, description }: { label: string; description: string }) {
  const [phase, setPhase] = useState<Phase>({ i: 0, at: 'rest' });
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const slot = useRef<HTMLDivElement>(null);

  // Play only while visible, in a foreground tab, and motion is welcome.
  useEffect(() => {
    const el = slot.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () => {
      setReduced(reduce.matches);
      setPlaying(visible && !document.hidden && !reduce.matches);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', update);
    reduce.addEventListener('change', update);
    update();
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', update);
      reduce.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const delay = phase.at === 'tap' ? TAP : phase.at === 'clear' ? CLEAR : phase.i < run.length ? REST : HOLD;
    const t = setTimeout(() => setPhase(next), delay);
    return () => clearTimeout(t);
  }, [playing, phase]);

  const shown = reduced ? still : phase;
  const wide = simFor(checkoutMachine.wide, shown);
  const tall = simFor(checkoutMachine.tall, shown);
  const state = wide?.active;
  const final = state === 'confirmed';
  return (
    <>
      <div
        ref={slot}
        data-machine-slot="hero"
        className="relative lg:absolute lg:inset-y-0 lg:left-[56%] xl:left-[55%] lg:right-0 flex items-center justify-center px-4 sm:px-10 lg:pl-0 lg:pr-10 pb-8 lg:pb-0"
      >
        <Statechart machine={checkoutMachine.wide} sim={wide ?? null} label={label} description={description} className="hidden sm:block w-full h-auto max-w-[44rem]" />
        <Statechart machine={checkoutMachine.tall} sim={tall ?? null} label={label} description={description} className="sm:hidden w-full h-auto max-w-[26rem]" />
      </div>

      {/* status bar */}
      <div className="relative h-8 border-t border-[var(--sp-border)] bg-[var(--sp-canvas)] flex items-center px-4 sm:px-10 sp-mono text-[11.5px] text-[var(--sp-muted-2)] whitespace-nowrap overflow-hidden">
        <span className="truncate">
          7 states · 8 transitions · <span className="text-[var(--sp-warn)]">1 unreachable</span> · example: checkout
          <span aria-live="off" style={{ opacity: state ? 1 : 0, transition: 'opacity 0.3s ease-out' }}>
            {' '}· state: <span className="text-[var(--sp-sim)]">{state ?? 'idle'}</span>
            {final && ' (final)'}
          </span>
        </span>
      </div>
    </>
  );
}
