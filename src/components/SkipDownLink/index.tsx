import React from 'react';
import styles from './styles.module.css';

type SkipDown = {
  text: string;
  link: string;
};

export default function SkipDownLink({link, text}: SkipDown) {
  return (
    <p>
        <a href={link} className={styles.skip}>
            <span>↓</span>
            <span className={styles.text}>{text}</span>
            <span>↓</span>
        </a>
    </p>
  );
}