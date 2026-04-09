import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { blog } from '@/lib/source';

export default function Layout({ children }: LayoutProps<'/blog'>) {
  return (
    <DocsLayout tree={blog.pageTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
