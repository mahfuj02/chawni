"use client";

import { Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { BRAND } from "./brand";

// Draco decoders are self-hosted (public/draco) so models load without a third-party CDN.
useGLTF.setDecoderPath("/draco/");

/** Distance between storeys when exploded (metres). See the GLB conventions in docs/CONTENT_GUIDE.md. */
const FLOOR_GAP = 2.4;
const SKY = "#DBE7F2";

export interface ViewerHotspot {
  id: string;
  /** Already-translated accessible name (Html content cannot use React context). */
  label: string;
  position: [number, number, number];
  floor: number | "roof";
  /** 0-based index into the gallery. */
  photoIndex: number;
}

export interface ProjectViewerCanvasProps {
  modelUrl: string;
  autoRotate: boolean;
  explode: boolean;
  showHotspots: boolean;
  hotspots: ViewerHotspot[];
  onHotspot: (photoIndex: number) => void;
  /** Rendering pauses when the viewer is off screen. */
  active: boolean;
  onReady?: () => void;
  onError?: () => void;
  loadingLabel: string;
}

/** Start downloading a model early (called when the visitor hovers the section). */
export function preloadModel(url: string) {
  useGLTF.preload(url);
}

interface Parts {
  object: THREE.Object3D;
  floors: { node: THREE.Object3D; index: number; baseY: number }[];
  roof?: { node: THREE.Object3D; baseY: number };
  /** Highest floor index N, so the roof sits at N + 1. */
  top: number;
  box: THREE.Box3;
  dispose: () => void;
}

function isTransparent(mesh: THREE.Mesh) {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return mats.some((m) => m.transparent || m.opacity < 1);
}

/** Clone the GLB, find floor-N / roof nodes, add orange edges and set up shadows. */
function prepare(source: THREE.Object3D): Parts {
  const object = source.clone(true);
  const floors: Parts["floors"] = [];
  let roof: Parts["roof"];

  object.children.forEach((child) => {
    const m = /^floor-(\d+)$/.exec(child.name);
    if (m) floors.push({ node: child, index: Number(m[1]), baseY: child.position.y });
    else if (child.name === "roof") roof = { node: child, baseY: child.position.y };
  });
  floors.sort((a, b) => a.index - b.index);
  const top = floors.length ? floors[floors.length - 1].index : 0;

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: BRAND.orange,
    transparent: true,
    opacity: 0.75,
  });
  const edgeGeometries: THREE.BufferGeometry[] = [];
  const meshes: THREE.Mesh[] = [];
  object.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
  });

  for (const mesh of meshes) {
    if (isTransparent(mesh)) {
      // Glass neither casts nor receives shadows.
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      continue;
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    let inSite = false;
    for (let p: THREE.Object3D | null = mesh; p; p = p.parent) if (p.name === "site") inSite = true;
    if (inSite) continue;
    const geometry = new THREE.EdgesGeometry(mesh.geometry, 30);
    edgeGeometries.push(geometry);
    const lines = new THREE.LineSegments(geometry, edgeMaterial);
    lines.raycast = () => {}; // edges are decoration, never hit-test them
    mesh.add(lines);
  }

  const box = new THREE.Box3().setFromObject(object);
  return {
    object,
    floors,
    roof,
    top,
    box,
    dispose: () => {
      edgeMaterial.dispose();
      edgeGeometries.forEach((g) => g.dispose());
    },
  };
}

function Model({
  url,
  explode,
  hotspots,
  showHotspots,
  onHotspot,
  onBox,
}: {
  url: string;
  explode: boolean;
  hotspots: ViewerHotspot[];
  showHotspots: boolean;
  onHotspot: (photoIndex: number) => void;
  onBox: (box: THREE.Box3) => void;
}) {
  const gltf = useGLTF(url);
  const parts = useMemo(() => prepare(gltf.scene), [gltf.scene]);
  const e = useRef(0);
  const anchors = useRef<(THREE.Group | null)[]>([]);

  useEffect(() => () => parts.dispose(), [parts]);
  useEffect(() => onBox(parts.box), [parts, onBox]);

  useFrame((_, delta) => {
    // ~0.8 s eased explode / assemble
    e.current = THREE.MathUtils.damp(e.current, explode ? 1 : 0, 5.5, delta);
    for (const f of parts.floors) f.node.position.y = f.baseY + f.index * FLOOR_GAP * e.current;
    if (parts.roof)
      parts.roof.node.position.y = parts.roof.baseY + (parts.top + 1) * FLOOR_GAP * e.current;
    hotspots.forEach((h, i) => {
      const group = anchors.current[i];
      if (!group) return;
      const index = h.floor === "roof" ? parts.top + 1 : h.floor;
      group.position.set(
        h.position[0],
        h.position[1] + index * FLOOR_GAP * e.current,
        h.position[2],
      );
    });
  });

  return (
    <>
      <primitive object={parts.object} />
      {showHotspots &&
        hotspots.map((h, i) => (
          <group
            key={h.id}
            ref={(el) => {
              anchors.current[i] = el;
            }}
            position={h.position}
          >
            <Html center zIndexRange={[20, 0]}>
              <button
                type="button"
                aria-label={h.label}
                onClick={() => onHotspot(h.photoIndex)}
                className="group grid size-11 place-items-center rounded-full"
              >
                <span className="block size-4 rounded-full bg-[#F47C24] ring-[3px] ring-white transition-transform duration-200 group-hover:scale-125 group-focus-visible:scale-125" />
              </button>
            </Html>
          </group>
        ))}
    </>
  );
}

