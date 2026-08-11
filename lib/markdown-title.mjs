function stripFrontmatter(source) {
  return source.replace(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, '');
}

function stripLeadingComments(source) {
  let remaining = source.trimStart();

  while (remaining.startsWith('<!--')) {
    const end = remaining.indexOf('-->');
    if (end === -1) break;
    remaining = remaining.slice(end + 3).trimStart();
  }

  return remaining;
}

/**
 * @param {string} source
 * @returns {string | undefined}
 */
export function extractLeadingMarkdownTitle(source) {
  const body = stripLeadingComments(stripFrontmatter(source));
  const [firstLine = '', secondLine = ''] = body.split(/\r?\n/u, 2);
  const atxHeading = firstLine.match(/^#\s+(.+?)\s*#*\s*$/u)?.[1]?.trim();
  if (atxHeading) return atxHeading;

  if (/^=+\s*$/u.test(secondLine) && firstLine.trim()) {
    return firstLine.trim();
  }

  return undefined;
}
