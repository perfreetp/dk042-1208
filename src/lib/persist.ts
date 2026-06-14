const STORAGE_PREFIX = 'devops-platform:';

export function saveToStorage<T>(key: string, value: T): void {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    const stored = localStorage.getItem(storageKey);
    if (stored === null) return defaultValue;
    return JSON.parse(stored) as T;
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
    return defaultValue;
  }
}

export function clearStorage(key: string): void {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    localStorage.removeItem(storageKey);
  } catch (e) {
    console.warn('Failed to clear localStorage:', e);
  }
}
