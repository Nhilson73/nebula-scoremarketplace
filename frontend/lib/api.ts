import {
  DEMO_LOTS,
  DEMO_PRODUCERS,
  DEMO_NFB_TIERS,
  DEMO_NOB_TIERS,
  type DemoLot,
  type DemoProducer,
  type Tier,
} from "./demo-data";
import { getAllLots, getLotByPublicId as storageGetLotById } from "./storage";

export async function fetchLots(): Promise<DemoLot[]> {
  if (typeof window === "undefined") return DEMO_LOTS;
  return getAllLots();
}

export async function fetchLotByPublicId(
  publicId: string,
): Promise<DemoLot | undefined> {
  if (typeof window === "undefined") {
    return DEMO_LOTS.find((l) => l.public_id === publicId);
  }
  return storageGetLotById(publicId);
}

export async function fetchProducers(): Promise<DemoProducer[]> {
  return DEMO_PRODUCERS;
}

export async function fetchProducerBySlug(
  slug: string,
): Promise<DemoProducer | undefined> {
  return DEMO_PRODUCERS.find((p) => p.slug === slug);
}

export async function fetchNfbTiers(): Promise<Tier[]> {
  return DEMO_NFB_TIERS;
}

export async function fetchNobTiers(): Promise<Tier[]> {
  return DEMO_NOB_TIERS;
}
