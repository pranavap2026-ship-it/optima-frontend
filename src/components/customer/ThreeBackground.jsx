import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function WavePlane() {
  const meshRef = useRef();

  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.x = -0.6;

      // 🔥 Smooth wave motion
      meshRef.current.position.z = Math.sin(t) * 0.2;

      // 🔥 Mouse interaction
      meshRef.current.rotation.y = mouse.x * 0.3;
      meshRef.current.rotation.x = -0.6 + mouse.y * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[10, 10, 64, 64]} />
      <meshStandardMaterial
        color="#C9A84C"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

export default function ThreeBackground() {
  return (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
      camera={{ position: [0, 0, 3] }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 2]} />

      <WavePlane />
    </Canvas>
  );
}