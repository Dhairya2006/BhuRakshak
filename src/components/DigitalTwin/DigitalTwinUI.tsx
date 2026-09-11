import React, { useState } from 'react';
import { useDigitalTwin } from './DigitalTwinContext';
import { Sliders, CloudRain, Droplet, Activity, Map, Wind, AlertTriangle, Layers, Play, RotateCcw, Monitor, Clock, Info } from 'lucide-react';

export function DigitalTwinUI() {
  const { state, updateState, resetState } = useDigitalTwin();
  const [commandMode, setCommandMode] = useState(false);

  const handleRunScenario = () => {
    updateState({ isSimulationMode: true, activeScenario: 'EXTREME_MONSOON', simulationProgress: 0 });
    
    // Simple animation loop for the scenario
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      if (progress >= 100) {
        clearInterval(interval);
        updateState({ simulationProgress: 100 });
      } else {
        updateState({ 
          simulationProgress: progress,
          rainfallMultiplier: 1 + (progress / 100) * 1.5,
          soilMoistureMultiplier: 1 + (progress / 100) * 0.8,
          weatherMode: progress > 30 ? (progress > 70 ? 'EXTREME RAIN' : 'HEAVY RAIN') : 'CLOUDY'
        });
      }
    }, 100);
  };

  return (
    <>
    <div className="absolute inset-y-0 left-0 w-80 p-4 pointer-events-none z-10 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
      
      {/* Top Left Controls */}
      <div className="pointer-events-auto flex gap-2">
         <button 
           onClick={() => setCommandMode(!commandMode)}
           className={`flex-1 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 transition-colors ${commandMode ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}
         >
           <Monitor className="w-3 h-3" /> COMMAND CENTER
         </button>
      </div>

      {/* KPI Panel */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-4 pointer-events-auto">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          ENVIRONMENTAL DATA
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 flex items-center gap-1"><CloudRain className="w-3 h-3"/> Rain</span>
            <span className="text-sm font-mono text-slate-200">{(85 * state.rainfallMultiplier).toFixed(0)} mm/24h</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 flex items-center gap-1"><Droplet className="w-3 h-3"/> Soil Moisture</span>
            <span className="text-sm font-mono text-slate-200">{Math.min(100, 61 * state.soilMoistureMultiplier).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 flex items-center gap-1"><Wind className="w-3 h-3"/> Weather</span>
            <span className="text-sm font-mono text-cyan-400">{state.weatherMode}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
            <span className="text-xs text-slate-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Avg Risk</span>
            <span className="text-sm font-bold font-mono text-rose-400">
              {Math.min(100, 38 + (state.rainfallMultiplier - 1)*20 + (state.soilMoistureMultiplier - 1)*15).toFixed(0)} / 100
            </span>
          </div>
        </div>
      </div>

      {/* What-If Simulator Panel */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-4 pointer-events-auto">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          WHAT-IF SCENARIO
        </h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Rainfall Multiplier</span>
              <span className="text-slate-200">{state.rainfallMultiplier.toFixed(1)}x</span>
            </div>
            <input 
              type="range" min="1" max="3" step="0.1" 
              value={state.rainfallMultiplier} 
              onChange={(e) => updateState({ rainfallMultiplier: parseFloat(e.target.value), isSimulationMode: true })}
              className="w-full accent-purple-500"
            />
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Soil Moisture</span>
              <span className="text-slate-200">{state.soilMoistureMultiplier.toFixed(1)}x</span>
            </div>
            <input 
              type="range" min="1" max="2" step="0.1" 
              value={state.soilMoistureMultiplier} 
              onChange={(e) => updateState({ soilMoistureMultiplier: parseFloat(e.target.value), isSimulationMode: true })}
              className="w-full accent-blue-500"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <button 
              onClick={handleRunScenario}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-2 rounded flex items-center justify-center gap-1"
            >
              <Play className="w-3 h-3" /> EXTREME MONSOON
            </button>
            <button 
              onClick={resetState}
              className="px-3 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold py-2 rounded flex items-center justify-center"
              title="Reset"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
          
          {state.activeScenario !== 'NONE' && (
             <div className="pt-2">
               <div className="text-xs text-slate-400 mb-1 flex justify-between">
                 <span>SIMULATION</span>
                 <span>{state.simulationProgress}%</span>
               </div>
               <div className="w-full bg-slate-800 rounded-full h-1.5">
                 <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-200" style={{ width: `${state.simulationProgress}%` }}></div>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
    
    {/* Right Side Panels */}
    <div className="absolute inset-y-0 right-0 w-80 p-4 pointer-events-none z-10 flex flex-col gap-4 overflow-y-auto custom-scrollbar items-end">
      {/* Explanation Panel if simulation finished */}
      {state.simulationProgress === 100 && (
         <div className="w-full bg-slate-900/80 backdrop-blur-md border border-rose-900/50 rounded-xl p-4 pointer-events-auto shadow-lg shadow-rose-900/20">
            <h2 className="text-sm font-semibold text-rose-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              IMPACT SUMMARY
            </h2>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between"><span>Critical Zones:</span> <span className="text-rose-400 font-bold">+8</span></div>
              <div className="flex justify-between"><span>Blocked Roads:</span> <span className="text-orange-400 font-bold">+4</span></div>
              <div className="flex justify-between"><span>High-Risk Villages:</span> <span className="text-orange-400 font-bold">+7</span></div>
              <div className="flex justify-between"><span>Priority Incidents:</span> <span className="text-rose-400 font-bold">+5</span></div>
            </div>
            <button className="mt-3 w-full bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-600/50 py-1.5 rounded text-xs font-medium transition-colors">
               RECOMMENDED RESPONSE
            </button>
         </div>
      )}

      {/* AI Explanation for selected infrastructure/zone */}
      {state.selectedInfrastructure && (
         <div className="w-full bg-slate-900/90 backdrop-blur-md border border-cyan-800/50 rounded-xl p-4 pointer-events-auto">
            <h2 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2 uppercase">
              <Info className="w-4 h-4" />
              AI Risk Analysis
            </h2>
            <div className="text-xs text-slate-300 space-y-3">
              <div className="p-2 bg-slate-800/50 rounded border border-slate-700">
                <p className="font-bold text-slate-200 mb-1">Why is this area at risk?</p>
                <p className="text-slate-400">Primary concern: intense rainfall combined with saturated steep terrain.</p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between"><span>Rainfall Factor:</span> <span className="text-rose-400">+28</span></div>
                <div className="flex justify-between"><span>Soil Moisture:</span> <span className="text-rose-400">+24</span></div>
                <div className="flex justify-between"><span>Slope Gradient:</span> <span className="text-orange-400">+19</span></div>
                <div className="flex justify-between"><span>Historical Events:</span> <span className="text-yellow-400">+10</span></div>
              </div>
              <button 
                 onClick={() => updateState({ selectedInfrastructure: null })}
                 className="w-full mt-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
              >
                 Dismiss
              </button>
            </div>
         </div>
      )}

      {/* Time Machine */}
      {commandMode && (
         <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-4 pointer-events-auto mt-auto">
            <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              TIME MACHINE
            </h2>
            <div className="flex flex-col gap-2">
              <input type="range" min="-24" max="24" step="6" defaultValue="0" className="w-full accent-emerald-500" />
              <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                <span>-24H</span>
                <span>NOW</span>
                <span>+24H</span>
              </div>
            </div>
         </div>
      )}
    </div>
    </>
  );
}
