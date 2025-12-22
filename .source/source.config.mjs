// source.config.ts
import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema
} from "fumadocs-mdx/config";
import { transformerTwoslash } from "fumadocs-twoslash";
import {
  rehypeCodeDefaultOptions,
  remarkImage
} from "fumadocs-core/mdx-plugins";
import z from "zod";
var docs = defineDocs({
  docs: {
    schema: frontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true
    }
  },
  meta: {
    schema: metaSchema
  }
});
var blogPosts = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: frontmatterSchema.extend({
    authors: z.array(z.string()),
    date: z.iso.date().or(z.date())
  })
});
var source_config_default = defineConfig({
  mdxOptions: {
    // MDX options
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark"
      },
      transformers: [
        ...rehypeCodeDefaultOptions.transformers ?? [],
        transformerTwoslash()
      ]
    },
    remarkPlugins: [
      [
        remarkImage,
        {
          external: false
        }
      ]
    ]
  }
});
export {
  blogPosts,
  source_config_default as default,
  docs
};
