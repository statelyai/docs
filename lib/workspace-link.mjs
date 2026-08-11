/**
 * @param {string} href
 * @returns {{ target: string; suffix: string } | undefined}
 */
export function parseWorkspaceRelativeHref(href) {
  const suffixIndex = href.search(/[?#]/u);
  const target = suffixIndex === -1 ? href : href.slice(0, suffixIndex);

  if (
    !target ||
    target.startsWith('/') ||
    /^[a-zA-Z][a-zA-Z\d+.-]*:/u.test(target)
  ) {
    return undefined;
  }

  return {
    target,
    suffix: suffixIndex === -1 ? '' : href.slice(suffixIndex),
  };
}
