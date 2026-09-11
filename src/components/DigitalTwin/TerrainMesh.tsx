import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';
import { useDigitalTwin } from './DigitalTwinContext';

const noise2D = createNoise2D();

export function TerrainMesh() {
  const { state, updateState } = useDigitalTwin();
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Terrain configuration
  const width = 100;
  const depth = 100;
  const segments = state.graphicsQuality === 'HIGH' ? 128 : (state.graphicsQuality === 'LOW' ? 64 : 96);
  
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, depth, segments, segments);
    geo.rotateX(-Math.PI / 2); // Rotate to be flat on XZ plane
    
    const posAttribute = geo.attributes.position;
    const colors = [];
    const color = new THREE.Color();
    
    // Base colors
    const lowColor = new THREE.Color(0x3B5A27); // Forest green
    const midColor = new THREE.Color(0x737C45); // Grassy/earthy
    const highColor = new THREE.Color(0x8B7D6B); // Rocky
    const peakColor = new THREE.Color(0xEEEEEE); // Snow
    const riskColor = new THREE.Color(0xff4444); // Critical risk
    
    const vertex = new THREE.Vector3();
    
    for (let i = 0; i < posAttribute.count; i++) {
      vertex.fromBufferAttribute(posAttribute, i);
      
      // Calculate height using fractal noise
      const x = vertex.x;
      const z = vertex.z;
      
      let elevation = 0;
      let amplitude = 15;
      let frequency = 0.02;
      
      // 3 octaves of noise for mountainous terrain
      for (let o = 0; o < 3; o++) {
        elevation += noise2D(x * frequency, z * frequency) * amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }
      
      // Add a central valley/river bed
      const valleyInfluence = Math.abs(x) < 20 ? (1 - Math.abs(x) / 20) : 0;
      elevation -= valleyInfluence * 8;
      
      // Ensure it doesn't go below 0 for water level
      elevation = Math.max(0, elevation + 5); 
      
      vertex.y = elevation;
      posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      
      // Compute color based on elevation
      let h = vertex.y;
      if (h < 5) {
        color.copy(lowColor);
      } else if (h < 15) {
        color.copy(lowColor).lerp(midColor, (h - 5) / 10);
      } else if (h < 25) {
        color.copy(midColor).lerp(highColor, (h - 15) / 10);
      } else {
        color.copy(highColor).lerp(peakColor, Math.min(1, (h - 25) / 10));
      }
      
      colors.push(color.r, color.g, color.b);
    }
    
    geo.computeVertexNormals();
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return geo;
  }, [segments]);
  
  useEffect(() => {
    if (!geometry) return;
    
    const posAttribute = geometry.attributes.position;
    const colorAttribute = geometry.attributes.color;
    const normalAttribute = geometry.attributes.normal;
    const color = new THREE.Color();
    const riskColor = new THREE.Color(0xff2200); // Bright warning red
    const criticalColor = new THREE.Color(0xff0000); // Critical red
    
    const lowColor = new THREE.Color(0x3B5A27);
    const midColor = new THREE.Color(0x737C45);
    const highColor = new THREE.Color(0x8B7D6B);
    const peakColor = new THREE.Color(0xEEEEEE);
    
    const vertex = new THREE.Vector3();
    const normal = new THREE.Vector3();
    
    // Simulate risk increase based on rainfall and soil moisture
    const globalRiskFactor = (state.rainfallMultiplier - 1) * 0.5 + (state.soilMoistureMultiplier - 1) * 0.5;
    const progressFactor = state.activeScenario !== 'NONE' ? state.simulationProgress / 100 : 0;
    const activeRisk = globalRiskFactor + progressFactor;

    for (let i = 0; i < posAttribute.count; i++) {
      vertex.fromBufferAttribute(posAttribute, i);
      normal.fromBufferAttribute(normalAttribute, i);
      
      let h = vertex.y;
      
      // Compute base color
      if (h < 5) {
        color.copy(lowColor);
      } else if (h < 15) {
        color.copy(lowColor).lerp(midColor, (h - 5) / 10);
      } else if (h < 25) {
        color.copy(midColor).lerp(highColor, (h - 15) / 10);
      } else {
        color.copy(highColor).lerp(peakColor, Math.min(1, (h - 25) / 10));
      }
      
      // Calculate local slope (1 - normal.y gives a value where 0 is flat, 1 is vertical)
      const slope = 1.0 - normal.y;
      
      // High slope + high water = landslide risk
      // Add a spatial noise pattern to make risk areas look organic, not uniform
      const localVulnerability = (noise2D(vertex.x * 0.1, vertex.z * 0.1) * 0.5 + 0.5);
      
      // Calculate risk for this vertex
      let vertexRisk = 0;
      
      // Base risk on steep slopes
      if (slope > 0.2) {
        vertexRisk += (slope - 0.2) * 2;
      }
      
      // Add dynamic risk
      if (activeRisk > 0 && slope > 0.15) {
        // Lower elevation (valley sides) are often more vulnerable to saturated soil landslides
        const elevationFactor = Math.max(0, 1 - (h / 30));
        vertexRisk += activeRisk * localVulnerability * elevationFactor * 2;
      }
      
      if (state.selectedZone && state.selectedZone === 'zone-1') {
         // Highlight specific zone roughly
         const dist = Math.sqrt(Math.pow(vertex.x - 10, 2) + Math.pow(vertex.z - 10, 2));
         if (dist < 15) vertexRisk += 0.8;
      }
      
      // Apply risk color
      if (vertexRisk > 0.4) {
        const intensity = Math.min(1, (vertexRisk - 0.4) * 1.5);
        if (vertexRisk > 0.8) {
           color.lerp(criticalColor, intensity * 0.8);
        } else {
           color.lerp(riskColor, intensity * 0.6);
        }
      }
      
      colorAttribute.setXYZ(i, color.r, color.g, color.b);
    }
    
    colorAttribute.needsUpdate = true;
  }, [geometry, state.activeScenario, state.simulationProgress, state.rainfallMultiplier, state.soilMoistureMultiplier, state.selectedZone]);

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial 
        vertexColors 
        roughness={0.8}
        metalness={0.1}
        flatShading={false}
      />
    </mesh>
  );
}
