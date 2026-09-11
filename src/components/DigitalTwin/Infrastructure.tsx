import React from 'react';
import { useDigitalTwin } from './DigitalTwinContext';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { MapPin, Activity, AlertTriangle, ShieldAlert } from 'lucide-react';

export function Infrastructure() {
  const { state, updateState } = useDigitalTwin();
  
  // Hardcoded locations relative to our 100x100 grid centered at 0,0
  const villages = [
    { id: 'v1', name: 'Nongthymmai', pos: [12, 0, 15] as [number, number, number], pop: 2400 },
    { id: 'v2', name: 'Mawlai', pos: [-15, 0, -5] as [number, number, number], pop: 8000 },
    { id: 'v3', name: 'Laitumkhrah', pos: [5, 0, -20] as [number, number, number], pop: 5500 },
  ];
  
  const sensors = [
    { id: 's1', type: 'SOIL', pos: [10, 0, 10] as [number, number, number] },
    { id: 's2', type: 'RAIN', pos: [-10, 0, 20] as [number, number, number] },
  ];
  
  const roads = [
    { id: 'r1', type: 'NH', points: [[-20, 5, -20], [-10, 8, -5], [0, 5, 5], [10, 4, 15], [20, 3, 20]] as [number, number, number][] },
    { id: 'r2', type: 'LOCAL', points: [[-15, 6, -5], [-25, 4, 10]] as [number, number, number][] },
  ];

  return (
    <group>
      {/* Roads */}
      {roads.map(r => (
        <Line 
          key={r.id}
          points={r.points}
          color={state.activeScenario !== 'NONE' && r.type === 'NH' ? '#f59e0b' : '#94a3b8'} // Warning color during scenario
          lineWidth={r.type === 'NH' ? 5 : 2}
          dashed={r.type !== 'NH'}
        />
      ))}
      
      {/* Villages */}
      {villages.map(v => {
        // Adjust Y height slightly above terrain
        return (
          <group key={v.id} position={new THREE.Vector3(...v.pos)}>
            <mesh position={[0, 5, 0]}>
               <boxGeometry args={[1, 1, 1]} />
               <meshStandardMaterial color="#64748b" />
            </mesh>
            <mesh position={[1, 5, -1]}>
               <boxGeometry args={[0.8, 1.2, 0.8]} />
               <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <Html position={[0, 7, 0]} center>
               <div 
                  className={`bg-slate-900/80 backdrop-blur-sm border ${state.activeScenario !== 'NONE' ? 'border-orange-500' : 'border-slate-700'} rounded p-1.5 whitespace-nowrap cursor-pointer hover:bg-slate-800 transition-colors pointer-events-auto`}
                  onClick={() => updateState({ selectedInfrastructure: v.id })}
               >
                 <div className="text-[10px] font-bold text-slate-200 flex items-center gap-1">
                    {state.activeScenario !== 'NONE' && <AlertTriangle className="w-3 h-3 text-orange-400" />}
                    {v.name}
                 </div>
                 {state.activeScenario !== 'NONE' && (
                    <div className="text-[9px] text-orange-400 mt-0.5">Iso. Risk: HIGH</div>
                 )}
               </div>
            </Html>
          </group>
        );
      })}
      
      {/* Sensors */}
      {sensors.map(s => {
        return (
          <group key={s.id} position={new THREE.Vector3(...s.pos)}>
            <mesh position={[0, 4.5, 0]}>
               <cylinderGeometry args={[0.2, 0.2, 2]} />
               <meshStandardMaterial color="#38bdf8" />
            </mesh>
            <mesh position={[0, 5.5, 0]}>
               <sphereGeometry args={[0.4]} />
               <meshStandardMaterial color="#0284c7" />
            </mesh>
            <Html position={[0, 6.5, 0]} center>
               <div className="bg-sky-950/80 border border-sky-800 rounded-full px-2 py-0.5 whitespace-nowrap">
                 <div className="text-[9px] font-bold text-sky-400 flex items-center gap-1">
                    <Activity className="w-2.5 h-2.5" />
                    {s.type} SENSOR
                 </div>
               </div>
            </Html>
          </group>
        );
      })}
      
      {/* Emergency Center */}
      <group position={[-5, 0, 5]}>
         <mesh position={[0, 5, 0]}>
            <boxGeometry args={[2, 1.5, 2]} />
            <meshStandardMaterial color="#b91c1c" />
         </mesh>
         <Html position={[0, 7, 0]} center>
            <div className="bg-rose-950/80 border border-rose-800 rounded p-1 whitespace-nowrap">
              <div className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                 <ShieldAlert className="w-3 h-3" />
                 EMERGENCY BASE
              </div>
            </div>
         </Html>
      </group>
    </group>
  );
}
