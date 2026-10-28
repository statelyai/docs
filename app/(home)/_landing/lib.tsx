// Plain (non-client) constants and helpers shared by server and client
// sections. Kept out of 'use client' modules so server components get values,
// not client references.

export const MCP_URL = 'https://mcp.stately.ai/mcp';
export const SCAN_CMD = 'npx statelyai scan';
export const MCP_CMD = 'npx -y @statelyai/mcp';
export const DEMO_URL = 'https://cal.com/statelyai/enterprise-calls';

export type Client = {
  id: string;
  label: string;
  note: string;
  cmd: string;
  prompt: boolean;
  /** How to complete Stately sign-in. A command (prompt) or a sentence. */
  login: { cmd: string } | { text: string };
};

export const clients: Client[] = [
  { id: 'claude', label: 'Claude Code', note: 'terminal', cmd: `claude mcp add --transport http stately ${MCP_URL}`, prompt: true, login: { text: 'In Claude Code, run /mcp and complete Stately sign-in.' } },
  { id: 'codex', label: 'Codex', note: 'terminal', cmd: `codex mcp add stately --url ${MCP_URL}`, prompt: true, login: { cmd: 'codex mcp login stately' } },
  { id: 'cursor', label: 'Cursor', note: '.cursor/mcp.json', cmd: `{"mcpServers":{"stately":{"url":"${MCP_URL}"}}}`, prompt: false, login: { text: 'Enable the server in Cursor Settings → MCP and complete Stately sign-in.' } },
  { id: 'vscode', label: 'VS Code', note: 'terminal', cmd: `code --add-mcp '{"name":"stately","type":"http","url":"${MCP_URL}"}'`, prompt: true, login: { text: 'Run MCP: List Servers, start stately, and complete Stately sign-in.' } },
  { id: 'other', label: 'Other', note: 'any MCP client · server URL (streamable HTTP)', cmd: MCP_URL, prompt: false, login: { text: 'Start the server in your client and complete Stately sign-in (OAuth).' } },
];

/**
 * Inserts <wbr> before `https://` and before a `stately` token (not inside a
 * URL host) so commands wrap between words, never mid-host.
 */
export function breakable(text: string): React.ReactNode[] {
  return text
    .split(/(?=https:\/\/)|(?<=[\s"'{:])(?=stately)/)
    .flatMap((part, i) => (i === 0 ? [part] : [<wbr key={i} />, part]));
}

/** Screen-reader note for links that open a new tab. */
export function NewTab() {
  return <span className="sr-only"> (opens in a new tab)</span>;
}

/** base64url of a UTF-8 string; works on the server and in the browser. */
export function encodeMachine(source: string) {
  const bytes = new TextEncoder().encode(source);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * The editor's read-only /viz route on an inline XState source: full chrome
 * (toolbar, command palette, simulation) in the given theme. No account needed.
 */
export function vizUrl(source: string, theme: 'light' | 'dark' = 'dark') {
  return `https://editor.stately.ai/viz?theme=${theme}&panels=simulation#machine=${encodeMachine(source)}&format=xstate`;
}
