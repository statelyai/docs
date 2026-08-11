import path from 'node:path';
import {
  createBlogCollection,
  createDirectDocsWorkspaceModule,
  createDocsCollection,
  createDocsWorkspaceModule,
  createGlobalConfig,
} from './lib/fumadocs-config';
import {
  enabledExternalDocsSources,
  getDocsSourceGitRef,
  getDocsSourceRepo,
  getDocsSourceSubpath,
  getProjectDocsDir,
} from './lib/docs-sources';
import {
  getProjectCheckoutDir,
  getWorkspaceProjectCheckoutDir,
} from './lib/docs-workspaces';

export const docs = createDocsCollection('content/docs');
export const blogPosts = createBlogCollection('content/blog');

export default createGlobalConfig({
  workspaces: Object.fromEntries(
    enabledExternalDocsSources.map((sourceConfig) => [
      sourceConfig.package,
      {
        dir:
          sourceConfig.mode === 'workspace'
            ? path.join(
                getWorkspaceProjectCheckoutDir(
                  getDocsSourceRepo(sourceConfig.source),
                  getDocsSourceGitRef(sourceConfig),
                ),
                getDocsSourceSubpath(sourceConfig.source),
              )
            : getProjectCheckoutDir(sourceConfig.package, sourceConfig.mode),
        config:
          sourceConfig.mode === 'workspace'
            ? createDirectDocsWorkspaceModule('.', sourceConfig.include)
            : createDocsWorkspaceModule(getProjectDocsDir()),
      },
    ]),
  ),
});
