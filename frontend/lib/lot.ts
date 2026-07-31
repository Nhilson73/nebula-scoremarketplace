import type { EvaluationResult } from "./types";
import type { DemoLot } from "./demo-data";

export interface LotDetails {
  lot_name?: string;
  farm_name?: string;
  quantity_available?: number | string;
  unit?: string;
  reference_price?: number | string;
  currency?: string;
  altitude_m?: number | string;
  process_method?: string;
  description?: string;
}

function slugify(text = ""): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "productor"
  );
}

function parseYear(value?: string): number | null {
  if (!value) return null;
  const match = value.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : null;
}

export function buildLotFromEvaluation(
  evaluation: EvaluationResult,
  details: LotDetails,
): DemoLot {
  const farmName = details.farm_name || evaluation.producer || "Importado de Nebula Score®";
  const producerSlug = slugify(farmName);
  const lotName =
    details.lot_name ||
    evaluation.lot_id ||
    `Lote ${evaluation.product} ${evaluation.public_id.slice(-8)}`;
  const harvestYear = parseYear(evaluation.harvest_date) || new Date().getFullYear();

  return {
    id: 0,
    public_id: evaluation.public_id,
    producer_id: 0,
    producer_slug: producerSlug,
    product_type: evaluation.product,
    lot_name: lotName,
    farm_name: farmName,
    region: evaluation.region || "",
    altitude_m: details.altitude_m ? Number(details.altitude_m) : null,
    variety: evaluation.variety || "",
    process_method: details.process_method || evaluation.protocol || "unknown",
    harvest_year: harvestYear,
    quantity_available: details.quantity_available ? Number(details.quantity_available) : 0,
    unit: details.unit || "kg",
    reference_price: details.reference_price ? Number(details.reference_price) : null,
    currency: details.currency || "USD",
    status: "published",
    description: details.description || evaluation.interpretation || "",
    photos: [],
    nebula_score_public_id: evaluation.public_id,
    nebula_score_snapshot: {
      public_id: evaluation.public_id,
      product: evaluation.product,
      methodology_id: evaluation.methodology_id,
      methodology_version: evaluation.methodology_version,
      nebula_score: evaluation.nebula_score,
      quality_score: evaluation.quality_score,
      process_score: evaluation.process_score,
      integrity_score: evaluation.integrity_score,
      total_penalties: evaluation.total_penalties,
      confidence_level: evaluation.confidence_level,
      classification: evaluation.classification,
      interpretation: evaluation.interpretation,
      penalties: evaluation.penalties,
      equipment_model: evaluation.equipment_model,
      origin_plan: evaluation.origin_plan,
      evidence_quality: evaluation.evidence_quality,
      last_synced_at: null,
      mock: false,
    },
    nob_traceability_ref: { status: "pending" },
    is_demo: false,
    created_at: evaluation.created_at,
  };
}
