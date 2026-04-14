import { docs, blogPosts } from 'collections/server';
import {
  getSlugs,
  multiple,
  update,
  type InferPageType,
  loader,
  type Source,
  type VirtualFile,
} from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { externalDocsCollections } from '@/lib/external-docs.generated';
import {
  enabledExternalDocsSources,
  getDocsPageGitHubUrl,
  getProjectRoutePrefix,
  prefixRoute,
} from '@/lib/docs-sources';

type DocsCollectionMap = Record<
  string,
  {
    toFumadocsSource: () => Source;
  }
>;

function getRouteFromFile(file: VirtualFile): string {
  if (file.type !== 'page') return '';
  return (file.slugs ?? getSlugs(file.path)).join('/');
}

function withProjectPrefix(project: string, source: Source) {
  return update(source)
    .files((files) =>
      files.map((file) => ({
        ...file,
        path: prefixRoute(project, file.path),
      })),
    )
    .build();
}

function validateDocsSourceOwnership(source: Source) {
  const seenRoutes = new Map<string, { sourceId: string; path: string }>();

  for (const file of source.files) {
    if (file.type !== 'page') continue;

    const route = getRouteFromFile(file);
    const sourceId = String((file.data as { type?: string }).type ?? 'docs');
    const existing = seenRoutes.get(route);

    if (existing) {
      throw new Error(
        [
          `Duplicate docs route detected for "${route || '/docs'}".`,
          `- ${existing.sourceId}: ${existing.path}`,
          `- ${sourceId}: ${file.path}`,
        ].join('\n'),
      );
    }

    seenRoutes.set(route, { sourceId, path: file.path });

    if (sourceId === 'docs') {
      const conflictingExternalSource = enabledExternalDocsSources.find(
        (project) =>
          route === getProjectRoutePrefix(project) ||
          route.startsWith(`${getProjectRoutePrefix(project)}/`),
      );

      if (conflictingExternalSource) {
        throw new Error(
          `Local docs page "${route || '/docs'}" conflicts with the reserved "/docs/${getProjectRoutePrefix(conflictingExternalSource)}" namespace.`,
        );
      }

      continue;
    }
  }
}

const mergedDocsSource = multiple({
  docs: docs.toFumadocsSource(),
  ...Object.fromEntries(
    Object.entries(externalDocsCollections as DocsCollectionMap).map(
      ([sourceId, collection]) => [
        sourceId,
        withProjectPrefix(sourceId, collection.toFumadocsSource()),
      ],
    ),
  ),
});

validateDocsSourceOwnership(mergedDocsSource);

export const blog = loader({
  baseUrl: '/blog',
  source: toFumadocsSource(blogPosts, []),
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: mergedDocsSource,
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export function getBlogImage(page: InferPageType<typeof blog>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/blog/${segments.join('/')}`,
  };
}

export function getPageGitHubUrl(page: InferPageType<typeof source>) {
  return getDocsPageGitHubUrl(page.data.type, page.path);
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
