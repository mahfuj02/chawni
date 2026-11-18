"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import type { PhaseKey } from "@/content/types";
import { BRAND } from "./mark-lines";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** What is visible in each phase. Values are damped towards these, giving ~0.8s eased transitions. */
interface Targets {
  plan: number; // orange site plan lines
  grow: number; // massing volumes rise out of the plan
  wall: number; // opaque walls
  frame: number; // structural frame
  glass: number; // glazing + warm interior glow
  trees: number;
}
const TARGETS: Record<PhaseKey, Targets> = {
  plan: { plan: 1, grow: 0, wall: 0, frame: 0, glass: 0, trees: 0 },
  design: { plan: 0.45, grow: 1, wall: 1, frame: 0, glass: 0, trees: 0 },
  engineer: { plan: 0.35, grow: 1, wall: 0, frame: 1, glass: 0, trees: 0 },
  build: { plan: 0, grow: 1, wall: 1, frame: 0, glass: 1, trees: 1 },
};
/** Critically-damped easing; lambda 5.5 settles ~96% in 0.6s, ~99% in 0.8s. */
const LAMBDA = 5.5;

// --- model dimensions (world units, y up) -------------------------------------------------
const SLAB = 0.15;
const GF = { x: -0.6, z: 0.3, w: 5, d: 3.4, y0: 0.2, h: 1.5 };
const UF = { x: 0.8, z: 0.1, w: 5, d: 3, y0: GF.y0 + GF.h + SLAB, h: 1.4 };
const ROOF = { x: UF.x, z: UF.z, w: UF.w + 0.5, d: UF.d + 0.5, y0: UF.y0 + UF.h };
const SITE = { w: 10, d: 8 };

/** Bounding box of the whole building, used to place camera hotspots. */
export const BUILDING_BOX = new THREE.Box3(
  new THREE.Vector3(GF.x - GF.w / 2, 0, UF.z - UF.d / 2),
  new THREE.Vector3(UF.x + UF.w / 2, ROOF.y0 + SLAB, GF.z + GF.d / 2),
);

interface Shared {
  state: MutableRefObject<Targets>;
  unitBox: THREE.BoxGeometry;
  unitEdges: THREE.EdgesGeometry;
  mats: {
    wall: THREE.MeshStandardMaterial;
    slab: THREE.MeshStandardMaterial;
    frame: THREE.MeshStandardMaterial;
    glass: THREE.MeshStandardMaterial;
    plate: THREE.MeshStandardMaterial;
    tree: THREE.MeshStandardMaterial;
    plan: THREE.MeshBasicMaterial;
    wallEdge: THREE.LineBasicMaterial;
    frameEdge: THREE.LineBasicMaterial;
    slabEdge: THREE.LineBasicMaterial;
  };
}

function Block({
  shared,
  x,
  z,
  w,
  d,
  y0,
  h,
  material,
  edge,
  kind,
}: {
  shared: Shared;
  x: number;
  z: number;
  w: number;
  d: number;
  y0: number;
  h: number;
  material: THREE.Material;
  edge: THREE.Material;
  /** "wall" blocks rise with `grow`; "slab" blocks are always their full height once grown. */
  kind: "wall" | "slab";
}) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const s = shared.state.current;
    const k = kind === "wall" ? s.grow : clamp01(s.grow * 1.5);
    const height = Math.max(h * k, 0.0001);
    m.scale.set(w, height, d);
    m.position.set(x, y0 + height / 2, z);
    m.visible = k > 0.01;
  });
  return (
    <mesh ref={mesh} geometry={shared.unitBox} material={material}>
      <lineSegments geometry={shared.unitEdges} material={edge} />
    </mesh>
  );
}

