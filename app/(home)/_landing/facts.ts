// XState facts for the OpenSource fact strip. Values are rounded down from
// primary sources on the as-of date; refresh them before each launch.
export const xstateFacts: { label: string; value: string; source: string; asOf: string }[] = [
  {
    label: 'npm downloads a week',
    value: '3.2M+',
    source: 'api.npmjs.org/downloads/point/last-week/xstate (3,282,723)',
    asOf: '2026-10-22',
  },
  {
    label: 'GitHub stars',
    value: '30K+',
    source: 'api.github.com/repos/statelyai/xstate (30,353)',
    asOf: '2026-10-24',
  },
  {
    label: 'repositories depend on it',
    value: '338K+',
    source: 'github.com/statelyai/xstate/network/dependents (338,469)',
    asOf: '2026-10-24',
  },
  {
    label: 'years in production',
    value: '10',
    source: 'github.com/statelyai/xstate, project history from 2016',
    asOf: '2026-10-24',
  },
];
