"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAnimation } from "@/components/AnimationProvider";

function Sphere() {
  const messRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!messRef.current) return;
    // Slow rotation
    messRef.current.rotation.x += delta * 0.2;
    messRef.current.rotation.y += delta * 0.3;
  });

  return (
    <mesh ref={messRef} scale={[2, 2, 2]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color="#a19d90" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

export default function WireframeSphere({ className = "" }: { className?: string }) {
  const { isReducedMotion, isLowPerformance } = useAnimation();

  if (isReducedMotion || isLowPerformance) return <div className={`w-32 h-32 rounded-full border border-nier-dark/20 ${className}`} />;

  return (
    <div className={`w-full h-full min-h-[200px] ${className}`}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Sphere />
      </Canvas>
    </div>
  );
}
