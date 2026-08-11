import {
  defineCollections,
  defineConfig,
  defineDocs,
  type GlobalConfig,
  type MDXPresetOptions,
} from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { transformerTwoslash } from 'fumadocs-twoslash';
import {
  rehypeCodeDefaultOptions,
  remarkImage,
} from 'fumadocs-core/mdx-plugins';
import rehypeRaw from 'rehype-raw';
import z from 'zod';

function extractLeadingTitle(source: string, filePath: string): string {
  const heading = source.match(/^#\s+(.+)$/mu)?.[1]?.trim();
  if (heading) return heading;

  const fileName = filePath.split(/[\\/]/u).at(-1) ?? filePath;
  return fileName
    .replace(/\.(md|mdx)$/iu, '')
    .replace(/^readme$/iu, 'Overview')
    .replace(/[-_]+/gu, ' ');
}

function remarkPrepareWorkspaceMarkdown() {
  return (tree: {
    children?: Array<{ depth?: number; type?: string; value?: string }>;
  }) => {
    const children = tree.children ?? [];
    const firstContentIndex = children.findIndex(
      (node) => node.type !== 'yaml' && node.type !== 'html',
    );

    if (
      firstContentIndex >= 0 &&
      children[firstContentIndex]?.type === 'heading' &&
      children[firstContentIndex]?.depth === 1
    ) {
      children.splice(firstContentIndex, 1);
    }

    tree.children = children.filter(
      (node) =>
        node.type !== 'html' || !node.value?.trimStart().startsWith('<!--'),
    );
  };
}

const sharedDocsCollectionOptions = {
  docs: {
    async: true,
    schema: pageSchema.extend({
      slug: z.string().optional(),
      sourcePath: z.string().optional(),
      sourceUrl: z.string().url().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
} as const;

const sharedMdxOptions: MDXPresetOptions = {
  rehypeCodeOptions: {
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    transformers: [
      ...(rehypeCodeDefaultOptions.transformers ?? []),
      transformerTwoslash(),
    ],
  },
  remarkPlugins: [
    [
      remarkImage,
      {
        external: false,
      },
    ],
  ],
};

const externalMdxOptions: MDXPresetOptions = {
  ...sharedMdxOptions,
  remarkRehypeOptions: {
    allowDangerousHtml: true,
  },
  rehypePlugins: [
    [
      rehypeRaw,
      {
        passThrough: [
          'mdxjsEsm',
          'mdxFlowExpression',
          'mdxTextExpression',
          'mdxJsxFlowElement',
          'mdxJsxTextElement',
        ],
      },
    ],
  ],
};

const workspaceMdxOptions: MDXPresetOptions = {
  ...externalMdxOptions,
  remarkPlugins: [
    [
      remarkImage,
      {
        external: false,
      },
    ],
    remarkPrepareWorkspaceMarkdown,
  ],
};

export function createDocsCollection(dir = 'content/docs') {
  return defineDocs({
    dir,
    ...sharedDocsCollectionOptions,
  });
}

export function createBlogCollection(dir = 'content/blog') {
  return defineCollections({
    type: 'doc',
    dir,
    async: true,
    schema: pageSchema.extend({
      authors: z.array(z.string()),
      date: z.iso.date().or(z.date()),
    }),
  });
}

export function createDocsWorkspaceModule(dir: string): Record<string, unknown> {
  return {
    docs: createDocsCollection(dir),
    default: createGlobalConfig({ mdxOptions: externalMdxOptions }),
  };
}

export function createDirectDocsWorkspaceModule(
  dir = '.',
  files?: string[],
  metaFiles?: string[],
): Record<string, unknown> {
  return {
    docs: defineDocs({
      dir,
      docs: {
        ...sharedDocsCollectionOptions.docs,
        files: files ?? ['README.md', 'docs/**/*.md', 'docs/**/*.mdx'],
        schema: ({ path, source }) =>
          pageSchema
            .extend({
              title: z.string().optional(),
              slug: z.string().optional(),
              sourcePath: z.string().optional(),
              sourceUrl: z.string().url().optional(),
            })
            .transform((data) => ({
              ...data,
              title: data.title ?? extractLeadingTitle(source, path),
            })),
      },
      meta: {
        ...sharedDocsCollectionOptions.meta,
        files: metaFiles ?? ['docs/**/*.{json,yaml,yml}'],
      },
    }),
    default: createGlobalConfig({ mdxOptions: workspaceMdxOptions }),
  };
}

export function createGlobalConfig(
  overrides: Partial<GlobalConfig> = {},
): GlobalConfig {
  return defineConfig({
    mdxOptions: sharedMdxOptions,
    ...overrides,
  });
}
