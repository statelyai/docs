import {
  createBlogCollection,
  createDocsCollection,
  createDocsWorkspaceModule,
  createGlobalConfig,
} from './lib/fumadocs-config';
import {
  enabledExternalDocsSources,
  getProjectDocsDir,
} from './lib/docs-sources';
import { getProjectCheckoutDir } from './lib/docs-workspaces';

export const docs = createDocsCollection('content/docs');
export const blogPosts = createBlogCollection('content/blog');

export default createGlobalConfig({
  workspaces: Object.fromEntries(
    enabledExternalDocsSources.map((sourceConfig) => [
      sourceConfig.package,
      {
        dir: getProjectCheckoutDir(sourceConfig.package),
        config: createDocsWorkspaceModule(getProjectDocsDir()),
      },
    ]),
  ),
});
