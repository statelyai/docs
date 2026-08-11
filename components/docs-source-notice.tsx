import { getDocsSourceByPackage } from '@/lib/docs-sources';
import { Callout } from 'fumadocs-ui/components/callout';

export function DocsSourceNotice({ sourceId }: { sourceId: string }) {
  const notice = getDocsSourceByPackage(sourceId)?.notice;
  if (!notice) return null;

  return (
    <Callout
      className="mt-6"
      role="note"
      title={notice.title}
      type={notice.type}
    >
      {notice.description}
    </Callout>
  );
}
