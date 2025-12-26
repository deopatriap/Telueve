"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAnimation } from "@/components/AnimationProvider";

function Particles({ count = 1000, mouse }: { count?: number; mouse: React.MutableRefObject<[number, number]> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;

      // Update time
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      // Mouse interaction
      particle.mx += (mouse.current[0] - particle.mx) * 0.02;
      particle.my += (mouse.current[1] * -1 - particle.my) * 0.02;

      // Update position
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );

      // Update scale
      const scale = (s > 0 ? 1 : 0.5) * (i % 10 === 0 ? 2 : 1);
      dummy.scale.set(scale, scale, scale);

      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshBasicMaterial color="#3e3b39" transparent opacity={0.6} />
      </instancedMesh>
    </>
  );
}

export default function ParticleField() {
  const mouse = useRef<[number, number]>([0, 0]);
  const { isReducedMotion, isLowPerformance } = useAnimation();

  // If reduced motion is on, render simple static fallback (or nothing to save perf)
  if (isReducedMotion || isLowPerformance) {
    return (
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />
    );
  }

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      onMouseMove={(e) => {
        mouse.current = [
          e.clientX - window.innerWidth / 2,
          e.clientY - window.innerHeight / 2
        ]
      }}
    >
      <Canvas camera={{ position: [0, 0, 70], fov: 75 }}>
        <Particles mouse={mouse} />
      </Canvas>
    </div>
  );
}
