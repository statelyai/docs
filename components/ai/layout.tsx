'use client';

import { DocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { MessageCircleIcon } from 'lucide-react';
import {
  AISearch,
  AISearchTrigger,
  useAISearchContext,
  useHotKey,
} from './search';
import { AISearchPanel } from './search-panel';

export function DocsChatLayout(props: DocsLayoutProps) {
  return (
    <AISearch>
      <ChatLayout {...props} />
      <AISearchTrigger
        position="float"
        className={buttonVariants({
          variant: 'secondary',
          className: 'text-fd-muted-foreground rounded-2xl',
        })}
      >
        <MessageCircleIcon className="size-4.5" /> Ask AI
      </AISearchTrigger>
    </AISearch>
  );
}

function ChatLayout(props: DocsLayoutProps) {
  const { open, setOpen } = useAISearchContext();
  useHotKey();

  return (
    <DocsLayout
      {...props}
      aiChat={{ open, onOpenChange: setOpen, panel: <AISearchPanel /> }}
    />
  );
}
