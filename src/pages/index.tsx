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
      .then((html) => {
        setHtml(html);

        // Add the crisp chat script after the dynamic html has been loaded
        // @ts-ignore
        window.$crisp = [];
        // @ts-ignore
        window.CRISP_WEBSITE_ID = 'dff22f8a-0d73-4a83-91be-1f448410c464';
        (function () {
          let d = document;
          let s = d.createElement('script');
          s.src = 'https://client.crisp.chat/l.js';
          s.async = true;
          d.getElementsByTagName('head')[0].appendChild(s);
        })();
      });
  }, []);

  // Draw the arrows after any changes to the HTML
  useEffect(() => drawArrows(), [html]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