/** Three-quarter front view (+X, +Y, +Z) that fits the whole model; zoom limits follow from it. */
function FitCamera({ box }: { box: THREE.Box3 | null }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const controls = useThree((s) => s.controls) as unknown as {
    target: THREE.Vector3;
    minDistance: number;
    maxDistance: number;
    update: () => void;
  } | null;

  useEffect(() => {
    if (!box || !controls) return;
    const center = box.getCenter(new THREE.Vector3());
    const radius = box.getSize(new THREE.Vector3()).length() / 2;
    const distance = (radius / Math.sin(THREE.MathUtils.degToRad(camera.fov) / 2)) * 1.05;
    const direction = new THREE.Vector3(1, 0.7, 1).normalize();
    camera.position.copy(center).addScaledVector(direction, distance);
    camera.near = Math.max(distance / 200, 0.1);
    camera.far = distance * 20;
    camera.updateProjectionMatrix();
    controls.target.copy(center);
    controls.minDistance = distance * 0.6;
    controls.maxDistance = distance * 2;
    controls.update();
  }, [box, controls, camera]);

  return null;
}

/** Soft key light whose shadow frustum follows the model's size. */
function Lights({ box }: { box: THREE.Box3 | null }) {
  const light = useRef<THREE.DirectionalLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  const { center, size } = useMemo(() => {
    const b = box ?? new THREE.Box3(new THREE.Vector3(-10, 0, -10), new THREE.Vector3(10, 20, 10));
    return {
      center: b.getCenter(new THREE.Vector3()),
      size: b.getSize(new THREE.Vector3()).length(),
    };
  }, [box]);

  useEffect(() => {
    const l = light.current;
    if (!l) return;
    target.position.copy(center);
    target.updateMatrixWorld();
    const cam = l.shadow.camera;
    const r = size * 0.75;
    cam.left = -r;
    cam.right = r;
    cam.top = r;
    cam.bottom = -r;
    cam.near = 0.1;
    cam.far = size * 4;
    cam.updateProjectionMatrix();
  }, [center, size, target]);

  return (
    <>
      <hemisphereLight args={["#ffffff", "#9fb3c6", 0.85]} />
      <directionalLight
        ref={light}
        target={target}
        position={[center.x + size * 0.8, center.y + size * 1.2, center.z + size * 0.6]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.03}
      />
      <primitive object={target} />
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
      className="absolute inset-x-6 bottom-6 flex flex-col gap-2 text-sm text-ink"
    >
      <span>
        {label} {Math.round(progress)}%
      </span>
      <span className="block h-1 w-full overflow-hidden rounded-full bg-ink/15">
        <span className="block h-full bg-[#F47C24]" style={{ width: `${progress}%` }} />
      </span>
    </div>
  );
}

/** If a model fails to load, tell the parent so it can fall back to the poster photo. */
class ModelErrorBoundary extends Component<
  { onError?: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
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
  onError,
  loadingLabel,
}: ProjectViewerCanvasProps) {
  const [box, setBox] = useState<THREE.Box3 | null>(null);

  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 32, near: 0.1, far: 1000, position: [30, 25, 30] }}
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={() => onReady?.()}
      >
        <color attach="background" args={[SKY]} />
        <Lights box={box} />
        <ModelErrorBoundary onError={onError}>
          <Suspense fallback={null}>
            <Model
              url={modelUrl}
              explode={explode}
              hotspots={hotspots}
              showHotspots={showHotspots}
              onHotspot={onHotspot}
              onBox={setBox}
            />
          </Suspense>
        </ModelErrorBoundary>
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          enablePan={false}
          minPolarAngle={0.1}
          maxPolarAngle={0.49 * Math.PI}
          autoRotate={autoRotate}
          autoRotateSpeed={0.9}
        />
        <FitCamera box={box} />
      </Canvas>
      <Loader label={loadingLabel} />
    </>
  );
}
