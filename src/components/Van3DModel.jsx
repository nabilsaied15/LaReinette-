import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Van3DModel(props) {
  const groupRef = useRef();
  const wheelsRef = useRef([]);

  useFrame((state, delta) => {
    // Rotation continue des roues (marche avant)
    wheelsRef.current.forEach(wheel => {
      if (wheel) wheel.rotation.z -= delta * 15;
    });
    
    if (groupRef.current) {
      // Léger rebond de la voiture
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 15) * 0.05 - 0.5;
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null} position={[0, -0.5, 0]}>
      {/* Châssis Principal du Van */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 1.2, 1.8]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          metalness={0.2} 
          roughness={0.1} 
          clearcoat={1.0} 
          clearcoatRoughness={0.1} 
        />
      </mesh>

      {/* Cabine Avant (Pare-brise) & Coffre */}
      <mesh position={[1.4, 1.5, 0]} rotation={[0, 0, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1, 1.7]} />
        <meshPhysicalMaterial color="#f0f0f0" metalness={0.3} roughness={0.1} clearcoat={1.0} />
      </mesh>
      
      {/* Toit arrière */}
      <mesh position={[-0.5, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.8, 1.75]} />
        <meshPhysicalMaterial color="#ffffff" metalness={0.2} roughness={0.1} clearcoat={1.0} />
      </mesh>

      {/* Fenêtres (Verre/Miroirs sombres) */}
      {/* Front Window */}
      <mesh position={[2, 1.6, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.05, 0.8, 1.6]} />
        <meshPhysicalMaterial color="#111111" metalness={0.9} roughness={0.1} transmission={0.2} />
      </mesh>

      {/* Side Windows */}
      <mesh position={[0.5, 1.6, 0.9]}>
        <boxGeometry args={[1, 0.6, 0.05]} />
        <meshPhysicalMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.5, 1.6, -0.9]}>
        <boxGeometry args={[1, 0.6, 0.05]} />
        <meshPhysicalMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Phare avant */}
      <mesh position={[2.02, 0.7, 0.6]}>
        <boxGeometry args={[0.1, 0.3, 0.3]} />
        <meshStandardMaterial color="#ffebaa" emissive="#ffdd44" emissiveIntensity={2} />
      </mesh>
      <mesh position={[2.02, 0.7, -0.6]}>
        <boxGeometry args={[0.1, 0.3, 0.3]} />
        <meshStandardMaterial color="#ffebaa" emissive="#ffdd44" emissiveIntensity={2} />
      </mesh>

      {/* Feu Arrière */}
      <mesh position={[-2.02, 0.8, 0.7]}>
        <boxGeometry args={[0.1, 0.4, 0.2]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-2.02, 0.8, -0.7]}>
        <boxGeometry args={[0.1, 0.4, 0.2]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>

      {/* Logo vert La Reinette (Simulation d'un petit sticker sur le côté) */}
      <mesh position={[0, 0.8, 0.91]}>
        <boxGeometry args={[1.5, 0.4, 0.02]} />
        <meshStandardMaterial color="#125B46" />
      </mesh>

      {/* Roues */}
      {[
        [1.2, 0.2, 1],    // Avant Gauche
        [1.2, 0.2, -1],   // Avant Droite
        [-1.2, 0.2, 1],   // Arrière Gauche
        [-1.2, 0.2, -1]   // Arrière Droite
      ].map((pos, index) => (
        <group key={index} position={pos} ref={el => wheelsRef.current[index] = el}>
          {/* Pneu */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <meshStandardMaterial color="#222222" roughness={0.8} />
          </mesh>
          {/* Jante argentée */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, pos[2] > 0 ? 0.16 : -0.16]}>
            <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
            <meshPhysicalMaterial color="#dddddd" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
