"use client";

import { useSyncExternalStore } from "react";
import { DEMO_LOTS } from "./demo-data";
import { clearUserLots, deleteUserLot, getAllLots } from "./storage";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("nebula-lots-change", callback);
  return () => window.removeEventListener("nebula-lots-change", callback);
}

export function useLots() {
  const lots = useSyncExternalStore(
    subscribe,
    getAllLots,
    () => DEMO_LOTS,
  );

  const deleteLot = (publicId: string) => {
    deleteUserLot(publicId);
  };

  const clearAll = () => {
    clearUserLots();
  };

  const refresh = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("nebula-lots-change"));
    }
  };

  return { lots, mounted: typeof window !== "undefined", deleteLot, clearAll, refresh };
}
