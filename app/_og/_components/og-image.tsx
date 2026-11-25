import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ReactNode } from 'react';

export const OG_SIZE = { width: 1200, height: 630 };

/** Inter 400/600/800 and JetBrains Mono 500 (SIL OFL, from @fontsource), for `ImageResponse`. */
export async function getOGFonts() {
  const dir = join(process.cwd(), 'app/_og/fonts');
  const load = (file: string) => readFile(join(dir, file));
  const [regular, semibold, extrabold, mono] = await Promise.all([
    load('inter-latin-400-normal.woff'),
    load('inter-latin-600-normal.woff'),
    load('inter-latin-800-normal.woff'),
    load('jetbrains-mono-latin-500-normal.woff'),
  ]);
  return [
    { name: 'Inter', data: regular, weight: 400 as const },
    { name: 'Inter', data: semibold, weight: 600 as const },
    { name: 'Inter', data: extrabold, weight: 800 as const },
    { name: 'JetBrains Mono', data: mono, weight: 500 as const },
  ];
}

// Dark Viz editor tokens (statelyai/viz packages/editor/src/index.css).
const BG = '#15151d'; // canvas
const GRID = '#1a1a24'; // grid
const FG = '#f5f7f7'; // fg
const MUTED = '#9da1b1'; // fg-muted
const NODE = '#2e2f3c'; // node fill
const EDGE = '#72758b'; // node stroke, edge

// Authored ramps, dark: fill 800 / border 700 / title 100 / edge 500.
const RAMPS = {
  blue: {
    fill: '#123153',
    border: '#20527f',
    title: '#beeaf9',
    edge: '#3178aa',
  },
  purple: {
    fill: '#341c79',
    border: '#5c31b9',
    title: '#edddfb',
    edge: '#8355e5',
  },
  orange: {
    fill: '#561e00',
    border: '#8a3500',
    title: '#ffdeae',
    edge: '#c14f0f',
  },
  green: {
    fill: '#14371c',
    border: '#265a2f',
    title: '#c9edbc',
    edge: '#29833b',
  },
  pink: {
    fill: '#5d0843',
    border: '#95146b',
    title: '#fdd7fd',
    edge: '#cf249b',
  },
  yellow: {
    fill: '#432b00',
    border: '#714700',
    title: '#fde283',
    edge: '#a06500',
  },
};
type Ramp = (typeof RAMPS)['blue'];

export interface OGImageProps {
  title: string;
  description?: string;
  type: 'docs' | 'blog';
  /** Parent slugs, e.g. ['xstate', 'v6'] */
  path?: string[];
  /** Page URL path, e.g. /docs/xstate/v6/fsm */
  url?: string;
  author?: string;
  date?: string;
}

