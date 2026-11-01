import coffeeOrder from '@/public/assets/statecharts/examples/coffee-order.json';
import coffeeNested from '@/public/assets/statecharts/examples/coffee-nested.json';
import coffeeDonut from '@/public/assets/statecharts/examples/coffee-donut-parallel.json';

export const statechartExamples = {
  'coffee-order': { machine: coffeeOrder, width: 300, height: 465 },
  'coffee-nested': { machine: coffeeNested, width: 620, height: 540 },
  'coffee-donut-parallel': { machine: coffeeDonut, width: 660, height: 390 },
};

export type StatechartExampleId = keyof typeof statechartExamples;

export function statechartExampleURL(example: StatechartExampleId): string {
  const bytes = new TextEncoder().encode(
    JSON.stringify(statechartExamples[example].machine),
  );
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const machine = btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
  const url = new URL('https://editor.stately.ai/viz');
  url.searchParams.set('source', 'docs-statecharts');
  url.hash = new URLSearchParams({
    machine,
    format: 'xstate-json',
    chrome: 'plain',
    theme: 'light',
    interactive: '1',
    panels: 'none',
  }).toString();
  return url.toString();
}
