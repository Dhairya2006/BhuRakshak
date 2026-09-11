import React, { createContext, useContext, useState, useEffect } from 'react';
import { set, get, del, keys } from 'idb-keyval';

interface AppContextType {
  isOnline: boolean;
  syncQueue: () => Promise<void>;
  isSyncing: boolean;
}

const AppContext = createContext<AppContextType>({
  isOnline: true,
  syncQueue: async () => {},
  isSyncing: false
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncQueue = async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    try {
      const queueKeys = await keys();
      const incidentKeys = queueKeys.filter(k => typeof k === 'string' && k.startsWith('incident_'));
      
      for (const key of incidentKeys) {
        const data = await get(key);
        if (data) {
          const res = await fetch('/api/incidents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (res.ok) {
            await del(key);
          }
        }
      }
    } catch (e) {
      console.error('Failed to sync queue', e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AppContext.Provider value={{ isOnline, syncQueue, isSyncing }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
