import Link from 'next/link';
import { DocsBody, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { blog } from '@/lib/source';

export default function Page() {
  const posts = [...blog.getPages()].sort(
    (a, b) =>
      new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  return (
    <DocsPage>
      <DocsTitle>Blog</DocsTitle>
      <DocsBody>
        <ul className="space-y-4 list-none p-0">
          {posts.map((post) => (
            <li key={post.url} className="border-b pb-4">
              <Link
                href={post.url}
                className="block hover:text-fd-primary no-underline"
              >
                <p className="font-medium text-lg mb-1">{post.data.title}</p>
                <p className="text-sm text-fd-muted-foreground mb-1">
                  {post.data.description}
                </p>
                <p className="text-xs text-fd-muted-foreground">
                  {new Date(post.data.date).toDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </DocsBody>
    </DocsPage>
  );
}
