import Link from 'next/link';
import { blog } from '@/lib/source';

export default function Page() {
  const posts = [...blog.getPages()].sort(
    (a, b) =>
      new Date(b.data.date ?? b.file.name).getTime() -
      new Date(a.data.date ?? a.file.name).getTime(),
  );

  const svg = `<svg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'>
  <filter id='noiseFilter'>
    <feTurbulence 
      type='fractalNoise' 
      baseFrequency='0.65' 
      numOctaves='3' 
      stitchTiles='stitch'/>
  </filter>
  
  <rect width='100%' height='100%' filter='url(#noiseFilter)'/>
</svg>`;

  return (
    <main className="mx-auto w-full max-w-fd-container sm:px-4 md:py-12">
      <div
        className="p-8 mb-4"
        style={{
          backgroundImage: [
            // Stately Orange: #FF7A00, Stately Blue: #3B5FFF
            'radial-gradient(circle at 70% 10%, rgba(255,122,0,0.45), transparent)', // Orange
            'radial-gradient(circle at 0% 80%, rgba(59,95,255,0.45), transparent)', // Blue
            'radial-gradient(circle at 50% 50%, rgba(59,95,255,0.18), transparent)', // Blue, lighter
            `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
          ].join(', '),
        }}
      >
        <h1 className="mb-4 border-b-4 border-fd-foreground pb-2 text-4xl font-bold md:text-5xl">
          Stately Blog
        </h1>
        <p className="text-sm md:text-base">
          The latest news and updates from the Stately team
        </p>
      </div>
      <div className="grid grid-cols-1 *:border *:rounded-md md:grid-cols-3 lg:grid-cols-4 gap-2">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="flex flex-col gap-2 bg-fd-card p-4 transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <p className="font-medium">{post.data.title}</p>
            <p className="text-sm text-fd-muted-foreground">
              {post.data.description}
            </p>

            <p className="mt-auto text-xs text-fd-muted-foreground">
              {new Date(post.data.date ?? post.file.name).toDateString()}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
