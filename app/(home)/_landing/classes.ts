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