function FramePost({
  shared,
  x,
  z,
  y0,
  h,
}: {
  shared: Shared;
  x: number;
  z: number;
  y0: number;
  h: number;
}) {
  return (
    <mesh
      geometry={shared.unitBox}
      material={shared.mats.frame}
      position={[x, y0 + h / 2, z]}
      scale={[0.14, h, 0.14]}
    >
      <lineSegments geometry={shared.unitEdges} material={shared.mats.frameEdge} />
    </mesh>
  );
}

type Floor = typeof GF;

function Frame({ shared, floor }: { shared: Shared; floor: Floor }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.visible = shared.state.current.frame > 0.01;
  });

  const xs = [floor.x - floor.w / 2 + 0.07, floor.x, floor.x + floor.w / 2 - 0.07];
  const zs = [floor.z - floor.d / 2 + 0.07, floor.z + floor.d / 2 - 0.07];

  return (
    <group ref={group}>
      {xs.flatMap((x) =>
        zs.map((z) => (
          <FramePost key={`${x}-${z}`} shared={shared} x={x} z={z} y0={floor.y0} h={floor.h} />
        )),
      )}
    </group>
  );
}

function Glass({ shared, floor: f }: { shared: Shared; floor: Floor }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.visible = shared.state.current.glass > 0.01;
  });
  return (
    <group ref={group}>
      {/* front glazing */}
      <mesh
        geometry={shared.unitBox}
        material={shared.mats.glass}
        position={[f.x, f.y0 + f.h / 2, f.z + f.d / 2 + 0.02]}
        scale={[f.w * 0.78, f.h * 0.72, 0.03]}
      />
      {/* side glazing */}
      <mesh
        geometry={shared.unitBox}
        material={shared.mats.glass}
        position={[f.x + f.w / 2 + 0.02, f.y0 + f.h / 2, f.z]}
        scale={[0.03, f.h * 0.72, f.d * 0.6]}
      />
    </group>
  );
}

const TREE_SPOTS: [number, number][] = [
  [-4.1, 2.9],
  [4.0, 3.0],
  [4.3, -2.4],
  [-3.9, -2.8],
];

function Trees({ shared }: { shared: Shared }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const t = shared.state.current.trees;
    g.scale.setScalar(Math.max(t, 0.0001));
    g.visible = t > 0.01;
  });
  return (
    <group ref={group}>
      {TREE_SPOTS.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.3, 0]} material={shared.mats.tree}>
            <cylinderGeometry args={[0.05, 0.07, 0.6, 8]} />
          </mesh>
          <mesh position={[0, 0.95, 0]} material={shared.mats.tree}>
            <icosahedronGeometry args={[0.5, 1]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Site plan drawn as orange lines on the ground plate. Lines "draw in" one after another. */
const PLAN_LINES: [number, number, number, number][] = (() => {
  const rect = (
    cx: number,
    cz: number,
    w: number,
    d: number,
  ): [number, number, number, number][] => [
    [cx - w / 2, cz - d / 2, cx + w / 2, cz - d / 2],
    [cx + w / 2, cz - d / 2, cx + w / 2, cz + d / 2],
    [cx + w / 2, cz + d / 2, cx - w / 2, cz + d / 2],
    [cx - w / 2, cz + d / 2, cx - w / 2, cz - d / 2],
  ];
  return [
    ...rect(0, 0, SITE.w - 0.6, SITE.d - 0.6),
    ...rect(GF.x, GF.z, GF.w, GF.d),
    ...rect(UF.x, UF.z, UF.w, UF.d),
    [GF.x - 0.5, GF.z - GF.d / 2, GF.x - 0.5, GF.z + GF.d / 2],
    [GF.x - GF.w / 2, GF.z, GF.x + GF.w / 2, GF.z],
    [-4.7, 3.7, -2.2, 3.7],
  ];
})();

function PlanLine({
  shared,
  line,
  index,
}: {
  shared: Shared;
  line: [number, number, number, number];
  index: number;
}) {
  const [x1, z1, x2, z2] = line;
  const length = Math.hypot(x2 - x1, z2 - z1);
  const angle = Math.atan2(z2 - z1, x2 - x1);
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const k = clamp01(shared.state.current.plan * 2.2 - index * 0.07);
    m.scale.set(Math.max(length * k, 0.0001), 1, 1);
    m.position.x = (length * k) / 2;
    m.visible = k > 0.001;
  });
  return (
    <group position={[x1, 0.012, z1]} rotation={[0, -angle, 0]}>
      <mesh ref={mesh} material={shared.mats.plan} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 0.07]} />
      </mesh>
    </group>
  );
}

