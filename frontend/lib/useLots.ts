"use client";

import { useSyncExternalStore } from "react";
import { clearUserLots, deleteUserLot, getAllLots, subscribe } from "./storage";

export function useLots() {
  const lots = useSyncExternalStore(subscribe, getAllLots, getAllLots);

  return {
    lots,
    mounted: typeof window !== "undefined",
    deleteLot: deleteUserLot,
    clearAll: clearUserLots,
  };
}
