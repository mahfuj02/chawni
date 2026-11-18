"use client";

import { Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { BUILDING_BOX, BuildingModel } from "./BuildingModel";

// Draco decoders are self-hosted (public/draco) so models load without a third-party CDN.
useGLTF.setDecoderPath("/draco/");

export interface ViewerHotspot {
  /** Already-translated accessible name (Html content cannot use React context). */
  label: string;
}

export interface ProjectViewerCanvasProps {
  modelUrl?: string;
  autoRotate: boolean;
  explode: boolean;
  showHotspots: boolean;
  hotspots: ViewerHotspot[];
  onHotspot: (index: number) => void;
  /** Rendering pauses when the viewer is off screen. */
  active: boolean;
  onReady?: () => void;
  loadingLabel: string;
}

/** Six anchor points around a bounding box, one per gallery photo. */
function hotspotPoints(box: THREE.Box3): THREE.Vector3[] {
  const c = box.getCenter(new THREE.Vector3());
  const s = box.getSize(new THREE.Vector3());
  const { min, max } = box;
  return [
    new THREE.Vector3(c.x - s.x * 0.25, min.y + s.y * 0.25, max.z),
    new THREE.Vector3(c.x + s.x * 0.3, min.y + s.y * 0.7, max.z),
    new THREE.Vector3(min.x, c.y, c.z),
    new THREE.Vector3(max.x, min.y + s.y * 0.4, c.z),
    new THREE.Vector3(c.x, min.y + s.y * 0.6, min.z),
    new THREE.Vector3(c.x, max.y, c.z),
  ];
}

const TARGET_SIZE = 8;

/** Loads a GLB, scales it to a standard size, sits it on the ground and explodes its top-level parts. */
function GlbModel({
  url,
  explode,
  onBox,
}: {
  url: string;
  explode: boolean;
  onBox: (box: THREE.Box3) => void;
}) {
  const { scene } = useGLTF(url);
  const root = useRef<THREE.Group>(null);
  const e = useRef(0);

  const { object, parts, box } = useMemo(() => {
    const object = scene.clone(true);
    const raw = new THREE.Box3().setFromObject(object);
    const size = raw.getSize(new THREE.Vector3());
    const scale = TARGET_SIZE / Math.max(size.x, size.y, size.z, 0.0001);
    const center = raw.getCenter(new THREE.Vector3());
    object.scale.setScalar(scale);
    object.position.set(-center.x * scale, -raw.min.y * scale, -center.z * scale);

    // "Floors" = top-level children, ordered bottom to top.
    const parts = [...object.children]
      .map((child) => ({
        child,
        baseY: child.position.y,
        minY: new THREE.Box3().setFromObject(child).min.y,
      }))
      .sort((a, b) => a.minY - b.minY);

    const box = new THREE.Box3().setFromObject(object);
    return { object, parts, box };
  }, [scene]);

  useEffect(() => onBox(box), [box, onBox]);

  useFrame((_, delta) => {
    e.current = THREE.MathUtils.damp(e.current, explode ? 1 : 0, 4, delta);
    const gap = (1.4 * 1) / Math.max(object.scale.x, 0.0001);
    parts.forEach((p, i) => {
      p.child.position.y = p.baseY + i * gap * e.current;
    });
  });

  return <primitive ref={root} object={object} />;
}

function Hotspots({
  box,
  hotspots,
  onHotspot,
}: {
  box: THREE.Box3;
  hotspots: ViewerHotspot[];
  onHotspot: (index: number) => void;
}) {
  const points = useMemo(() => hotspotPoints(box), [box]);
  return (
    <>
      {hotspots.slice(0, points.length).map((h, i) => (
        <Html key={i} position={points[i]} center zIndexRange={[20, 0]}>
          <button
            type="button"
            aria-label={h.label}
            onClick={() => onHotspot(i)}
            className="group grid size-11 place-items-center rounded-full"
          >
            <span className="block size-4 rounded-full bg-[#F47C24] ring-4 ring-[#F47C24]/35 transition-transform duration-200 group-hover:scale-125 group-focus-visible:scale-125" />
          </button>
        </Html>
      ))}
    </>
  );
}

function Loader({ label }: { label: string }) {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      className="absolute inset-x-6 bottom-6 flex flex-col gap-2 text-sm text-white"
    >
      <span>
        {label} {Math.round(progress)}%
      </span>
      <span className="block h-1 w-full overflow-hidden rounded-full bg-white/20">
        <span className="block h-full bg-[#F47C24]" style={{ width: `${progress}%` }} />
      </span>
    </div>
  );
}

export default function ProjectViewerCanvas({
  modelUrl,
  autoRotate,
  explode,
  showHotspots,
  hotspots,
  onHotspot,
  active,
  onReady,
  loadingLabel,
}: ProjectViewerCanvasProps) {
  const [box, setBox] = useState<THREE.Box3>(BUILDING_BOX);

  return (
    <>
      <Canvas
        camera={{ fov: 32, near: 0.1, far: 200, position: [13.5, 9, 15] }}
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "never"}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={() => onReady?.()}
      >
        <hemisphereLight args={["#ffffff", "#8896a5", 0.9]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[6, 10, 7]} intensity={2.4} />
        <directionalLight position={[-7, 5, -5]} intensity={0.5} />

        <Suspense fallback={null}>
          {modelUrl ? (
            <GlbModel url={modelUrl} explode={explode} onBox={setBox} />
          ) : (
            <BuildingModel phase="build" explode={explode ? 1 : 0} />
          )}
          {showHotspots && <Hotspots box={box} hotspots={hotspots} onHotspot={onHotspot} />}
        </Suspense>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          enablePan={false}
          minDistance={7}
          maxDistance={26}
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 2 - 0.04}
          autoRotate={autoRotate}
          autoRotateSpeed={0.9}
          target={[0.4, 1.5, 0]}
        />
      </Canvas>
      <Loader label={loadingLabel} />
    </>
  );
}