function GridLines({ shared }: { shared: Shared }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.visible = shared.state.current.frame > 0.05;
  });
  const xs = [GF.x - GF.w / 2, GF.x, GF.x + GF.w / 2, UF.x + UF.w / 2];
  const zs = [GF.z - GF.d / 2, GF.z + GF.d / 2];
  return (
    <group ref={group} position={[0, 0.02, 0]}>
      {xs.map((x) => (
        <Line
          key={`x${x}`}
          points={[
            [x, 0, -SITE.d / 2 + 0.2],
            [x, 0, SITE.d / 2 - 0.2],
          ]}
          color={BRAND.orange}
          lineWidth={1.2}
          dashed
          dashSize={0.25}
          gapSize={0.18}
        />
      ))}
      {zs.map((z) => (
        <Line
          key={`z${z}`}
          points={[
            [-SITE.w / 2 + 0.2, 0, z],
            [SITE.w / 2 - 0.2, 0, z],
          ]}
          color={BRAND.orange}
          lineWidth={1.2}
          dashed
          dashSize={0.25}
          gapSize={0.18}
        />
      ))}
    </group>
  );
}

export interface BuildingModelProps {
  phase: PhaseKey;
  /** 0 = assembled, 1 = floors pulled apart vertically. Eased. */
  explode?: number;
  /** Slow idle sway of the whole model. */
  sway?: boolean;
}

/**
 * Procedural two-storey building: plinth, columns, slabs, walls, glass and a cantilevered
 * upper floor. White/grey materials with orange edges only. No textures.
 */
