import type * as PageTree from 'fumadocs-core/page-tree';

const pagePairs = [
  ['/docs/quick-start', '/docs/xstate/v6/quick-start'],
  ['/docs/examples', '/docs/xstate/v6/examples'],
  ['/docs/cheatsheet', '/docs/xstate/v6/cheatsheet'],
  ['/docs/typescript', '/docs/xstate/v6/typescript'],
  ['/docs/machines', '/docs/xstate/v6/configuration'],
  ['/docs/setup', '/docs/xstate/v6/setup-and-provide'],
  ['/docs/states', '/docs/xstate/v6/states'],
  ['/docs/context', '/docs/xstate/v6/context'],
  ['/docs/transitions', '/docs/xstate/v6/transitions'],
  ['/docs/actions', '/docs/xstate/v6/actions'],
  ['/docs/guards', '/docs/xstate/v6/guards'],
  ['/docs/parallel-states', '/docs/xstate/v6/parallel-states'],
  ['/docs/final-states', '/docs/xstate/v6/final-states'],
  ['/docs/history-states', '/docs/xstate/v6/history-states'],
  ['/docs/persistence', '/docs/xstate/v6/persistence'],
  ['/docs/actors', '/docs/xstate/v6/actors'],
  ['/docs/invoke', '/docs/xstate/v6/invoke'],
  ['/docs/spawn', '/docs/xstate/v6/spawn'],
  ['/docs/inspection', '/docs/xstate/v6/inspection'],
  ['/docs/testing', '/docs/xstate/v6/testing'],
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
  const v6Children = v6.children.map((node) => projectPages(node, 'v6'));
  const v5Index: PageTree.Item = {
    type: 'page',
    name: 'XState v5 overview',
    url: '/docs/xstate',
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
