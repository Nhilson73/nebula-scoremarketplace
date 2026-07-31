import { DEMO_LOTS, type DemoLot } from "./demo-data";

const STORAGE_KEY = "nebula-scoremarketplace-user-lots";

function isBrowser() {
  return typeof window !== "undefined";
}

function emitChange() {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent("nebula-lots-change"));
}

export function loadUserLots(): DemoLot[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoLot[]) : [];
  } catch {
    return [];
  }
}

export function saveUserLots(lots: DemoLot[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lots));
  emitChange();
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

export function getAllLots(): DemoLot[] {
  const user = loadUserLots();
  const seen = new Set(user.map((l) => l.public_id));
  return [...user, ...DEMO_LOTS.filter((l) => !seen.has(l.public_id))];
}

export function getLotByPublicId(publicId: string): DemoLot | undefined {
  return getAllLots().find((l) => l.public_id === publicId);
}
