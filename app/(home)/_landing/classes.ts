// Plain class-name constants. Kept out of 'use client' modules so server
// components import the string, not a client reference.

/**
 * className for a 3-column DataTable that reflows on phones: header hidden,
 * row = [col 1 | col 3] on top, col 2 full width below. Same <table> markup.
 */
export const stackOn3 =
  'max-sm:[&_thead]:hidden max-sm:[&_tbody_tr]:grid max-sm:[&_tbody_tr]:grid-cols-[minmax(0,1fr)_auto] max-sm:[&_td:nth-child(2)]:col-span-2 max-sm:[&_td:nth-child(2)]:row-start-2 max-sm:[&_td:nth-child(2)]:pt-0';

/** Parallel-state region divider: dashed, as statecharts draw orthogonal regions. */
export const parallelRegionCls =
  'border-dashed border-[var(--sp-node-stroke)]';

/** Inline text link: primary, underlined, so it reads as clickable. */
export const textLinkCls =
  'text-[var(--sp-primary)] underline underline-offset-4 decoration-[color:var(--sp-primary)]/40 hover:decoration-[color:var(--sp-primary)] transition-colors';

/** State node title type, as the editor draws it: 20/25 600, -0.2px tracking. */
export const nodeTitleCls =
  'text-[20px] leading-[25px] font-semibold tracking-[-0.2px] text-[#fafafa]';