const LOGO_PATHS = [
  'M18.3666998,4.940375 C19.4967998,3.810195 19.4967998,1.977815 18.3666998,0.847635 C17.2364998,-0.282545 15.4040997,-0.282545 14.2738997,0.847635 C13.1436997,1.977815 13.1436997,3.810195 14.2738997,4.940375 C15.4040997,6.070555 17.2364998,6.070555 18.3666998,4.940375 Z',
  'M23.3239998,15.611655 L11.8041998,4.091795 L7.71648975,0.004115 C5.45305975,2.267545 5.47557975,5.904795 7.72774975,8.168255 L12.6937997,13.134255 L12.6824997,13.145555 L15.4976997,15.960755 C15.5990998,16.062055 15.6665998,16.208455 15.6665998,16.354855 C15.6665998,16.512455 15.5877998,16.658855 15.4864998,16.760255 L12.1982998,20.048455 C11.9730998,20.273655 11.6239998,20.273655 11.3987998,20.048455 L8.11061975,16.748955 C7.88539975,16.523755 7.88539975,16.174655 8.11061975,15.949455 C10.3627998,13.550855 8.68491975,10.679355 7.63766975,9.710955 L6.90570975,8.978955 L0.32937975,15.566555 C-0.10979325,16.005755 -0.10979325,16.715155 0.32937975,17.154355 L11.0046998,27.829655 C11.4437998,28.268855 12.1532998,28.268855 12.5923998,27.829655 L23.2451998,17.176855 C23.4816998,16.985455 23.6280998,16.692655 23.6280998,16.366155 C23.6280998,16.073355 23.5041998,15.803055 23.3239998,15.611655 Z',
  'M38.0868998,13.201855 C35.4855997,12.864055 35.0463997,12.323555 35.0463997,11.253755 C35.0463997,10.172755 36.0485998,9.497055 37.6701998,9.497055 C39.4493997,9.497055 40.3389997,10.082655 40.6317997,11.433955 L40.6430997,11.478955 L42.1407997,11.478955 L42.1294998,11.422655 C41.8704998,9.406955 40.2826997,8.303455 37.6588998,8.303455 C35.2378998,8.303455 33.4811998,9.598455 33.4811998,11.388855 C33.4811998,13.629855 35.5643997,14.215355 37.8165998,14.519455 C40.1587998,14.845955 40.8794998,15.341455 40.8794998,16.602655 C40.8794998,17.796355 39.6745997,18.652155 38.0079998,18.652155 C35.3841998,18.652155 34.8549997,17.492255 34.6635998,16.242355 L34.6522997,16.197255 L33.0419998,16.197255 L33.0532998,16.253555 C33.2558997,17.886455 34.2806998,19.845755 38.0079998,19.845755 C40.5641998,19.845755 42.5010998,18.404355 42.5010998,16.501355 C42.5010998,14.260455 40.8119997,13.584755 38.0868998,13.201855 Z',
  'M53.1647998,8.449655 L44.0321998,8.449655 L44.0321998,9.879755 L47.7595997,9.879755 L47.7595997,19.710555 L49.4261998,19.710555 L49.4261998,9.879755 L53.1647998,9.879755 L53.1647998,8.449655 Z',
  'M57.7365998,8.449655 L53.2772997,19.710555 L54.8650997,19.710555 L56.1037998,16.501155 L61.3287998,16.501155 L62.5900998,19.710555 L64.2453998,19.710555 L59.8536998,8.449655 L57.7365998,8.449655 Z M56.6780998,15.206155 L58.7162997,9.767155 L60.7544998,15.206155 L56.6780998,15.206155 Z',
  'M64.4706997,9.879755 L68.2092997,9.879755 L68.2092997,19.710555 L69.8758998,19.710555 L69.8758998,9.879755 L73.6144998,9.879755 L73.6144998,8.449655 L64.4706997,8.449655 L64.4706997,9.879755 Z',
  'M77.7134997,14.766955 L80.8777997,14.766955 L80.8777997,13.348155 L77.7134997,13.348155 L77.7134997,9.879755 L83.9406998,9.879755 L83.9406998,8.449655 L76.0468997,8.449655 L76.0468997,19.710555 L83.9406998,19.710555 L83.9406998,18.280355 L77.7134997,18.280355 L77.7134997,14.766955 Z',
  'M88.3091998,8.449655 L86.6425998,8.449655 L86.6425998,19.710555 L94.1872998,19.710555 L94.1872998,18.280355 L88.3091998,18.280355 L88.3091998,8.449655 Z',
  'M101.891,8.449655 L98.6927998,13.584655 L95.3595998,8.449655 L93.4677997,8.449655 L97.8144997,14.812055 L97.8144997,19.710555 L99.4810997,19.710555 L99.4810997,14.823355 L103.58,8.449655 L101.891,8.449655 Z',
];

/** XState pages take Stately orange, the blog purple, other docs blue. */
function sectionRamp(type: 'docs' | 'blog', path: string[]) {
  if (type === 'blog') return RAMPS.purple;
  if (path[0] === 'xstate') return RAMPS.orange;
  return RAMPS.blue;
}

type Dir = 'r' | 'l' | 'u' | 'd';
type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
  ramp?: Ramp;
  final?: boolean;
  compound?: boolean;
};
type MachineSpec = {
  boxes: Box[];
  edges: { d: string; color: string; tip: [number, number, Dir] }[];
  pills: { x: number; y: number; color: string }[];
  markers: { x: number; y: number; color: string }[];
};

