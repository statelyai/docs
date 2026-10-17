'use client';

import { AIChatPanel, AIChatTrigger, useAIChat } from '@fumadocs/ai-chat';
import { DocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { AIChat } from './search';

export function DocsChatLayout(props: DocsLayoutProps) {
  return (
    <AIChat>
      <ChatLayout {...props} />
      <AIChatTrigger />
    </AIChat>
  );
}

function ChatLayout(props: DocsLayoutProps) {
  const { open, setOpen } = useAIChat();

  return (
    <DocsLayout
      {...props}
      aiChat={{ open, onOpenChange: setOpen, panel: <AIChatPanel /> }}
    />
  );
}
