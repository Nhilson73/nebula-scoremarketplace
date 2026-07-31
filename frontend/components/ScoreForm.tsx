"use client";

import { useMemo, useState } from "react";
import { evaluate } from "@/lib/engine";
import { buildLotFromEvaluation, type LotDetails } from "@/lib/lot";
import { normalizedScore } from "@/lib/preview";
import type { EvaluationInput, Methodology, PenaltyInput, ScoreFormInput } from "@/lib/types";
import type { DemoLot } from "@/lib/demo-data";

interface Props {
  methodology: Methodology;
  onSubmit: (lot: DemoLot) => void;
  onCancel: () => void;
}

const emptyPenalty: PenaltyInput = {
  code: "",
  name: "",
  category: "Manual override",
  severity: "medium",
  value: "",
  reviewable: true,
};

const units = ["kg", "lb", "liters", "bags"];
const currencies = ["USD", "EUR", "DOP", "ARS"];
const processMethods = ["washed", "natural", "honey", "fermented", "red", "white", "rosé", "other"];

export function ScoreForm({ methodology, onSubmit, onCancel }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialModelId = useMemo(
    () => Object.keys(methodology.process.models)[0] || "insight",
    [methodology],
  );

  const initialProcess = useMemo(() => {
    const model = methodology.process.models[initialModelId];
    const values: Record<string, number | string> = {};
    if (model) {
      model.fields.forEach((f) => {
        values[f.id] = 85;
      });
    }
    return values;
  }, [methodology, initialModelId]);

  const initialIntegrity = useMemo(() => {
    const values: Record<string, number | string> = {};
    Object.keys(methodology.integrity.components).forEach((k) => {
      values[k] = 90;
    });
    return values;
  }, [methodology]);

  const qualityLabel = methodology.quality.input_label || methodology.quality.label;
  const qualityDefault =
    methodology.product === "coffee" ? 86 : methodology.product === "cacao" ? 70 : 75;

  const [form, setForm] = useState<ScoreFormInput>({
    product: methodology.product,
    equipment_model: initialModelId,
    origin_plan: "pro",
    evidence_quality: 4,
    quality_input: qualityDefault,
    process_values: initialProcess,
    integrity_values: initialIntegrity,
    penalties: [],
    lot_details: {
      unit: methodology.product === "wine" ? "liters" : "kg",
      currency: "USD",
    },
  });

  const selectedModel = methodology.process.models[form.equipment_model];

  const updateField = <K extends keyof EvaluationInput>(key: K, value: EvaluationInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateLotDetail = <K extends keyof LotDetails>(key: K, value: LotDetails[K]) => {
    setForm((prev) => ({ ...prev, lot_details: { ...prev.lot_details, [key]: value } }));
  };

  const updateProcess = (id: string, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      process_values: { ...prev.process_values, [id]: value },
    }));
  };

  const updateIntegrity = (id: string, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      integrity_values: { ...prev.integrity_values, [id]: value },
    }));
  };

  const handleModelChange = (modelId: string) => {
    const model = methodology.process.models[modelId];
    if (!model) return;
    const values: Record<string, number | string> = {};
    model.fields.forEach((f) => {
      values[f.id] = form.process_values[f.id] ?? 85;
    });
    setForm((prev) => ({ ...prev, equipment_model: modelId, process_values: values }));
  };

  const addPenalty = () => {
    setForm((prev) => ({ ...prev, penalties: [...prev.penalties, { ...emptyPenalty }] }));
  };

  const updatePenalty = (index: number, field: keyof PenaltyInput, value: string | number) => {
    setForm((prev) => {
      const penalties = [...prev.penalties];
      penalties[index] = { ...penalties[index], [field]: value };
      return { ...prev, penalties };
    });
  };

  const removePenalty = (index: number) => {
    setForm((prev) => ({ ...prev, penalties: prev.penalties.filter((_, i) => i !== index) }));
  };

  const toOneDecimal = (v: string | number) => {
    const n = Number(v);
    return Number.isNaN(n) ? 0 : Math.round(n * 10) / 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: ScoreFormInput = {
        ...form,
        quality_input: Math.round(Number(form.quality_input) * 100) / 100,
        evidence_quality: Number(form.evidence_quality),
        process_values: Object.fromEntries(
          Object.entries(form.process_values).map(([k, v]) => [k, toOneDecimal(v)]),
        ),
        integrity_values: Object.fromEntries(
          Object.entries(form.integrity_values).map(([k, v]) => [k, toOneDecimal(v)]),
        ),
        penalties: form.penalties.map((p) => ({ ...p, value: toOneDecimal(p.value) })),
        lot_details: {
          ...form.lot_details,
          quantity_available: form.lot_details.quantity_available
            ? toOneDecimal(form.lot_details.quantity_available)
            : 0,
          reference_price: form.lot_details.reference_price
            ? toOneDecimal(form.lot_details.reference_price)
            : undefined,
          altitude_m: form.lot_details.altitude_m
            ? toOneDecimal(form.lot_details.altitude_m)
            : undefined,
        },
      };

      const result = evaluate(payload, methodology);
      const lot = buildLotFromEvaluation(result, payload.lot_details);
      onSubmit(lot);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al calcular la evaluación");
    } finally {
      setSaving(false);
    }
  };

  const fieldClass =
    "flex flex-col gap-1.5 rounded-2xl border border-primary/10 bg-surface p-4";
  const inputClass =
    "min-h-[46px] rounded-xl border border-primary/10 bg-background px-3 py-2 text-foreground outline-none focus:border-primary";
  const labelClass = "text-sm font-semibold text-foreground/80";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-3xl border border-primary/10 bg-card p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Nueva evaluación</h2>
          <p className="text-foreground/70">
            Complete los datos del lote y del modelo de fermentación para calcular el Nebula Score®.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <fieldset className="mb-6">
          <legend className="mb-4 w-full border-b border-primary/10 pb-2 text-lg font-bold">
            Identificación del lote
          </legend>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className={fieldClass}>
              <span className={labelClass}>Lote / microlote</span>
              <input
                className={inputClass}
                value={form.lot_id || ""}
                onChange={(e) => updateField("lot_id", e.target.value)}
                placeholder="Ej. Lote Barahona 2026"
              />
            </label>
            <label className={fieldClass}>
              <span className={labelClass}>Productor o finca</span>
              <input
                className={inputClass}
                value={form.producer || ""}
                onChange={(e) => updateField("producer", e.target.value)}
                placeholder="Nombre del productor"
              />
            </label>
            <label className={fieldClass}>
              <span className={labelClass}>Región</span>
              <input
                className={inputClass}
                value={form.region || ""}
                onChange={(e) => updateField("region", e.target.value)}
              />
            </label>
            <label className={fieldClass}>
              <span className={labelClass}>Variedad</span>
              <input
                className={inputClass}
                value={form.variety || ""}
                onChange={(e) => updateField("variety", e.target.value)}
              />
            </label>
            <label className={fieldClass}>
              <span className={labelClass}>Proceso</span>
              <select
                className={inputClass}
                value={form.lot_details.process_method || ""}
                onChange={(e) => updateLotDetail("process_method", e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {processMethods.map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className={fieldClass}>
              <span className={labelClass}>Altitud (msnm)</span>
              <input
                className={inputClass}
                type="number"
                min={0}
                value={form.lot_details.altitude_m || ""}
                onChange={(e) => updateLotDetail("altitude_m", e.target.value)}
              />
            </label>
            <label className={fieldClass}>
              <span className={labelClass}>Fecha de cosecha</span>
              <input
                className={inputClass}
                type="date"
                value={form.harvest_date || ""}
                onChange={(e) => updateField("harvest_date", e.target.value)}
              />
            </label>
            <label className={fieldClass}>
              <span className={labelClass}>Cantidad disponible</span>
              <input
                className={inputClass}
                type="number"
                min={0}
                step="0.1"
                value={form.lot_details.quantity_available || ""}
                onChange={(e) => updateLotDetail("quantity_available", e.target.value)}
              />
            </label>
            <label className={fieldClass}>
              <span className={labelClass}>Unidad</span>
              <select
                className={inputClass}
                value={form.lot_details.unit || "kg"}
                onChange={(e) => updateLotDetail("unit", e.target.value)}
              >
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>
            <label className={fieldClass}>
              <span className={labelClass}>Precio referencia</span>
              <input
                className={inputClass}
                type="number"
                min={0}
                step="0.01"
                value={form.lot_details.reference_price || ""}
                onChange={(e) => updateLotDetail("reference_price", e.target.value)}
              />
            </label>
            <label className={fieldClass}>
              <span className={labelClass}>Moneda</span>
              <select
                className={inputClass}
                value={form.lot_details.currency || "USD"}
                onChange={(e) => updateLotDetail("currency", e.target.value)}
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className={`${fieldClass} sm:col-span-2 lg:col-span-3`}>
              <span className={labelClass}>Descripción</span>
              <textarea
                className={inputClass}
                rows={3}
                value={form.lot_details.description || ""}
                onChange={(e) => updateLotDetail("description", e.target.value)}
                placeholder={methodology.quality.warning || "Descripción del lote"}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="mb-4 w-full border-b border-primary/10 pb-2 text-lg font-bold">
            Calidad sensorial
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={fieldClass}>
              <span className={labelClass}>{qualityLabel}</span>
              <input
                className={inputClass}
                type="number"
                min={methodology.quality.input_range.min}
                max={methodology.quality.input_range.max}
                step="0.01"
                value={form.quality_input}
                onChange={(e) => updateField("quality_input", e.target.value)}
              />
              <small className="text-foreground/50">{methodology.quality.warning}</small>
            </label>
            <div className={fieldClass}>
              <span className={labelClass}>Score normalizado</span>
              <div className="text-2xl font-bold text-primary">
                {normalizedScore(
                  Number(form.quality_input),
                  methodology.quality.normalization.min_input,
                  methodology.quality.normalization.max_input,
                ).toFixed(1)}
              </div>
              <small className="text-foreground/50">{methodology.quality.normalization.formula}</small>
            </div>
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="mb-4 w-full border-b border-primary/10 pb-2 text-lg font-bold">
            Modelo y desempeño del proceso
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={fieldClass}>
              <span className={labelClass}>Modelo Nebula Fermentation®</span>
              <select
                className={inputClass}
                value={form.equipment_model}
                onChange={(e) => handleModelChange(e.target.value)}
              >
                {Object.entries(methodology.process.models).map(([key, m]) => (
                  <option key={key} value={key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>
            <div className={fieldClass}>
              <span className={labelClass}>Fórmula</span>
              <div className="text-sm font-medium text-foreground">{selectedModel?.formula || "—"}</div>
              <small className="text-foreground/50">
                Equipo permite confianza máxima {selectedModel?.equipment_capability || "—"}/5
              </small>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {selectedModel?.fields.map((field) => (
              <label key={field.id} className={fieldClass}>
                <span className={labelClass}>{field.label}</span>
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  value={form.process_values[field.id] ?? ""}
                  onChange={(e) => updateProcess(field.id, e.target.value)}
                />
                <small className="text-foreground/50">Ponderación: {Math.round(field.weight * 100)}%</small>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="mb-4 w-full border-b border-primary/10 pb-2 text-lg font-bold">
            Integridad y confianza
          </legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(methodology.integrity.components).map(([key, component]) => (
              <label key={key} className={fieldClass}>
                <span className={labelClass}>{component.label}</span>
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  value={form.integrity_values[key] ?? ""}
                  onChange={(e) => updateIntegrity(key, e.target.value)}
                />
                <small className="text-foreground/50">Ponderación: {Math.round(component.weight * 100)}%</small>
              </label>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className={fieldClass}>
              <span className={labelClass}>Plan Nebula OriginBlok®</span>
              <select
                className={inputClass}
                value={form.origin_plan}
                onChange={(e) => updateField("origin_plan", e.target.value)}
              >
                {Object.entries(methodology.confidence.plan_caps).map(([plan, cap]) => (
                  <option key={plan} value={plan}>
                    {plan.charAt(0).toUpperCase() + plan.slice(1)} — máximo {cap}
                  </option>
                ))}
              </select>
            </label>
            <label className={fieldClass}>
              <span className={labelClass}>Calidad real de la evidencia</span>
              <select
                className={inputClass}
                value={form.evidence_quality}
                onChange={(e) => updateField("evidence_quality", Number(e.target.value))}
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="mb-4 w-full border-b border-primary/10 pb-2 text-lg font-bold">
            Penalizaciones
          </legend>
          {form.penalties.map((penalty, idx) => (
            <div key={idx} className="mb-3 grid gap-4 sm:grid-cols-3">
              <label className={fieldClass}>
                <span className={labelClass}>Código</span>
                <input
                  className={inputClass}
                  value={penalty.code}
                  onChange={(e) => updatePenalty(idx, "code", e.target.value)}
                />
              </label>
              <label className={fieldClass}>
                <span className={labelClass}>Nombre</span>
                <input
                  className={inputClass}
                  value={penalty.name}
                  onChange={(e) => updatePenalty(idx, "name", e.target.value)}
                />
              </label>
              <label className={fieldClass}>
                <span className={labelClass}>Valor</span>
                <div className="flex gap-2">
                  <input
                    className={`${inputClass} flex-1`}
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    value={penalty.value}
                    onChange={(e) => updatePenalty(idx, "value", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removePenalty(idx)}
                    className="rounded-xl bg-red-500/10 px-3 text-red-400 transition hover:bg-red-500/20"
                  >
                    ×
                  </button>
                </div>
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={addPenalty}
            className="rounded-2xl border border-primary/20 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            Agregar penalización
          </button>
        </fieldset>

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-[48px] items-center rounded-2xl bg-primary px-6 py-3 font-semibold text-background transition hover:bg-accent disabled:opacity-60"
          >
            {saving ? "Calculando..." : "Calcular y publicar lote"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-[48px] items-center rounded-2xl border border-primary/20 px-6 py-3 font-semibold text-primary transition hover:bg-primary/10"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