const head = ([x, y, dir]: [number, number, Dir]) =>
  ({
    r: `M${x - 12},${y - 6} L${x},${y} L${x - 12},${y + 6} z`,
    l: `M${x + 12},${y - 6} L${x},${y} L${x + 12},${y + 6} z`,
    u: `M${x - 6},${y + 12} L${x},${y} L${x + 6},${y + 12} z`,
    d: `M${x - 6},${y - 12} L${x},${y} L${x + 6},${y - 12} z`,
  })[dir];

const { blue, orange, green } = RAMPS;

// An abstract statechart: two states into a parent state, then out to a final
// state. No names, only boxes, blank event pills and initial markers.
const MACHINE: MachineSpec = {
  boxes: [
    { x: 40, y: 180, w: 320, h: 220, compound: true },
    { x: 60, y: 70, w: 140, h: 44, ramp: blue },
    { x: 280, y: 70, w: 140, h: 44 },
    { x: 80, y: 240, w: 110, h: 44, ramp: green },
    { x: 230, y: 240, w: 100, h: 44, ramp: orange },
    { x: 150, y: 320, w: 110, h: 44, ramp: blue },
    { x: 140, y: 470, w: 120, h: 48, ramp: green, final: true },
  ],
  edges: [
    { d: 'M200,92 H280', color: blue.edge, tip: [280, 92, 'r'] },
    { d: 'M340,114 V180', color: EDGE, tip: [340, 180, 'd'] },
    { d: 'M130,114 V180', color: blue.edge, tip: [130, 180, 'd'] },
    { d: 'M190,262 H230', color: green.edge, tip: [230, 262, 'r'] },
    { d: 'M280,284 V342 H260', color: orange.edge, tip: [260, 342, 'l'] },
    { d: 'M150,342 H120 V284', color: blue.edge, tip: [120, 284, 'u'] },
    { d: 'M200,400 V470', color: EDGE, tip: [200, 470, 'd'] },
  ],
  pills: [
    { x: 240, y: 92, color: blue.edge },
    { x: 130, y: 147, color: blue.edge },
    { x: 200, y: 435, color: EDGE },
  ],
  markers: [
    { x: 60, y: 92, color: EDGE },
    { x: 80, y: 262, color: EDGE },
  ],
};

function StateBox({ x, y, w, h, ramp, final, compound }: Box) {
  const border = ramp?.border ?? EDGE;
  const fill = ramp?.fill ?? NODE;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        border: `3px solid ${border}`,
        // As in the editor, a parent's children area is the canvas itself.
        backgroundColor: compound ? 'transparent' : fill,
      }}
    >
      {compound && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 16,
            backgroundColor: fill,
            borderBottom: `3px solid ${border}`,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}
        >
          <div
            style={{
              width: 80,
              height: 10,
              borderRadius: 5,
              backgroundColor: border,
            }}
          />
        </div>
      )}
      {final && (
        <svg width="26" height="26" viewBox="0 0 20 20">
          <circle
            cx="10"
            cy="10"
            r="8.5"
            fill="none"
            stroke={ramp?.title ?? MUTED}
            strokeWidth="3"
          />
          <circle cx="10" cy="10" r="4" fill={ramp?.title ?? MUTED} />
        </svg>
      )}
    </div>
  );
}

