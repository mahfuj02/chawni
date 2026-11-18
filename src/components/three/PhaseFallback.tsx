import type { ReactNode } from "react";
import type { PhaseKey } from "@/content/types";

const ORANGE = "#F47C24";
const S = 46; // pixels per model unit
const OX = 320;
const OY = 190;

/** Isometric projection of model coordinates (x, y on the ground, z up). */
function P(x: number, y: number, z: number): [number, number] {
  return [OX + (x - y) * 0.866 * S, OY + (x + y) * 0.5 * S - z * S];
}
const pts = (list: [number, number][]) => list.map((p) => p.join(",")).join(" ");

interface BoxProps {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  top?: string;
  left?: string;
  right?: string;
  stroke?: string;
  opacity?: number;
}

function Box({
  x,
  y,
  z,
  w,
  d,
  h,
  top = "#ffffff",
  left = "#d9dfe5",
  right = "#bcc5ce",
  stroke = "none",
  opacity = 1,
}: BoxProps) {
  return (
    <g opacity={opacity} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round">
      <polygon
        points={pts([
          P(x, y + d, z),
          P(x + w, y + d, z),
          P(x + w, y + d, z + h),
          P(x, y + d, z + h),
        ])}
        fill={left}
      />
      <polygon
        points={pts([
          P(x + w, y, z),
          P(x + w, y + d, z),
          P(x + w, y + d, z + h),
          P(x + w, y, z + h),
        ])}
        fill={right}
      />
      <polygon
        points={pts([
          P(x, y, z + h),
          P(x + w, y, z + h),
          P(x + w, y + d, z + h),
          P(x, y + d, z + h),
        ])}
        fill={top}
      />
    </g>
  );
}

function Line({
  a,
  b,
  dashed = false,
  width = 2,
}: {
  a: [number, number, number];
  b: [number, number, number];
  dashed?: boolean;
  width?: number;
}) {
  const [x1, y1] = P(...a);
  const [x2, y2] = P(...b);
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={ORANGE}
      strokeWidth={width}
      strokeDasharray={dashed ? "6 6" : undefined}
      strokeLinecap="round"
    />
  );
}

function Footprint({
  x,
  y,
  w,
  d,
  z = 0,
}: {
  x: number;
  y: number;
  w: number;
  d: number;
  z?: number;
}) {
  return (
    <polygon
      points={pts([P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)])}
      fill="none"
      stroke={ORANGE}
      strokeWidth={2.5}
      strokeLinejoin="miter"
    />
  );
}

const GROUND = { x: 0, y: 0, w: 9, d: 7 };
// Ground floor and cantilevered upper floor
const G = { x: 1.2, y: 1.6, w: 5, d: 3.4, h: 1.5 };
const U = { x: 2.6, y: 1.9, w: 5, d: 3, h: 1.4 };

/** Which layer is visible per phase. Layers cross-fade with CSS (0.8s). */
function Layer({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <g style={{ opacity: on ? 1 : 0, transition: "opacity 0.8s ease" }} aria-hidden="true">
      {children}
    </g>
  );
}

export function PhaseFallback({ phase, title }: { phase: PhaseKey; title: string }) {
  const cols: [number, number][] = [
    [G.x, G.y],
    [G.x + G.w, G.y],
    [G.x, G.y + G.d],
    [G.x + G.w, G.y + G.d],
    [G.x + G.w / 2, G.y],
    [G.x + G.w / 2, G.y + G.d],
  ];

  return (
    <svg viewBox="0 0 640 440" role="img" aria-label={title} className="h-full w-full">
      {/* ground plate (always) */}
      <polygon
        points={pts([
          P(GROUND.x - 0.4, GROUND.y - 0.4, 0),
          P(GROUND.x + GROUND.w, GROUND.y - 0.4, 0),
          P(GROUND.x + GROUND.w, GROUND.y + GROUND.d, 0),
          P(GROUND.x - 0.4, GROUND.y + GROUND.d, 0),
        ])}
        fill="#2b3035"
        stroke="#3a4046"
      />

      {/* 01 plan: orange lines on the plate */}
      <Layer on={phase === "plan"}>
        <Footprint x={G.x} y={G.y} w={G.w} d={G.d} />
        <Footprint x={U.x} y={U.y} w={U.w} d={U.d} />
        <Line a={[G.x + 2, G.y, 0]} b={[G.x + 2, G.y + G.d, 0]} width={1.5} />
        <Line a={[G.x, G.y + 1.7, 0]} b={[G.x + G.w, G.y + 1.7, 0]} width={1.5} />
        <Line a={[0.3, 0.3, 0]} b={[GROUND.w - 0.4, 0.3, 0]} dashed width={1.5} />
        <Line a={[0.3, 0.3, 0]} b={[0.3, GROUND.d - 0.3, 0]} dashed width={1.5} />
      </Layer>

      {/* 02 design: white massing */}
      <Layer on={phase === "design"}>
        <Footprint x={G.x} y={G.y} w={G.w} d={G.d} />
        <Box {...G} z={0} />
        <Box {...U} z={G.h} />
      </Layer>

      {/* 03 engineer: structural frame and grid */}
      <Layer on={phase === "engineer"}>
        {[0, 1.5, 2.9].map((o) => (
          <Line
            key={`gx${o}`}
            a={[G.x + o * 1.7, -0.2, 0]}
            b={[G.x + o * 1.7, GROUND.d, 0]}
            dashed
            width={1.2}
          />
        ))}
        {cols.map(([cx, cy], i) => (
          <Line key={i} a={[cx, cy, 0]} b={[cx, cy, G.h + U.h]} width={3} />
        ))}
        {[0, G.h, G.h + U.h].map((z) => (
          <g key={z}>
            <Footprint x={G.x} y={G.y} w={G.w} d={G.d} z={z} />
          </g>
        ))}
        <Box {...G} h={0.12} z={G.h} top="none" left="none" right="none" stroke={ORANGE} />
        <Box
          {...U}
          h={0.12}
          z={G.h + U.h - 0.12}
          top="none"
          left="none"
          right="none"
          stroke={ORANGE}
        />
      </Layer>

      {/* 04 build: finished with glass, warm light and trees */}
      <Layer on={phase === "build"}>
        <Box {...G} z={0} />
        <Box {...U} z={G.h} top="#ffffff" left="#c9d6e3" right="#aebfd0" />
        {/* glazing */}
        <polygon
          points={pts([
            P(G.x + 0.4, G.y + G.d, 0.2),
            P(G.x + G.w - 0.4, G.y + G.d, 0.2),
            P(G.x + G.w - 0.4, G.y + G.d, G.h - 0.2),
            P(G.x + 0.4, G.y + G.d, G.h - 0.2),
          ])}
          fill="#aecbe8"
          opacity={0.85}
        />
        <polygon
          points={pts([
            P(G.x + 1.2, G.y + G.d, 0.3),
            P(G.x + 2.2, G.y + G.d, 0.3),
            P(G.x + 2.2, G.y + G.d, G.h - 0.3),
            P(G.x + 1.2, G.y + G.d, G.h - 0.3),
          ])}
          fill={ORANGE}
          opacity={0.55}
        />
        {[
          [0.6, 5.9],
          [7.8, 0.9],
          [8.2, 5.6],
        ].map(([tx, ty], i) => {
          const [cx, cy] = P(tx, ty, 0.9);
          return <circle key={i} cx={cx} cy={cy} r={20} fill="#dfe4e9" />;
        })}
      </Layer>
    </svg>
  );
}
