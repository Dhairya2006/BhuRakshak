import React from 'react';
import { DigitalTwinProvider } from './DigitalTwinContext';
import { DigitalTwinViewer } from './DigitalTwinViewer';
import { DigitalTwinUI } from './DigitalTwinUI';
import { Layers } from 'lucide-react';

export function DigitalTwinContainer({ onToggle2D }: { onToggle2D: () => void }) {
  return (
    <DigitalTwinProvider>
      <div className="flex flex-col h-full space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-slate-100 flex items-center gap-2">
            <Layers className="text-purple-400" />
            Digital Twin Intelligence
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={onToggle2D}
              className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-lg flex items-center gap-2 text-sm hover:bg-slate-700 text-slate-300 transition-colors"
            >
              SWITCH TO 2D MAP
            </button>
          </div>
        </div>

        <div className="flex-1 relative rounded-xl overflow-hidden border border-slate-700">
          <DigitalTwinViewer />
          <DigitalTwinUI />
        </div>
      </div>
    </DigitalTwinProvider>
  );
}
