import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import type { PageTree } from 'fumadocs-core/server';

function transformPageTree(tree: PageTree.Root): PageTree.Root {
  const studioSubfolders = [
    'Design mode',
    'Simulate mode',
    'Code',
    'Stately Sky',
    'Share',
    'Accounts',
  ];
  const studioPages = ['Studio pages', 'Studio pages 2', 'Studio settings'];

  const folders: Record<string, PageTree.Node[]> = {
    'Get started': [],
    'Core concepts': [],
    'Stately Studio': [],
    'Design mode': [],
    'Simulate mode': [],
    Code: [],
    'Studio pages': [],
    'Stately Sky': [],
    'Studio pages 2': [],
    Share: [],
    Accounts: [],
    'Studio settings': [],
    Actors: [],
    'State machines': [],
    Agents: [],
    Guides: [],
    Packages: [],
    'Developer tools': [],
  };

  const otherPages: PageTree.Node[] = [];
  let currentFolder: string | null = null;

  for (const node of tree.children) {
    if (node.type === 'separator') {
      const folderName = node.name.replace(/^---/, '').replace(/---$/, '');
      currentFolder = folders[folderName] !== undefined ? folderName : null;
    } else if (currentFolder && folders[currentFolder]) {
      folders[currentFolder].push(node);
    } else {
      otherPages.push(node);
    }
  }

  const newChildren: PageTree.Node[] = [];

  // Add "about" page first
  newChildren.push(...otherPages);

  // Add each folder
  for (const [name, children] of Object.entries(folders)) {
    if (children.length > 0) {
      // If this is a Studio subfolder or page collection, don't add it yet
      if (studioSubfolders.includes(name) || studioPages.includes(name)) {
        continue;
      }

      // If this is Stately Studio, nest the subfolders inside it
      if (name === 'Stately Studio') {
        const studioChildren = [...children];

        // Add nested folders
        for (const subfolder of studioSubfolders) {
          if (folders[subfolder].length > 0) {
            studioChildren.push({
              type: 'folder',
              name: subfolder,
              children: folders[subfolder],
            });
          }
        }

        // Add pages from studio page collections
        studioChildren.push(...folders['Studio pages']);
        studioChildren.push(...folders['Studio pages 2']);
        studioChildren.push(...folders['Studio settings']);

        newChildren.push({
          type: 'folder',
          name,
          children: studioChildren,
        });
      } else {
        newChildren.push({
          type: 'folder',
          name,
          children,
        });
      }
    }
  }

  return {
    ...tree,
    children: newChildren,
  };
}

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const transformedTree = transformPageTree(source.pageTree);

  return (
    <DocsLayout tree={transformedTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
