import { ArrowLeftIcon, BookOpenIcon } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { ThemedLogo } from '@/lib/ThemedLogo';
import { cn } from '@/lib/cn';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-fd-background text-fd-foreground">
      <header className="border-b border-fd-border">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-6">
          <Link href="/" aria-label="Stately home">
            <ThemedLogo />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-20">
        <div className="max-w-xl">
          <p className="font-mono text-8xl font-semibold leading-none tracking-tight text-fd-muted-foreground/35 sm:text-9xl">
            404
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            You’ve reached an impossible state.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-fd-muted-foreground text-pretty">
            This page may have moved or never existed.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className={cn(
                buttonVariants({ variant: 'primary' }),
                'gap-2 px-4',
              )}
            >
              <BookOpenIcon className="size-4" aria-hidden="true" />
              Browse documentation
            </Link>
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'gap-2 px-4',
              )}
            >
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              Back to Stately
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
