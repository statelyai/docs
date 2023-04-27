import React from 'react';
import styles from './styles.module.css';

type Embed = {
  name: string;
  embedURL: string;
};

export default function EmbedMachine({name, embedURL}: Embed) {
  return (
    <p>
        <iframe
            loading="lazy"
            src={embedURL}
            className={styles.embed}
        >
            <a href={embedURL}>View the <em>{name}</em> machine in Stately Studio</a>.
        </iframe>
    </p>
  );
}