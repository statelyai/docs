// import { useColorMode } from '@docusaurus/theme-common';
type Embed = {
  name: string;
  embedURL: string;
};

export function EmbedMachine({ name, embedURL }: Embed) {
  // const { colorMode } = useColorMode();
  return (
    <iframe
      loading="lazy"
      src={manageURL(embedURL, {
        colorMode: 'light',
      })}
      className="block my-4 w-full aspect-video"
    >
      <a href={embedURL}>
        View the <em>{name}</em> machine in Stately Studio
      </a>
      .
    </iframe>
  );
}

function manageURL(
  embedURL: string,
  options?: { colorMode: 'light' | 'dark' },
): string {
  const url = new URL(embedURL);
  for (const opt in options) {
    url.searchParams.set(opt, options[opt as keyof typeof options]);
  }
  return url.toString();
}
