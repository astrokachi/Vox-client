interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

function get<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > entry.ttl) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function set<T>(key: string, data: T, ttl = 300_000): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now(), ttl };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable
  }
}

function generateKey(namespace: string, dto: unknown): string {
  return `apicache:${namespace}:${JSON.stringify(dto)}`;
}

export const apiCache = { get, set, generateKey };
