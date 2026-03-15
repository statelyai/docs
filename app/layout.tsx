import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';
import DefaultSearchDialog from '@/components/search';
import { AISearch, AISearchTrigger } from '@/components/ai/search';
import { MessageCircleIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          theme={{ enabled: true }}
          search={{
            SearchDialog: DefaultSearchDialog,
          }}
        >
          <AISearch>
            <AISearchTrigger
              position="float"
              className={cn(
                buttonVariants({
                  variant: 'secondary',
                  className: 'text-fd-muted-foreground rounded-2xl',
                }),
              )}
            >
              <MessageCircleIcon className="size-4.5" /> Ask AI
            </AISearchTrigger>
            {children}
          </AISearch>
        </RootProvider>
      </body>
    </html>
  );
}
