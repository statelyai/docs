export function inlineEmbedURL(
  machine: unknown,
  theme: 'light' | 'dark',
  mode?: string,
): string | null {
  if (!machine || typeof machine !== 'object' || Array.isArray(machine))
    return null;
  const wrapper = machine as Record<string, unknown>;
  const definition = wrapper.definition ?? wrapper;
  const format =
    wrapper.format ??
    (wrapper.rootNode ? 'digraph' : wrapper.nodes ? 'xgraph' : undefined);
  if (
    format !== 'digraph' &&
    format !== 'xgraph' &&
    format !== 'xstate' &&
    format !== 'xstate-json'
  )
    return null;
  const source =
    typeof definition === 'string' ? definition : JSON.stringify(definition);
  const bytes = new TextEncoder().encode(source);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const encoded = btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
  const params = new URLSearchParams({ machine: encoded, format, theme });
  if (mode) params.set('mode', mode);
  const normalizedMode = mode?.toLowerCase();
  if (normalizedMode === 'simulate' || normalizedMode === 'simulating') {
    // Keep the minimal iframe controls and add the simulation dock.
    params.set(
      'canvasSlots',
      'viewportControls,backToContent,contextMenu,dialogs,toasts,simulationControls',
    );
  }
  return `https://editor.stately.ai/viz#${params.toString()}`;
}
