import { DocsChatLayout } from '@/components/ai/layout';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsChatLayout tree={source.getPageTree()} {...baseOptions()}>
      {children}
    </DocsChatLayout>
  );
}
