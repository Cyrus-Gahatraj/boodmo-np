"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { slugify } from "@/lib/slug";
import { IconX } from "@/components/ui/Icons";

const ASSET_BASE = "https://demoapi.boodmo.in";
const API_BASE = "/api/boodmo";

export interface VehicleSelection {
  makerId: string;
  lineId: string;
  modelId: string;
  configId?: string;
  makerName?: string;
  lineName?: string;
  modelName?: string;
  configName?: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
  childs: unknown;
}

interface VehicleSearchModalProps {
  vehicle: VehicleSelection;
  onClose: () => void;
}

function buildCategoryUrl(slug: string, vehicle: VehicleSelection): string {
  const params = new URLSearchParams({
    makerId: vehicle.makerId,
    lineId: vehicle.lineId,
    modelId: vehicle.modelId,
  });
  if (vehicle.configId) params.set("configId", vehicle.configId);
  return `/category/${slug}?${params.toString()}`;
}

export function VehicleSearchModal({ vehicle, onClose }: VehicleSearchModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${API_BASE}?action=categories`, { headers: { "Content-Type": "application/json" } })
      .then((r) => r.json())
      .then((data) => setCategories(data.results || data.data || data || []))
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [handleEscape]);

  const summary = [vehicle.makerName, vehicle.lineName, vehicle.modelName, vehicle.configName]
    .filter(Boolean)
    .join(" · ") || "Your vehicle";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicle-search-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--boodmo-border)] px-6 py-4">
          <div>
            <h2
              id="vehicle-search-modal-title"
              className="text-xl font-semibold"
              style={{ color: "var(--boodmo-text)" }}
            >
              Search by Category
            </h2>
            <p className="mt-0.5 text-sm" style={{ color: "var(--boodmo-text-muted)" }}>
              Parts for: <strong>{summary}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--boodmo-text-muted)] hover:bg-gray-100 hover:text-[var(--boodmo-text)]"
            aria-label="Close"
          >
		    <IconX/>
          </button>
        </div>
        <div className="max-h-[calc(90vh-5rem)] overflow-y-auto px-6 py-4">
          {error && (
            <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {loading ? (
            <p className="py-8 text-center text-[var(--boodmo-text-muted)]">Loading categories…</p>
          ) : categories.length === 0 ? (
            <p className="py-8 text-center text-[var(--boodmo-text-muted)]">No categories available.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={buildCategoryUrl(slugify(cat.name), vehicle)}
                  onClick={onClose}
                  className="flex flex-col items-center justify-center gap-3 rounded-lg border border-[var(--boodmo-border)] bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {cat.image ? (
                    <img
                      src={`${ASSET_BASE}/${cat.image}`}
                      alt={cat.name}
                      className="h-14 w-14 object-contain"
                    />
                  ) : (
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                      style={{ background: "var(--boodmo-header-bg)" }}
                    >
                      ⚙️
                    </div>
                  )}
                  <span className="text-xs font-semibold text-[var(--boodmo-text)] line-clamp-2">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
