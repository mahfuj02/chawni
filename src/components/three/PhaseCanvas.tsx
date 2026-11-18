"use client";

import { Canvas } from "@react-three/fiber";
import type { PhaseKey } from "@/content/types";
import { BuildingModel } from "./BuildingModel";

export interface PhaseCanvasProps {
  phase: PhaseKey;
  active: boolean;
  onReady?: () => void;
}

/** "What we do" scene: one procedural building whose state follows the active phase. */
export default function PhaseCanvas({ phase, active, onReady }: PhaseCanvasProps) {
  return (
    <Canvas
      camera={{ fov: 30, near: 0.1, far: 100, position: [13.5, 10.5, 14] }}
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => {
        camera.lookAt(0.3, 1.3, 0);
        onReady?.();
      }}
      aria-hidden="true"
    >
      <hemisphereLight args={["#ffffff", "#8896a5", 0.9]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 10, 7]} intensity={2.4} />
      <directionalLight position={[-7, 5, -5]} intensity={0.5} />
      <BuildingModel phase={phase} sway />
    </Canvas>
  );
}
