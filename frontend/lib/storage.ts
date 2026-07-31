import { DEMO_LOTS, type DemoLot } from "./demo-data";

const STORAGE_KEY = "nebula-scoremarketplace-user-lots";

let cachedUserLots: DemoLot[] | undefined;
let cachedAllLots: DemoLot[] | undefined;
const listeners = new Set<() => void>();

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadUserLots(): DemoLot[] {
  if (cachedUserLots !== undefined) return cachedUserLots;
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoLot[]) : [];
  } catch {
    return [];
  }
}

function recomputeAllLots(): DemoLot[] {
  const user = cachedUserLots ?? loadUserLots();
  cachedUserLots = user;
  if (user.length === 0) {
    cachedAllLots = DEMO_LOTS;
  } else {
    const seen = new Set(user.map((l) => l.public_id));
    cachedAllLots = [
      ...user,
      ...DEMO_LOTS.filter((l) => !seen.has(l.public_id)),
    ];
  }
  return cachedAllLots;
}

export function getAllLots(): DemoLot[] {
  if (cachedAllLots !== undefined) return cachedAllLots;
  return recomputeAllLots();
}

export function getLotByPublicId(publicId: string): DemoLot | undefined {
  return getAllLots().find((l) => l.public_id === publicId);
}

export function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notify() {
  listeners.forEach((listener) => listener());
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent("nebula-lots-change"));
  }
}

export function saveUserLots(lots: DemoLot[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lots));
  cachedUserLots = lots;
  recomputeAllLots();
  notify();
}

export function addUserLot(lot: DemoLot) {
  const lots = [lot, ...loadUserLots()];
  saveUserLots(lots);
}

export function deleteUserLot(publicId: string) {
  const lots = loadUserLots().filter((l) => l.public_id !== publicId);
  saveUserLots(lots);
}

export function clearUserLots() {
  saveUserLots([]);
}
