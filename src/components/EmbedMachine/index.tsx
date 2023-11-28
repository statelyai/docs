import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';

type Embed = {
  name: string;
  embedURL: string;
};

export default function EmbedMachine({ name, embedURL }: Embed) {
  const { colorMode } = useColorMode();
  return (
    <iframe
      loading="lazy"
      src={manageURL(embedURL, {
        colorMode,
      })}
      className={styles.embed}
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
    url.searchParams.set(opt, options[opt]);
  }
  return url.toString();
}
