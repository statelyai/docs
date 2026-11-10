// Existing v5 URLs. Each redirects to the same content under the v5 prefix.
export const xstateV5Slugs = [
  'xstate',
  'quick-start',
  'installation',
  'migration',
  'examples',
  'templates',
  'cheatsheet',
  'typescript',
  'machines',
  'setup',
  'states',
  'context',
  'input',
  'output',
  'transitions',
  'routes',
  'pure-transitions',
  'eventless-transitions',
  'delayed-transitions',
  'actions',
  'guards',
  'initial-states',
  'finite-states',
  'parent-states',
  'parallel-states',
  'final-states',
  'history-states',
  'persistence',
  'tags',
  'event-emitter',
  'actors',
  'state-machine-actors',
  'promise-actors',
  'transition-actors',
  'callback-actors',
  'observable-actors',
  'invoke',
  'spawn',
  'system',
  'inspection',
  'graph',
  'testing',
  'immer',
  'xstate-react',
  'xstate-vue',
  'xstate-svelte',
  'xstate-fsm',
  'xstate-immer',
];

/** @param {string} slug */
export function getXStateV5Path(slug) {
  if (!xstateV5Slugs.includes(slug)) return undefined;
  return slug === 'xstate' ? '/docs/xstate/v5' : `/docs/xstate/v5/${slug}`;
}

/** @param {string} href */
export function resolveXStateV5Href(href) {
  const match = href.match(/^\/docs\/([^/?#]+?)(\.mdx)?([?#].*)?$/u);
  if (!match) return href;
  const destination = getXStateV5Path(match[1]);
  return destination ? `${destination}${match[2] ?? ''}${match[3] ?? ''}` : href;
}

/** @param {string} href @param {string} originalSlug */
export function resolveXStateV5RelativeHref(href, originalSlug) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/|#|\?)/iu.test(href)) return href;
  const url = new URL(href, `https://stately.ai/docs/${originalSlug}`);
  return resolveXStateV5Href(`${url.pathname}${url.search}${url.hash}`);
}
