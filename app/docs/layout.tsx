import { DocsChatLayout } from '@/components/ai/layout';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { isDocsSourceEnabled } from '@/lib/docs-sources';
import { withXStateVersions } from '@/lib/xstate-docs-versions';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsChatLayout
      tree={withXStateVersions(source.getPageTree(), isDocsSourceEnabled('xstate-v6'))}
      {...baseOptions()}
    >
      {children}
    </DocsChatLayout>
  );
}