export function BuildingModel({ phase, explode = 0, sway = false }: BuildingModelProps) {
  const unitBox = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const unitEdges = useMemo(() => new THREE.EdgesGeometry(unitBox), [unitBox]);

  const mats = useMemo<Shared["mats"]>(
    () => ({
      wall: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.85,
        transparent: true,
      }),
      slab: new THREE.MeshStandardMaterial({ color: "#f1f3f5", roughness: 0.9, transparent: true }),
      frame: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.7,
        transparent: true,
      }),
      glass: new THREE.MeshStandardMaterial({
        color: "#cfe3f5",
        roughness: 0.08,
        metalness: 0.25,
        transparent: true,
        emissive: new THREE.Color("#ffb36b"),
        emissiveIntensity: 0,
        depthWrite: false,
      }),
      plate: new THREE.MeshStandardMaterial({ color: "#f5f7f9", roughness: 0.95 }),
      tree: new THREE.MeshStandardMaterial({ color: "#dfe4e9", roughness: 0.9 }),
      plan: new THREE.MeshBasicMaterial({ color: BRAND.orange, transparent: true }),
      wallEdge: new THREE.LineBasicMaterial({ color: BRAND.orange, transparent: true }),
      frameEdge: new THREE.LineBasicMaterial({ color: BRAND.orange, transparent: true }),
      slabEdge: new THREE.LineBasicMaterial({ color: BRAND.orange, transparent: true }),
    }),
    [],
  );

  const state = useRef<Targets>({ ...TARGETS[phase] });
  const shared = useMemo<Shared>(
    () => ({ state, unitBox, unitEdges, mats }),
    [unitBox, unitEdges, mats],
  );

  useEffect(
    () => () => {
      unitBox.dispose();
      unitEdges.dispose();
      Object.values(mats).forEach((m) => m.dispose());
    },
    [unitBox, unitEdges, mats],
  );

  const root = useRef<THREE.Group>(null);
  const gfGroup = useRef<THREE.Group>(null);
  const ufGroup = useRef<THREE.Group>(null);
  const roofGroup = useRef<THREE.Group>(null);
  const explodeNow = useRef(0);

  useFrame((frame, delta) => {
    const s = state.current;
    const t = TARGETS[phase];
    (Object.keys(t) as (keyof Targets)[]).forEach((k) => {
      s[k] = THREE.MathUtils.damp(s[k], t[k], LAMBDA, delta);
    });

    mats.wall.opacity = s.wall;
    mats.wall.depthWrite = s.wall > 0.98;
    mats.slab.opacity = clamp01(s.grow * 1.5);
    mats.frame.opacity = s.frame;
    mats.glass.opacity = 0.42 * s.glass;
    mats.glass.emissiveIntensity = 0.75 * s.glass;
    mats.plan.opacity = clamp01(s.plan);
    mats.wallEdge.opacity = s.wall * s.grow * 0.85;
    mats.frameEdge.opacity = s.frame * 0.9;
    mats.slabEdge.opacity = clamp01(s.grow * 1.5) * 0.9;

    explodeNow.current = THREE.MathUtils.damp(explodeNow.current, explode, 4, delta);
    const e = explodeNow.current;
    if (gfGroup.current) gfGroup.current.position.y = 0;
    if (ufGroup.current) ufGroup.current.position.y = e * 1.6;
    if (roofGroup.current) roofGroup.current.position.y = e * 3.2;

    if (sway && root.current) {
      root.current.rotation.y = Math.sin(frame.clock.elapsedTime * 0.35) * 0.12;
    }
  });

  return (
    <group ref={root}>
      {/* ground plate */}
      <mesh material={mats.plate} position={[0, -0.1, 0]}>
        <boxGeometry args={[SITE.w, 0.2, SITE.d]} />
      </mesh>

      {PLAN_LINES.map((line, i) => (
        <PlanLine key={i} shared={shared} line={line} index={i} />
      ))}
      <GridLines shared={shared} />

      <group ref={gfGroup}>
        {/* plinth */}
        <Block
          shared={shared}
          kind="slab"
          x={GF.x}
          z={GF.z}
          w={GF.w + 0.4}
          d={GF.d + 0.4}
          y0={0}
          h={GF.y0}
          material={mats.slab}
          edge={mats.slabEdge}
        />
        <Block
          shared={shared}
          kind="wall"
          x={GF.x}
          z={GF.z}
          w={GF.w}
          d={GF.d}
          y0={GF.y0}
          h={GF.h}
          material={mats.wall}
          edge={mats.wallEdge}
        />
        <Block
          shared={shared}
          kind="slab"
          x={GF.x}
          z={GF.z}
          w={GF.w + 0.2}
          d={GF.d + 0.2}
          y0={GF.y0 + GF.h}
          h={SLAB}
          material={mats.slab}
          edge={mats.slabEdge}
        />
        <Frame shared={shared} floor={GF} />
        <Glass shared={shared} floor={GF} />
      </group>

      <group ref={ufGroup}>
        <Block
          shared={shared}
          kind="wall"
          x={UF.x}
          z={UF.z}
          w={UF.w}
          d={UF.d}
          y0={UF.y0}
          h={UF.h}
          material={mats.wall}
          edge={mats.wallEdge}
        />
        <Frame shared={shared} floor={UF} />
        <Glass shared={shared} floor={UF} />
      </group>

      <group ref={roofGroup}>
        <Block
          shared={shared}
          kind="slab"
          x={ROOF.x}
          z={ROOF.z}
          w={ROOF.w}
          d={ROOF.d}
          y0={ROOF.y0}
          h={SLAB}
          material={mats.slab}
          edge={mats.slabEdge}
        />
      </group>

      <Trees shared={shared} />
    </group>
  );
}
