/**
 * @param {Array<{ workspacePath: string }>} entries
 * @param {string} directoryPath
 */
export function getWorkspaceDescendantEntries(entries, directoryPath) {
  const prefix = `${directoryPath.replace(/\/+$/u, '')}/`;

  return entries
    .filter((entry) => entry.workspacePath.startsWith(prefix))
    .sort((left, right) => left.workspacePath.localeCompare(right.workspacePath));
}
