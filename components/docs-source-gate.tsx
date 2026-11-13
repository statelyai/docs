import type { ReactNode } from 'react';
import { isDocsSourceEnabled } from '@/lib/docs-sources';

export function DocsSourceGate({
  sourceId,
  enabled = true,
  children,
}: {
  sourceId: string;
  enabled?: boolean;
  children: ReactNode;
}) {
  return isDocsSourceEnabled(sourceId) === enabled ? children : null;
}
