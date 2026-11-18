import { BRAND, MARK_LINES, STROKE, TAG_POLYGON } from "./mark-lines";

/**
 * Static hero illustration, used while the 3D scene loads or when it cannot run
 * (reduced motion, no WebGL, low-power device). The logo strokes are repeated with a
 * small offset to suggest the extruded "building" the 3D scene builds.
 */
export function HeroFallback({ title }: { title: string }) {
  const depth = 7;
  const layers = Array.from({ length: depth }, (_, i) => depth - i);

  return (
    <svg
      viewBox="-20 -20 900 860"
      role="img"
      aria-label={title}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* soft ground shadow */}
      <ellipse cx="470" cy="790" rx="360" ry="34" fill="#141414" opacity="0.08" />

      {/* extrusion layers, back to front */}
      {layers.map((i) => (
        <g
          key={i}
          transform={`translate(${i * 9} ${-i * 9})`}
          fill="none"
          stroke={i === depth ? BRAND.orange : "#ffffff"}
          strokeOpacity={i === depth ? 0.9 : 0.55 + (depth - i) * 0.05}
          strokeWidth={STROKE}
          strokeLinejoin="miter"
          strokeMiterlimit={10}
        >
          {MARK_LINES.map((line, n) => (
            <polyline key={n} points={line.map((p) => p.join(",")).join(" ")} />
          ))}
        </g>
      ))}

      {/* front face */}
      <g
        fill="none"
        stroke="#ffffff"
        strokeWidth={STROKE}
        strokeLinejoin="miter"
        strokeMiterlimit={10}
      >
        {MARK_LINES.map((line, n) => (
          <polyline key={n} points={line.map((p) => p.join(",")).join(" ")} />
        ))}
      </g>
      <polygon points={TAG_POLYGON.map((p) => p.join(",")).join(" ")} fill={BRAND.orange} />
    </svg>
  );
}
