import Link from '@docusaurus/Link';
import React from 'react';
import '../css/landing-page.css';

// https://github.com/facebook/docusaurus/discussions/8387#discussioncomment-6067944
// Loading a static HTML only works during SSR, so we use this hack to make it work during CSR
export default function Index() {
  return (
    <header className="bg-orange-300 h-screen">
      <div className="container mx-auto text-center py-24">
        <h1 className="text-6xl font-bold text-green-200">Stately</h1>
        <p className="text-4xl bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text animate-gradient">
          Get yourself production-ready code in nanoseconds! 🚀
        </p>

        <div className="py-10">
          <Link
            className="bg-white rounded-md text-gray-500 px-4 py-2"
            to="/docs"
          >
            Read our docs
          </Link>
        </div>
      </div>
    </header>
  );
}