function Machine({ spec }: { spec: MachineSpec }) {
  const compounds = spec.boxes.filter((b) => b.compound);
  const leaves = spec.boxes.filter((b) => !b.compound);
  // Fit the machine's bounds into the right two-fifths, inside the card's 64px margin.
  const minX = Math.min(
    ...spec.boxes.map((b) => b.x),
    ...spec.markers.map((m) => m.x - 28),
  );
  const minY = Math.min(
    ...spec.boxes.map((b) => b.y),
    ...spec.markers.map((m) => m.y - 28),
  );
  const maxX = Math.max(...spec.boxes.map((b) => b.x + b.w));
  const maxY = Math.max(...spec.boxes.map((b) => b.y + b.h));
  const area = { x: 696, y: 64, w: 440, h: 502 };
  const scale = Math.min(area.w / (maxX - minX), area.h / (maxY - minY));
  // Satori scales about the element's center (420x630 frame), whatever transformOrigin says.
  const left =
    area.x + (area.w - (maxX - minX) * scale) / 2 - 210 - (minX - 210) * scale;
  const top =
    area.y + (area.h - (maxY - minY) * scale) / 2 - 315 - (minY - 315) * scale;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: 420,
        height: 630,
        display: 'flex',
        transform: `scale(${scale})`,
      }}
    >
      {compounds.map((b) => (
        <StateBox key={`${b.x},${b.y}`} {...b} />
      ))}
      <svg
        width="420"
        height="630"
        viewBox="0 0 420 630"
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        {spec.markers.map(({ x, y, color }) => (
          <g key={`${x},${y}`}>
            <circle cx={x - 22} cy={y - 22} r="5" fill={color} />
            <path
              d={`M${x - 22},${y - 15} Q${x - 22},${y} ${x - 10},${y} L${x - 8},${y}`}
              fill="none"
              stroke={color}
              strokeWidth="3"
            />
            <path d={head([x, y, 'r'])} fill={color} />
          </g>
        ))}
        {spec.edges.map((e) => (
          <g key={e.d}>
            <path d={e.d} fill="none" stroke={e.color} strokeWidth="3" />
            <path d={head(e.tip)} fill={e.color} />
          </g>
        ))}
      </svg>
      {leaves.map((b) => (
        <StateBox key={`${b.x},${b.y}`} {...b} />
      ))}
      {spec.pills.map(({ x, y, color }) => {
        return (
          <div
            key={`${x},${y}`}
            style={{
              position: 'absolute',
              left: x - 20,
              top: y - 10,
              width: 40,
              height: 20,
              borderRadius: 10,
              border: `3px solid ${color}`,
              backgroundColor: BG,
            }}
          />
        );
      })}
    </div>
  );
}

export function OGImage({
  title,
  type,
  path = [],
  url,
  author,
  date,
}: OGImageProps) {
  const ramp = sectionRamp(type, path);
  const pill = type === 'blog' ? 'blog' : path.length ? path.join(' ') : 'docs';
  const titleSize =
    title.length <= 20
      ? 88
      : title.length <= 40
        ? 68
        : title.length <= 64
          ? 56
          : 48;
  const meta =
    type === 'blog' ? [author, date].filter(Boolean).join(' · ') : undefined;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: 64,
        backgroundColor: BG,
        // The editor's line grid.
        backgroundImage: `linear-gradient(${GRID} 2px, transparent 2px), linear-gradient(90deg, ${GRID} 2px, transparent 2px)`,
        backgroundSize: '36px 36px',
        fontFamily: 'Inter',
        color: FG,
      }}
    >
      <Machine spec={MACHINE} />
      <svg width="124" height="35" viewBox="0 0 104 29" fill="none">
        {LOGO_PATHS.map((d) => (
          <path key={d} d={d} fill={FG} />
        ))}
      </svg>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          width: 592,
        }}
      >
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: '-0.04em',
          }}
        >
          {title}
        </div>
        <div style={{ display: 'flex', marginTop: 32 }}>
          <div
            style={{
              display: 'flex',
              padding: '4px 18px',
              borderRadius: 24,
              border: `3px solid ${ramp.edge}`,
              backgroundColor: ramp.fill,
              color: ramp.title,
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            {pill}
          </div>
        </div>
        {meta ? (
          <div style={{ marginTop: 24, fontSize: 24, color: MUTED }}>
            {meta}
          </div>
        ) : url ? (
          <div
            style={{
              marginTop: 24,
              fontFamily: 'JetBrains Mono',
              fontSize: 22,
              color: MUTED,
            }}
          >{`stately.ai${url}`}</div>
        ) : null}
      </div>
    </div>
  );
}
