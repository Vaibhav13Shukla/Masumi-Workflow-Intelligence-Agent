import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

// Note: Manual JSX augmentation removed to prevent conflict with standard HTML elements.
// The types for three.js elements (mesh, group, etc.) should be handled by @react-three/fiber types.

interface NetworkNodeProps {
  position: [number, number, number];
  color: string;
}

const NetworkNode: React.FC<NetworkNodeProps> = ({ position, color }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  );
};

interface NetworkConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

const NetworkConnection: React.FC<NetworkConnectionProps> = ({ start, end, color }) => {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  return (
    <Line points={points} color={color} opacity={0.3} transparent lineWidth={1} />
  );
};

const NetworkScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate random nodes
  const nodes = useMemo(() => {
    return Array.from({ length: 25 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5
      ] as [number, number, number],
      id: Math.random()
    }));
  }, []);

  // Connect close nodes
  const connections = useMemo(() => {
    const conns: { start: [number, number, number], end: [number, number, number], key: string }[] = [];
    nodes.forEach((node, i) => {
      nodes.forEach((other, j) => {
        if (i !== j) {
          const dist = new THREE.Vector3(...node.position).distanceTo(new THREE.Vector3(...other.position));
          if (dist < 3.5) {
            conns.push({
              start: node.position,
              end: other.position,
              key: `${i}-${j}`
            });
          }
        }
      });
    });
    return conns;
  }, [nodes]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <NetworkNode key={i} position={node.position} color={i % 3 === 0 ? "#00D1FF" : "#667eea"} />
      ))}
      {connections.map((conn) => (
        <NetworkConnection key={conn.key} start={conn.start} end={conn.end} color="#4455aa" />
      ))}
    </group>
  );
};

const Hero3D = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-40">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <NetworkScene />
      </Canvas>
    </div>
  );
};

export default Hero3D;