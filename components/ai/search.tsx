'use client';

import { useChat } from '@ai-sdk/react';
import { AIChatProvider, AIChatSearch } from '@fumadocs/ai-chat';
import { DefaultChatTransport } from 'ai';
import type { ReactNode } from 'react';
import type { DocsChatMessage } from '@/app/api/docs/chat/route';

const transport = new DefaultChatTransport<DocsChatMessage>({
  api: '/api/docs/chat',
});

function renderPart(part: DocsChatMessage['parts'][number], live: boolean) {
  if (part.type !== 'tool-search') return null;

  return (
    <AIChatSearch
      live={live}
      part={{
        ...part,
        output: part.output
          ?.filter((result) => result.type === 'page')
          .map((result) => ({
            doc: {
              url: result.url,
              title: result.content.replace(/<\/?mark>/g, ''),
            },
          })),
      }}
    />
  );
}

export function AIChat({ children }: { children: ReactNode }) {
  const chat = useChat<DocsChatMessage>({ id: 'search', transport });

  return (
    <AIChatProvider
      chat={chat}
      toMessage={(text) => ({ text })}
      renderPart={renderPart}
      description="AI can be inaccurate, please verify the answers."
      suggestions={[
        'What are actors?',
        'How do I get started with XState?',
        'How do I model a workflow?',
      ]}
    >
      {children}
    </AIChatProvider>
  );
}
