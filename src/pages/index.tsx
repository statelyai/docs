import useBaseUrl from '@docusaurus/useBaseUrl';
import React, { useEffect } from 'react';
import { drawArrows } from '../components/landing-page-arrows';

// https://github.com/facebook/docusaurus/discussions/8387#discussioncomment-6067944
// Loading a static HTML only works during SSR, so we use this hack to make it work during CSR
export default function Index() {
  const landingPage = useBaseUrl('/landing-page/index.html');
  const [html, setHtml] = React.useState('');

  useEffect(() => {
    // Fetch the HTML file from the static folder
    fetch(landingPage)
      // Convert the response to text
      .then((response) => response.text())
      // Set the HTML
      .then((html) => setHtml(html));
  }, []);

  // Draw the arrows after any changes to the HTML
  useEffect(() => drawArrows(), [html]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
