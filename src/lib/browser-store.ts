type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeToStorage(listener: Listener) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function readStorage(key: string): string | null {
  return localStorage.getItem(key);
}

export function writeStorage(key: string, value: string): void {
  localStorage.setItem(key, value);
  for (const listener of listeners) listener();
}

export function subscribeToMediaQuery(query: string) {
  return (listener: Listener) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  };
}

export function matchesMediaQuery(query: string): boolean {
  return window.matchMedia(query).matches;
}
