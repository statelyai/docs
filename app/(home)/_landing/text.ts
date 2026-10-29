// Advance widths of Inter 600 at the two sizes the statechart uses, measured
// in the browser (canvas measureText), so nodes and labels can be sized from
// their text the way the editor sizes them. Unknown characters take the mean.
const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_ -.';
const W20 = [
  11.48, 12.49, 11.65, 12.49, 11.83, 7.77, 12.51, 12.24, 5.23, 5.23, 11.39, 5.23, 18, 12.24, 12.17, 12.49, 12.49, 7.94, 10.99, 7.06, 12.24, 11.74, 16.79, 11.37, 11.77, 11.32,
  14.55, 13.18, 14.73, 14.44, 12.11, 11.76, 14.98, 14.91, 5.53, 11.6, 14.07, 11.31, 18.45, 15.18, 15.37, 12.9, 15.45, 13.05, 13.01, 13.21, 14.72, 14.55, 20.4, 14.39, 14.27, 13.05,
  13.19, 8.46, 12.46, 12.72, 13.32, 12.25, 12.8, 11.53, 12.81, 12.8, 9.39, 5.03, 9.3, 6.37,
];
const W14 = [
  8.04, 8.74, 8.16, 8.74, 8.28, 5.44, 8.76, 8.57, 3.66, 3.66, 7.97, 3.66, 12.6, 8.57, 8.52, 8.74, 8.74, 5.56, 7.69, 4.94, 8.57, 8.22, 11.75, 7.96, 8.24, 7.92,
  10.19, 9.23, 10.31, 10.11, 8.47, 8.23, 10.49, 10.44, 3.87, 8.12, 9.85, 7.92, 12.91, 10.63, 10.76, 9.03, 10.82, 9.13, 9.11, 9.24, 10.3, 10.19, 14.28, 10.07, 9.99, 9.13,
  9.24, 5.92, 8.72, 8.91, 9.33, 8.57, 8.96, 8.07, 8.96, 8.96, 6.57, 3.52, 6.51, 4.46,
];
const index = new Map([...CHARS].map((c, i) => [c, i]));
const mean = (w: number[]) => w.reduce((a, b) => a + b, 0) / w.length;
const M20 = mean(W20);
const M14 = mean(W14);

/** Width of `s` in Inter 600 20px with the editor's -0.01em tracking (state names). */
export const stateTextWidth = (s: string) => [...s].reduce((w, c) => w + (W20[index.get(c) ?? -1] ?? M20), 0) - 0.2 * s.length;

/** Width of `s` in Inter 600 14px (event labels). */
export const eventTextWidth = (s: string) => [...s].reduce((w, c) => w + (W14[index.get(c) ?? -1] ?? M14), 0);
