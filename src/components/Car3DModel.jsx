import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Car3DModel(props) {
  const groupRef = useRef();
  const wheelsRef = useRef([]);

  useFrame((state, delta) => {
    // Optionally rotate wheels slowly
    wheelsRef.current.forEach(wheel => {
      if (wheel) wheel.rotation.z -= delta * 5;
    });
    
    if (groupRef.current) {
      // Very slight idle bounce
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.02 - 0.5;
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null} position={[0, -0.5, 0]}>
      {/* Lower Base Chassis */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 0.6, 1.8]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          metalness={0.4} 
          roughness={0.2} 
          clearcoat={1.0} 
        />
      </mesh>

      {/* Main Cabin / Roof */}
      <mesh position={[-0.2, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.7, 1.6]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          metalness={0.2} 
          roughness={0.1} 
          clearcoat={1.0} 
        />
      </mesh>

      {/* Windshield (Front Window sloping) */}
      <mesh position={[1.05, 0.9, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.05, 0.8, 1.5]} />
        <meshPhysicalMaterial color="#111111" metalness={0.9} roughness={0.1} transmission={0.2} />
      </mesh>

      {/* Rear Window (sloping) */}
      <mesh position={[-1.4, 0.9, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.05, 0.8, 1.5]} />
        <meshPhysicalMaterial color="#111111" metalness={0.9} roughness={0.1} transmission={0.2} />
      </mesh>

      {/* Side Windows */}
      <mesh position={[-0.2, 0.9, 0.81]}>
        <boxGeometry args={[2.0, 0.5, 0.05]} />
        <meshPhysicalMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.2, 0.9, -0.81]}>
        <boxGeometry args={[2.0, 0.5, 0.05]} />
        <meshPhysicalMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Headlights */}
      <mesh position={[2.26, 0.5, 0.6]}>
        <boxGeometry args={[0.1, 0.2, 0.4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffdd44" emissiveIntensity={2} />
      </mesh>
      <mesh position={[2.26, 0.5, -0.6]}>
        <boxGeometry args={[0.1, 0.2, 0.4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffdd44" emissiveIntensity={2} />
      </mesh>

      {/* Tail lights */}
      <mesh position={[-2.26, 0.6, 0.7]}>
        <boxGeometry args={[0.1, 0.2, 0.3]} />
        <meshStandardMaterial color="#ff0000" emissive="#dd0000" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-2.26, 0.6, -0.7]}>
        <boxGeometry args={[0.1, 0.2, 0.3]} />
        <meshStandardMaterial color="#ff0000" emissive="#dd0000" emissiveIntensity={1} />
      </mesh>

      {/* Wheels */}
      {[
        [1.4, 0.2, 1],    // Front Left
        [1.4, 0.2, -1],   // Front Right
        [-1.4, 0.2, 1],   // Rear Left
        [-1.4, 0.2, -1]   // Rear Right
      ].map((pos, index) => (
        <group key={index} position={pos} ref={el => wheelsRef.current[index] = el}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
            <meshStandardMaterial color="#222222" roughness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, pos[2] > 0 ? 0.16 : -0.16]}>
            <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
            <meshPhysicalMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
