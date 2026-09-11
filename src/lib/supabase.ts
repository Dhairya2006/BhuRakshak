import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidSupabaseConfig = (url?: string, key?: string): boolean => {
  if (!url || !key) return false;
  if (typeof url !== 'string' || typeof key !== 'string') return false;
  const trimmedUrl = url.trim();
  const trimmedKey = key.trim();
  if (trimmedUrl.length === 0 || trimmedKey.length === 0) return false;
  return trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://');
};

export const isSupabaseConfigured = isValidSupabaseConfig(rawUrl, rawKey);

// Initial fallback incidents for demo & offline operation
const defaultIncidents = [
  {
    id: 'inc-101',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: 'Debris Flow',
    location: 'NH-06 Shillong-Silchar Corridor (Km 42)',
    description: 'Active mudslide and boulder fall obstructing two lanes. BRO clearing team deployed.',
    priority: 'P1',
    status: 'IN_PROGRESS',
    ai_analysis: JSON.stringify({
      hazard_type: 'Mudflow / Boulder Fall',
      risk_severity: 'HIGH',
      slope_stability: 'UNSTABLE',
      recommendation: 'Divert vehicular movement via Umroi route; deploy clearing excavators.'
    })
  },
  {
    id: 'inc-102',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    type: 'Cut-Slope Failure',
    location: 'Cherrapunji-Mawsmai Escarpment Road',
    description: 'Tension cracks widened following 142mm antecedent rainfall. Geotextile net bulging.',
    priority: 'P2',
    status: 'PENDING',
    ai_analysis: JSON.stringify({
      hazard_type: 'Rotational Slump',
      risk_severity: 'MEDIUM',
      slope_stability: 'MARGINAL',
      recommendation: 'Install warning markers and restrict heavy freight vehicles.'
    })
  },
  {
    id: 'inc-103',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    type: 'Rockfall',
    location: 'Tura-Rongram Ghat Road',
    description: 'Loose shale debris cleared from shoulder. Retaining wall inspected.',
    priority: 'P3',
    status: 'RESOLVED',
    ai_analysis: null
  }
];

// Helper to access persistent local storage store
function getLocalTable(table: string): any[] {
  if (typeof window === 'undefined') return defaultIncidents;
  try {
    const key = `ner_safe_${table}`;
    const stored = localStorage.getItem(key);
    if (!stored) {
      if (table === 'incidents') {
        localStorage.setItem(key, JSON.stringify(defaultIncidents));
        return defaultIncidents;
      }
      return [];
    }
    return JSON.parse(stored);
  } catch {
    return table === 'incidents' ? defaultIncidents : [];
  }
}

function saveLocalTable(table: string, data: any[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`ner_safe_${table}`, JSON.stringify(data));
  } catch (e) {
    console.warn('Unable to persist to localStorage:', e);
  }
}

// Fallback client mimicking Supabase query builder
function createLocalClient(): any {
  return {
    from: (table: string) => {
      let queryLimit: number | null = null;
      let orderCol: string | null = null;
      let orderAsc = true;

      const builder: any = {
        select: (_columns?: string) => {
          return builder;
        },
        order: (column: string, options?: { ascending?: boolean }) => {
          orderCol = column;
          orderAsc = options?.ascending ?? true;
          return builder;
        },
        limit: (n: number) => {
          queryLimit = n;
          return builder;
        },
        eq: (_column: string, _value: any) => {
          return builder;
        },
        then: (resolve: any, reject: any) => {
          try {
            let data = [...getLocalTable(table)];
            if (orderCol) {
              data.sort((a, b) => {
                const valA = a[orderCol!] ?? '';
                const valB = b[orderCol!] ?? '';
                if (valA < valB) return orderAsc ? -1 : 1;
                if (valA > valB) return orderAsc ? 1 : -1;
                return 0;
              });
            }
            if (queryLimit !== null) {
              data = data.slice(0, queryLimit);
            }
            resolve({ data, error: null });
          } catch (err) {
            if (reject) reject(err);
            else resolve({ data: [], error: err });
          }
        },
        insert: async (rows: any[]) => {
          const current = getLocalTable(table);
          const newRows = rows.map((r, i) => ({
            id: r.id || `inc-${Date.now()}-${i}`,
            created_at: r.created_at || new Date().toISOString(),
            ...r
          }));
          const updated = [...newRows, ...current];
          saveLocalTable(table, updated);
          return { data: newRows, error: null };
        },
        update: async (values: any) => {
          return { data: values, error: null };
        },
        delete: async () => {
          return { data: null, error: null };
        }
      };

      return builder;
    }
  };
}

let clientInstance: any;

if (isSupabaseConfigured) {
  try {
    clientInstance = createClient(rawUrl!.trim(), rawKey!.trim());
  } catch (err) {
    console.warn('Failed to initialize Supabase client, using local offline store:', err);
    clientInstance = createLocalClient();
  }
} else {
  clientInstance = createLocalClient();
}

export const supabase = clientInstance;
