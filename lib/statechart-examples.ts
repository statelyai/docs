import { harelStatechartExamples } from './harel-statechart-examples';
import coffeeOrder from '@/public/assets/statecharts/examples/coffee-order.json';
import coffeeNested from '@/public/assets/statecharts/examples/coffee-nested.json';
import coffeeDonut from '@/public/assets/statecharts/examples/coffee-donut-parallel.json';

export const statechartExamples = {
  ...harelStatechartExamples,
  'coffee-order': {
    machine: coffeeOrder,
    sourceFile: '/assets/statecharts/examples/coffee-order.json',
    width: 300,
    height: 465,
  },
  'coffee-nested': {
    machine: coffeeNested,
    sourceFile: '/assets/statecharts/examples/coffee-nested.json',
    width: 620,
    height: 540,
  },
  'coffee-donut-parallel': {
    machine: coffeeDonut,
    sourceFile: '/assets/statecharts/examples/coffee-donut-parallel.json',
    width: 660,
    height: 390,
  },
};

export type StatechartExampleId = keyof typeof statechartExamples;
export type StatechartColorMode = 'light' | 'dark' | 'system';

function encodeExample(example: StatechartExampleId): string {
  const bytes = new TextEncoder().encode(
    JSON.stringify(statechartExamples[example].machine),
  );
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
}

export function statechartExampleEditURL(example: StatechartExampleId): string {
  const url = new URL('https://editor.stately.ai/embed');
  url.searchParams.set('machine', encodeExample(example));
  url.searchParams.set('format', 'xstate-json');
  url.searchParams.set('mode', 'editing');
  url.searchParams.set('source', 'docs-statecharts');
  return url.toString();
}

export function statechartExampleURL(
  example: StatechartExampleId,
  theme: StatechartColorMode = 'system',
): string {
  const machine = encodeExample(example);
  const url = new URL('https://editor.stately.ai/viz');
  const entry = statechartExamples[example];
  url.searchParams.set(
    'source',
    'source' in entry ? entry.source : 'docs-statecharts',
  );
  url.searchParams.set('activePanels', '');
  url.hash = new URLSearchParams({
    machine,
    format: 'xstate-json',
    theme,
    chrome: 'none',
    canvasSlots: 'viewportControls,simulationControls',
    topBar: '0',
    expanded: '1',
    panels: 'none',
  }).toString();
  return url.toString();
}
