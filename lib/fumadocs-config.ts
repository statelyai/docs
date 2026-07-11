import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
  type GlobalConfig,
  type MDXPresetOptions,
} from 'fumadocs-mdx/config';
import { transformerTwoslash } from 'fumadocs-twoslash';
import {
  rehypeCodeDefaultOptions,
  remarkImage,
} from 'fumadocs-core/mdx-plugins';
import rehypeRaw from 'rehype-raw';
import z from 'zod';

const sharedDocsCollectionOptions = {
  docs: {
    async: true,
    schema: frontmatterSchema.extend({
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
    schema: frontmatterSchema.extend({
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

export function createGlobalConfig(
  overrides: Partial<GlobalConfig> = {},
): GlobalConfig {
  return defineConfig({
    mdxOptions: sharedMdxOptions,
    ...overrides,
  });
}
