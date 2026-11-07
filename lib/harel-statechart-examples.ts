import captures from '@/public/assets/harel-statecharts/captures.json';
import harelFlat from '@/public/assets/harel-statecharts/examples/harel-flat.json';
import harelClustered from '@/public/assets/harel-statecharts/examples/harel-clustered.json';
import harelDisplays from '@/public/assets/harel-statecharts/examples/harel-displays.json';
import harelHistoryShallow from '@/public/assets/harel-statecharts/examples/harel-history-shallow.json';
import harelHistoryDeep from '@/public/assets/harel-statecharts/examples/harel-history-deep.json';
import harelHistorySelective from '@/public/assets/harel-statecharts/examples/harel-history-selective.json';
import harelUpdates from '@/public/assets/harel-statecharts/examples/harel-updates.json';
import harelParallel from '@/public/assets/harel-statecharts/examples/harel-parallel.json';
import harelProduct from '@/public/assets/harel-statecharts/examples/harel-product.json';
import harelAvionics from '@/public/assets/harel-statecharts/examples/harel-avionics.json';
import harelParallelEntry from '@/public/assets/harel-statecharts/examples/harel-parallel-entry.json';
import harelStopwatch from '@/public/assets/harel-statecharts/examples/harel-stopwatch.json';
import harelWatch from '@/public/assets/harel-statecharts/examples/harel-watch.json';
import harelBeepTest from '@/public/assets/harel-statecharts/examples/harel-beep-test.json';
import harelConditional from '@/public/assets/harel-statecharts/examples/harel-conditional.json';
import harelSelection from '@/public/assets/harel-statecharts/examples/harel-selection.json';
import harelTimeout from '@/public/assets/harel-statecharts/examples/harel-timeout.json';
import harelUnclustering from '@/public/assets/harel-statecharts/examples/harel-unclustering.json';
import harelActivities from '@/public/assets/harel-statecharts/examples/harel-activities.json';
import harelDigit from '@/public/assets/harel-statecharts/examples/harel-digit.json';
import harelTelephones from '@/public/assets/harel-statecharts/examples/harel-telephones.json';
import harelOverlapShared from '@/public/assets/harel-statecharts/examples/harel-overlap-shared.json';
import harelOverlap from '@/public/assets/harel-statecharts/examples/harel-overlap.json';
import harelOverlapInactive from '@/public/assets/harel-statecharts/examples/harel-overlap-inactive.json';
import harelConflict from '@/public/assets/harel-statecharts/examples/harel-conflict.json';
import harelBroadcastCycle from '@/public/assets/harel-statecharts/examples/harel-broadcast-cycle.json';
import harelSemantics from '@/public/assets/harel-statecharts/examples/harel-semantics.json';
import harelSimultaneous from '@/public/assets/harel-statecharts/examples/harel-simultaneous.json';

