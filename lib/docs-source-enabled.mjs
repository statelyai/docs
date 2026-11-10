/**
 * Check whether a source is included in the optional source override.
 * @param {string} sourceId
 * @param {string | undefined} override
 */
export function isDocsSourceEnabled(sourceId, override) {
  if (!override) return true;
  const ids = override.split(',').map((id) => id.trim()).filter(Boolean);
  return ids.includes('*') || ids.includes(sourceId);
}

/**
 * Filter source-gated MDX sections for search and Markdown exports.
 * @param {string} markdown
 * @param {string | undefined} override
 */
export function filterDocsSourceGates(markdown, override) {
  return markdown.replace(
    /<DocsSourceGate\s+sourceId="([^"]+)"(?:\s+enabled=\{(true|false)\})?\s*>([\s\S]*?)<\/DocsSourceGate>/gu,
    (_match, sourceId, enabled, content) =>
      isDocsSourceEnabled(sourceId, override) === (enabled !== 'false')
        ? content
        : '',
  );
}
