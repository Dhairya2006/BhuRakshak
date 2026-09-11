import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export function DashboardLayout() {
  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden text-slate-200 font-sans selection:bg-rose-500/30">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative z-0">
          {/* Subtle gradient background decoration */}
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-rose-900/10 via-slate-900/5 to-transparent pointer-events-none -z-10" />
          
          <Outlet />
        </main>
      </div>
    </div>
  );
}