export const harelStatechartExamples = {
  'harel-flat': {
    machine: harelFlat,
    width: captures['harel-flat'].width,
    height: captures['harel-flat'].height,
    image: '/assets/harel-statecharts/screenshots/harel-flat.png',
    source: 'docs-harel-statecharts',
  },
  'harel-clustered': {
    machine: harelClustered,
    width: captures['harel-clustered'].width,
    height: captures['harel-clustered'].height,
    image: '/assets/harel-statecharts/screenshots/harel-clustered.png',
    source: 'docs-harel-statecharts',
  },
  'harel-displays': {
    machine: harelDisplays,
    width: captures['harel-displays'].width,
    height: captures['harel-displays'].height,
    image: '/assets/harel-statecharts/screenshots/harel-displays.png',
    source: 'docs-harel-statecharts',
  },
  'harel-history-shallow': {
    machine: harelHistoryShallow,
    width: captures['harel-history-shallow'].width,
    height: captures['harel-history-shallow'].height,
    image: '/assets/harel-statecharts/screenshots/harel-history-shallow.png',
    source: 'docs-harel-statecharts',
  },
  'harel-history-deep': {
    machine: harelHistoryDeep,
    width: captures['harel-history-deep'].width,
    height: captures['harel-history-deep'].height,
    image: '/assets/harel-statecharts/screenshots/harel-history-deep.png',
    source: 'docs-harel-statecharts',
  },
  'harel-history-selective': {
    machine: harelHistorySelective,
    width: captures['harel-history-selective'].width,
    height: captures['harel-history-selective'].height,
    image: '/assets/harel-statecharts/screenshots/harel-history-selective.png',
    source: 'docs-harel-statecharts',
  },
  'harel-updates': {
    machine: harelUpdates,
    width: captures['harel-updates'].width,
    height: captures['harel-updates'].height,
    image: '/assets/harel-statecharts/screenshots/harel-updates.png',
    source: 'docs-harel-statecharts',
  },
  'harel-parallel': {
    machine: harelParallel,
    width: captures['harel-parallel'].width,
    height: captures['harel-parallel'].height,
    image: '/assets/harel-statecharts/screenshots/harel-parallel.png',
    source: 'docs-harel-statecharts',
  },
  'harel-product': {
    machine: harelProduct,
    width: captures['harel-product'].width,
    height: captures['harel-product'].height,
    image: '/assets/harel-statecharts/screenshots/harel-product.png',
    source: 'docs-harel-statecharts',
  },
  'harel-avionics': {
    machine: harelAvionics,
    width: captures['harel-avionics'].width,
    height: captures['harel-avionics'].height,
    image: '/assets/harel-statecharts/screenshots/harel-avionics.png',
    source: 'docs-harel-statecharts',
  },
  'harel-parallel-entry': {
    machine: harelParallelEntry,
    width: captures['harel-parallel-entry'].width,
    height: captures['harel-parallel-entry'].height,
    image: '/assets/harel-statecharts/screenshots/harel-parallel-entry.png',
    source: 'docs-harel-statecharts',
  },
  'harel-stopwatch': {
    machine: harelStopwatch,
    width: captures['harel-stopwatch'].width,
    height: captures['harel-stopwatch'].height,
    image: '/assets/harel-statecharts/screenshots/harel-stopwatch.png',
    source: 'docs-harel-statecharts',
  },
  'harel-watch': {
    machine: harelWatch,
    width: captures['harel-watch'].width,
    height: captures['harel-watch'].height,
    image: '/assets/harel-statecharts/screenshots/harel-watch.png',
    source: 'docs-harel-statecharts',
  },
  'harel-beep-test': {
    machine: harelBeepTest,
    width: captures['harel-beep-test'].width,
    height: captures['harel-beep-test'].height,
    image: '/assets/harel-statecharts/screenshots/harel-beep-test.png',
    source: 'docs-harel-statecharts',
  },
  'harel-conditional': {
    machine: harelConditional,
    width: captures['harel-conditional'].width,
    height: captures['harel-conditional'].height,
    image: '/assets/harel-statecharts/screenshots/harel-conditional.png',
    source: 'docs-harel-statecharts',
  },
  'harel-selection': {
    machine: harelSelection,
    width: captures['harel-selection'].width,
    height: captures['harel-selection'].height,
    image: '/assets/harel-statecharts/screenshots/harel-selection.png',
    source: 'docs-harel-statecharts',
  },
  'harel-timeout': {
    machine: harelTimeout,
    width: captures['harel-timeout'].width,
    height: captures['harel-timeout'].height,
    image: '/assets/harel-statecharts/screenshots/harel-timeout.png',
    source: 'docs-harel-statecharts',
  },
  'harel-unclustering': {
    machine: harelUnclustering,
    width: captures['harel-unclustering'].width,
    height: captures['harel-unclustering'].height,
    image: '/assets/harel-statecharts/screenshots/harel-unclustering.png',
    source: 'docs-harel-statecharts',
  },
  'harel-activities': {
    machine: harelActivities,
    width: captures['harel-activities'].width,
    height: captures['harel-activities'].height,
    image: '/assets/harel-statecharts/screenshots/harel-activities.png',
    source: 'docs-harel-statecharts',
  },
  'harel-digit': {
    machine: harelDigit,
    width: captures['harel-digit'].width,
    height: captures['harel-digit'].height,
    image: '/assets/harel-statecharts/screenshots/harel-digit.png',
    source: 'docs-harel-statecharts',
  },
  'harel-telephones': {
    machine: harelTelephones,
    width: captures['harel-telephones'].width,
    height: captures['harel-telephones'].height,
    image: '/assets/harel-statecharts/screenshots/harel-telephones.png',
    source: 'docs-harel-statecharts',
  },
  'harel-overlap-shared': {
    machine: harelOverlapShared,
    width: captures['harel-overlap-shared'].width,
    height: captures['harel-overlap-shared'].height,
    image: '/assets/harel-statecharts/screenshots/harel-overlap-shared.png',
    source: 'docs-harel-statecharts',
  },
  'harel-overlap': {
    machine: harelOverlap,
    width: captures['harel-overlap'].width,
    height: captures['harel-overlap'].height,
    image: '/assets/harel-statecharts/screenshots/harel-overlap.png',
    source: 'docs-harel-statecharts',
  },
  'harel-overlap-inactive': {
    machine: harelOverlapInactive,
    width: captures['harel-overlap-inactive'].width,
    height: captures['harel-overlap-inactive'].height,
    image: '/assets/harel-statecharts/screenshots/harel-overlap-inactive.png',
    source: 'docs-harel-statecharts',
  },
  'harel-conflict': {
    machine: harelConflict,
    width: captures['harel-conflict'].width,
    height: captures['harel-conflict'].height,
    image: '/assets/harel-statecharts/screenshots/harel-conflict.png',
    source: 'docs-harel-statecharts',
  },
  'harel-broadcast-cycle': {
    machine: harelBroadcastCycle,
    width: captures['harel-broadcast-cycle'].width,
    height: captures['harel-broadcast-cycle'].height,
    image: '/assets/harel-statecharts/screenshots/harel-broadcast-cycle.png',
    source: 'docs-harel-statecharts',
  },
  'harel-semantics': {
    machine: harelSemantics,
    width: captures['harel-semantics'].width,
    height: captures['harel-semantics'].height,
    image: '/assets/harel-statecharts/screenshots/harel-semantics.png',
    source: 'docs-harel-statecharts',
  },
  'harel-simultaneous': {
    machine: harelSimultaneous,
    width: captures['harel-simultaneous'].width,
    height: captures['harel-simultaneous'].height,
    image: '/assets/harel-statecharts/screenshots/harel-simultaneous.png',
    source: 'docs-harel-statecharts',
  },
};
