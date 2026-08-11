import { remark } from 'remark';

const markdownParser = remark();

function stripFrontmatter(source) {
  return source.replace(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, '');
}

function getNodeText(node) {
  if (typeof node.value === 'string') return node.value;
  if (!Array.isArray(node.children)) return '';

  return node.children.map(getNodeText).join('');
}

/**
 * @param {string} source
 * @returns {string | undefined}
 */
export function extractLeadingMarkdownTitle(source) {
  const tree = markdownParser.parse(stripFrontmatter(source));
  const firstContent = tree.children.find((node) => node.type !== 'html');

  if (firstContent?.type !== 'heading' || firstContent.depth !== 1) return undefined;

  return getNodeText(firstContent).trim() || undefined;
}

/**
 * @param {string} source
 * @param {string} filePath
 * @returns {string}
 */
export function deriveMarkdownTitle(source, filePath) {
  const heading = extractLeadingMarkdownTitle(source);
  if (heading) return heading;

  const fileName = filePath.split(/[\\/]/u).at(-1) ?? filePath;
  return fileName
    .replace(/\.(md|mdx)$/iu, '')
    .replace(/^readme$/iu, 'Overview')
    .replace(/[-_]+/gu, ' ');
}
