import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, Cloud, Stars } from '@react-three/drei';
import { TerrainMesh } from './TerrainMesh';
import { Infrastructure } from './Infrastructure';
import { useDigitalTwin } from './DigitalTwinContext';
import * as THREE from 'three';

function RainParticles({ isExtreme }: { isExtreme: boolean }) {
  const count = isExtreme ? 15000 : 5000;
  const meshRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 100; // x
      p[i * 3 + 1] = Math.random() * 50; // y
      p[i * 3 + 2] = (Math.random() - 0.5) * 100; // z
    }
    return p;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= (isExtreme ? 1.5 : 0.8); // fall speed
      // Add slight wind
      positions[i * 3] -= 0.1;
      
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 50;
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef} key={count}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#aaaacc" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Atmosphere() {
  const { state } = useDigitalTwin();
  
  const isCloudy = state.weatherMode !== 'CLEAR';
  const isRaining = state.weatherMode === 'HEAVY RAIN' || state.weatherMode === 'EXTREME RAIN';
  
  return (
    <>
      <Sky distance={450000} sunPosition={isCloudy ? [0, 1, 0] : [1, 1, 0]} inclination={isCloudy ? 0 : 0.2} azimuth={0.25} />
      <ambientLight intensity={isCloudy ? 0.3 : 0.6} />
      <directionalLight 
        castShadow 
        position={isCloudy ? [0, 50, 0] : [50, 50, 20]} 
        intensity={isCloudy ? 0.5 : 1.5} 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048} 
      />
      {isCloudy && (
         <fog attach="fog" args={['#8899aa', 10, 100]} />
      )}
      {!isCloudy && (
         <fog attach="fog" args={['#e0e0e0', 30, 150]} />
      )}
      
      {/* Basic Cloud visualization if high quality */}
      {isCloudy && state.graphicsQuality !== 'LOW' && (
        <group position={[0, 30, 0]}>
          <Cloud opacity={0.5} speed={0.4} segments={20} bounds={[10, 1.5, 10]} position={[10, 0, 10]} />
          <Cloud opacity={0.5} speed={0.4} segments={20} bounds={[10, 1.5, 10]} position={[-10, 2, -15]} />
        </group>
      )}

      {isRaining && (
         <RainParticles isExtreme={state.weatherMode === 'EXTREME RAIN'} />
      )}
    </>
  );
}

export function DigitalTwinViewer() {
  const { state } = useDigitalTwin();

  return (
    <div className="w-full h-full relative bg-slate-950 rounded-xl overflow-hidden border border-slate-700">
      <Canvas shadows camera={{ position: [0, 40, 50], fov: 45 }}>
        <Suspense fallback={null}>
          <Atmosphere />
          <TerrainMesh />
          <Infrastructure />
          {/* We would render Infrastructure and Sensors here */}
          <OrbitControls 
            makeDefault 
            maxPolarAngle={Math.PI / 2 - 0.05} // don't go below ground
            minDistance={5}
            maxDistance={120}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
      
      {/* Simulation Watermark */}
      {state.isSimulationMode && (
        <div className="absolute top-4 right-4 bg-red-500/20 border border-red-500 text-red-500 px-3 py-1 rounded-md text-xs font-bold tracking-wider backdrop-blur-sm z-10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          DATA MODE: DEMO
        </div>
      )}
    </div>
  );
}
