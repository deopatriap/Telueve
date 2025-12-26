"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import * as THREE from "three";
import { useAnimation } from "@/components/AnimationProvider";

function MovingGrid() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Move texture to simulate forward movement
    // @ts-ignore
    if (meshRef.current.material.map) {
      // @ts-ignore
      meshRef.current.material.map.offset.y -= delta * 0.2;
    }
  });

  // Create grid texture programmatically
  const texture = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "rgba(87, 84, 74, 0.5)"; // Nier darkish grey
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, 128, 128);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(20, 20);
    return tex;
  }, []);

  return (
    <Plane ref={meshRef} args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, -10]}>
      <meshBasicMaterial map={texture} transparent opacity={0.4} />
    </Plane>
  );
}

export default function GridFloor() {
  const { isReducedMotion, isLowPerformance } = useAnimation();

  if (isReducedMotion || isLowPerformance) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 h-[400px] pointer-events-none z-0 opacity-20">
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <fog attach="fog" args={["#f7f5e6", 5, 30]} />
        <MovingGrid />
      </Canvas>
    </div>
  );
}
