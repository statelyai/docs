import React, { useState } from 'react';
import styles from './styles.module.css';
import { useColorMode } from '@docusaurus/theme-common';

type Embed = {
  name: string;
  embedURL: string;
};


export default function EmbedMachine({ name, embedURL }: Embed) {
  const { colorMode } = useColorMode();

  // keeps the whole page from scrolling when 
  const handleMouseEnter = () => {
    document.body.style.overflow = 'hidden';
    }
  const handleMouseLeave = () => { 
    document.body.style.overflow = 'auto';
  }

  return (
    <div
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
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
    </div>
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
