import Link from '@docusaurus/Link';
import React from 'react';
import '../css/landing-page.css';
import { Navbar } from './Navbar';
import { Intro } from './Intro';
import { Lifecycle } from './Lifecycle';

export default function Index() {
  return (
    <>
      <header className="bg-gray-[rgba(31,31,41,0.9)] fixed w-full border-b-[rgba(255,255,255,0.08)] border-b backdrop-blur-md shadow-lg">
        <Navbar />
      </header>
      <main>
        <Intro />
        <Lifecycle />
      </main>
    </>
  );
}
