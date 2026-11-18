"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { BRAND, MARK_LINES, STROKE, TAG_POLYGON } from "./mark-lines";

/** 1 mark pixel = 0.01 world units. The logo is 8.5 x 8 units. */
const S = 0.01;
const CX = 425;
const CY = 400;
const THICK = STROKE * S;
const FLAT_DEPTH = 0.1;
const FULL_DEPTH = 1.2;
const PLATE_Y = -(800 - CY) * S; // bottom edge of the orange tag

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = THREE.MathUtils.lerp;

/** Small seeded PRNG so the scatter is identical on every load. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Segment {
  mid: THREE.Vector3;
  length: number;
  angle: number;
  scatterPos: THREE.Vector3;
  scatterQuat: THREE.Quaternion;
  finalQuat: THREE.Quaternion;
  delay: number;
}

function buildSegments(): Segment[] {
  const rand = mulberry32(2024);
  const segments: Segment[] = [];
  for (const line of MARK_LINES) {
    for (let i = 0; i < line.length - 1; i++) {
      const [x1, y1] = line[i];
      const [x2, y2] = line[i + 1];
      const a = new THREE.Vector3((x1 - CX) * S, -(y1 - CY) * S, 0);
      const b = new THREE.Vector3((x2 - CX) * S, -(y2 - CY) * S, 0);
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const angle = Math.atan2(b.y - a.y, b.x - a.x);
      segments.push({
        mid,
        // Extend slightly so neighbouring bars overlap at the corners instead of leaving gaps.
        length: a.distanceTo(b) + THICK * 0.9,
        angle,
        scatterPos: new THREE.Vector3((rand() - 0.5) * 24, (rand() - 0.5) * 16, rand() * 9 - 2),
        scatterQuat: new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            (rand() - 0.5) * Math.PI * 2,
            (rand() - 0.5) * Math.PI * 2,
            (rand() - 0.5) * Math.PI * 2,
          ),
        ),
        finalQuat: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle),
        delay: rand() * 0.4,
      });
    }
  }
  return segments;
}

function Scene({ progress, active }: { progress: MutableRefObject<number>; active: boolean }) {
  const segments = useMemo(() => buildSegments(), []);
  const camera = useThree((s) => s.camera);

  const unitBox = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const unitEdges = useMemo(() => new THREE.EdgesGeometry(unitBox), [unitBox]);
  const tagGeometry = useMemo(() => {
    const shape = new THREE.Shape(
      TAG_POLYGON.map(([x, y]) => new THREE.Vector2((x - CX) * S, -(y - CY) * S)),
    );
    return new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: false });
  }, []);

  const white = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.8, metalness: 0 }),
    [],
  );
  const orange = useMemo(
    () => new THREE.MeshStandardMaterial({ color: BRAND.orange, roughness: 0.6 }),
    [],
  );
  const plateMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f5f7f9",
        roughness: 0.9,
        transparent: true,
        opacity: 0,
      }),
    [],
  );
  const roofMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.8,
        transparent: true,
        opacity: 0,
      }),
    [],
  );
  const edgeMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: BRAND.orange, transparent: true, opacity: 0 }),
    [],
  );

  useEffect(
    () => () => {
      [unitBox, unitEdges, tagGeometry, white, orange, plateMat, roofMat, edgeMat].forEach((o) =>
        o.dispose(),
      );
    },
    [unitBox, unitEdges, tagGeometry, white, orange, plateMat, roofMat, edgeMat],
  );

  const root = useRef<THREE.Group>(null);
  const groups = useRef<(THREE.Group | null)[]>([]);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const tag = useRef<THREE.Mesh>(null);
  const plate = useRef<THREE.Mesh>(null);
  const roof = useRef<THREE.Mesh>(null);
  const shadows = useRef<THREE.Group>(null);
  const smooth = useRef(0);
  const look = useMemo(() => new THREE.Vector3(), []);
  const tmpQ = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state, delta) => {
    if (!active) return;
    // Smooth the scrubbed value so the scene eases even if the user flicks the wheel.
    smooth.current = THREE.MathUtils.damp(smooth.current, progress.current, 8, delta);
    const p = smooth.current;

    // 0 - 0.25: scattered bars float into the flat logo.
    const assemble = clamp01(p / 0.25);
    // 0.25 - 0.55: bars extrude backwards into slabs, camera orbits to three-quarter view.
    const extrude = easeInOut(clamp01((p - 0.25) / 0.3));
    // 0.55 - 0.85: base plate, roof slab, shadows.
    const settle = easeOut(clamp01((p - 0.55) / 0.3));
    // 0.85 - 1: idle sway and pointer parallax.
    const idle = clamp01((p - 0.85) / 0.15);

    const depth = lerp(FLAT_DEPTH, FULL_DEPTH, extrude);

    segments.forEach((seg, i) => {
      const g = groups.current[i];
      const m = meshes.current[i];
      if (!g || !m) return;
      const local = easeInOut(clamp01((assemble - seg.delay) / (1 - 0.4)));
      g.position.lerpVectors(seg.scatterPos, seg.mid, local);
      tmpQ.copy(seg.scatterQuat).slerp(seg.finalQuat, local);
      g.quaternion.copy(tmpQ);
      m.scale.set(seg.length, THICK, depth);
      m.position.z = -depth / 2;
    });

    edgeMat.opacity = clamp01((p - 0.25) / 0.12) * 0.95;

    if (tag.current) {
      const slide = easeOut(clamp01((assemble - 0.7) / 0.3));
      tag.current.position.set(lerp(14, 0, slide), 0, -0.12);
      tag.current.visible = slide > 0.001;
    }

    plateMat.opacity = settle;
    roofMat.opacity = settle * 0.95;
    if (plate.current) plate.current.scale.setScalar(lerp(0.7, 1, settle));
    if (roof.current) roof.current.position.y = lerp(5.2, 3.75, settle);
    if (shadows.current) shadows.current.visible = settle > 0.05;

    // Camera: front view -> three-quarter isometric, then a small idle sway + pointer parallax.
    const azimuth =
      lerp(0, THREE.MathUtils.degToRad(38), extrude) +
      Math.sin(state.clock.elapsedTime * 0.5) * THREE.MathUtils.degToRad(6) * idle;
    const elevation = lerp(0, THREE.MathUtils.degToRad(22), extrude);
    const distance = lerp(20, 25, extrude);
    const px = state.pointer.x * 0.6 * idle;
    const py = state.pointer.y * 0.3 * idle;
    look.set(0, lerp(0, -0.2, extrude), lerp(0, -0.5, extrude));
    camera.position.set(
      look.x + Math.sin(azimuth) * Math.cos(elevation) * distance + px,
      look.y + Math.sin(elevation) * distance + py,
      look.z + Math.cos(azimuth) * Math.cos(elevation) * distance,
    );
    camera.lookAt(look);
  });

  return (
    <>
      <hemisphereLight args={["#e8f1fb", "#aecbe8", 1.1]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 10, 9]} intensity={2.2} />
      <directionalLight position={[-8, 4, -4]} intensity={0.5} />

      <group ref={root}>
        {segments.map((seg, i) => (
          <group
            key={i}
            ref={(el) => {
              groups.current[i] = el;
            }}
          >
            <mesh
              ref={(el) => {
                meshes.current[i] = el;
              }}
              geometry={unitBox}
              material={white}
            >
              <lineSegments geometry={unitEdges} material={edgeMat} />
            </mesh>
          </group>
        ))}

        <mesh ref={tag} geometry={tagGeometry} material={orange} visible={false} />

        {/* base plate the model stands on, and a thin roof slab above */}
        <mesh ref={plate} material={plateMat} position={[0, PLATE_Y - 0.125, -1.1]}>
          <boxGeometry args={[11, 0.25, 4.6]} />
        </mesh>
        <mesh ref={roof} material={roofMat} position={[0, 3.75, -0.5]}>
          <boxGeometry args={[9.6, 0.14, 2.2]} />
        </mesh>
        <group ref={shadows} visible={false}>
          <ContactShadows
            position={[0, PLATE_Y + 0.02, -1.1]}
            scale={14}
            blur={2.6}
            far={5}
            opacity={0.35}
            color="#3a5068"
          />
        </group>
      </group>
    </>
  );
}

export interface HeroCanvasProps {
  /** 0..1 scroll progress, written by GSAP ScrollTrigger. */
  progress: MutableRefObject<number>;
  /** Rendering pauses when the scene is off screen. */
  active: boolean;
  onReady?: () => void;
}

export default function HeroCanvas({ progress, active, onReady }: HeroCanvasProps) {
  return (
    <Canvas
      camera={{ fov: 28, near: 0.1, far: 100, position: [0, 0, 20] }}
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={() => onReady?.()}
      aria-hidden="true"
    >
      <Scene progress={progress} active={active} />
    </Canvas>
  );
}
