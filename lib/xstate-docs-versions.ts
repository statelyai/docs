import type * as PageTree from 'fumadocs-core/page-tree';

const pagePairs = [
  ['/docs/xstate/v5/quick-start', '/docs/xstate/v6/quick-start'],
  ['/docs/xstate/v5/examples', '/docs/xstate/v6/examples'],
  ['/docs/xstate/v5/cheatsheet', '/docs/xstate/v6/cheatsheet'],
  ['/docs/xstate/v5/typescript', '/docs/xstate/v6/typescript'],
  ['/docs/xstate/v5/machines', '/docs/xstate/v6/configuration'],
  ['/docs/xstate/v5/setup', '/docs/xstate/v6/setup-and-provide'],
  ['/docs/xstate/v5/states', '/docs/xstate/v6/states'],
  ['/docs/xstate/v5/context', '/docs/xstate/v6/context'],
  ['/docs/xstate/v5/transitions', '/docs/xstate/v6/transitions'],
  ['/docs/xstate/v5/actions', '/docs/xstate/v6/actions'],
  ['/docs/xstate/v5/guards', '/docs/xstate/v6/guards'],
  ['/docs/xstate/v5/parallel-states', '/docs/xstate/v6/parallel-states'],
  ['/docs/xstate/v5/final-states', '/docs/xstate/v6/final-states'],
  ['/docs/xstate/v5/history-states', '/docs/xstate/v6/history-states'],
  ['/docs/xstate/v5/persistence', '/docs/xstate/v6/persistence'],
  ['/docs/xstate/v5/actors', '/docs/xstate/v6/actors'],
  ['/docs/xstate/v5/invoke', '/docs/xstate/v6/invoke'],
  ['/docs/xstate/v5/spawn', '/docs/xstate/v6/spawn'],
  ['/docs/xstate/v5/inspection', '/docs/xstate/v6/inspection'],
  ['/docs/xstate/v5/testing', '/docs/xstate/v6/testing'],
] as const;

const v5Sections = new Set([
  'get-started',
  'state-machines',
  'actors',
  'guides',
]);

function projectItem(node: PageTree.Item, version: 'v5' | 'v6'): PageTree.Item {
  const pairIndex = pagePairs.findIndex(
    (pair) => pair[version === 'v5' ? 0 : 1] === node.url,
  );
  // Fumadocs projects pages by their paths relative to each version root.
  return pairIndex < 0
    ? node
    : { ...node, $ref: `xstate-versions/${version}/${pairIndex}` };
}

function projectPages(node: PageTree.Node, version: 'v5' | 'v6'): PageTree.Node {
  if (node.type === 'page') return projectItem(node, version);
  if (node.type === 'folder') {
    return {
      ...node,
      index: node.index ? projectItem(node.index, version) : undefined,
      children: node.children.map((child) => projectPages(child, version)),
    };
  }
  return node;
}

export function withXStateVersions(tree: PageTree.Root): PageTree.Root {
  const v6 = tree.children.find(
    (node): node is PageTree.Folder =>
      node.type === 'folder' && node.$id === 'xstate/v6',
  );
  const v5 = tree.children.filter(
    (node): node is PageTree.Folder =>
      node.type === 'folder' && v5Sections.has(node.$id ?? ''),
  );
  if (!v6 || v5.length !== v5Sections.size) return tree;

  const v5Children = v5.map((node) => projectPages(node, 'v5'));
  v5Children.push({
    type: 'folder',
    name: 'Packages',
    children: [
      { type: 'page', name: 'XState React', url: '/docs/xstate/v5/xstate-react' },
      { type: 'page', name: 'XState Vue', url: '/docs/xstate/v5/xstate-vue' },
      {
        type: 'page',
        name: 'XState Svelte',
        url: '/docs/xstate/v5/xstate-svelte',
      },
      { type: 'page', name: 'XState FSM', url: '/docs/xstate/v5/xstate-fsm' },
      { type: 'page', name: 'XState Immer', url: '/docs/xstate/v5/xstate-immer' },
    ],
  });
  const v6Children = v6.children.map((node) => projectPages(node, 'v6'));
  const v5Index: PageTree.Item = {
    type: 'page',
    name: 'XState v5 overview',
    url: '/docs/xstate/v5',
  };
  const v6Index = v6Children.find(
    (node): node is PageTree.Item =>
      node.type === 'page' && node.url === '/docs/xstate/v6/quick-start',
  );
  if (!v6Index) return tree;

  const versions: PageTree.Folder[] = [
    {
      ...v6,
      $id: 'xstate-version-v6',
      $ref: { folder: 'xstate-versions/v6' },
      root: 'xstate-version',
      index: v6Index,
      children: v6Children,
    },
    {
      type: 'folder',
      name: 'XState v5 stable',
      $id: 'xstate-version-v5',
      $ref: { folder: 'xstate-versions/v5' },
      root: 'xstate-version',
      index: v5Index,
      children: v5Children,
    },
  ];

  return {
    ...tree,
    children: [
      ...versions,
      ...tree.children.filter(
        (node) =>
          node !== v6 &&
          !(node.type === 'folder' && v5Sections.has(node.$id ?? '')),
      ),
    ],
  };
}
