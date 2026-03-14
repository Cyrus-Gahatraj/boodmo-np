"use client";

import { useEffect, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/Icons";

const API_BASE_URL = "/api/boodmo";

interface Brand {
  id: number;
  name: string;
  slug?: string;
}

export function BrandsWeTrust() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}?action=brands`, {
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed"))))
      .then((data) => setBrands(data.results || data.brands || data || []))
      .catch(() => setError("Could not load brands"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-10">
      <div className="boodmo-container">
        <div className="mb-4 flex items-center justify-between">
        <h2
          className="mb-6 text-3xl font-semibold"
          style={{ color: "var(--boodmo-blue)" }}
        >
          Brands we <span style={{color: "var(--boodmo-blue-light)"}}>Trust</span>
        </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded p-1.5 text-[var(--boodmo-text-muted)] hover:bg-gray-100"
              aria-label="Previous"
            >
              <IconChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="rounded p-1.5 text-[var(--boodmo-text-muted)] hover:bg-gray-100"
              aria-label="Next"
            >
              <IconChevronRight size={20} />
            </button>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {loading ? (
          <p className="text-sm text-[var(--boodmo-text-muted)]">Loading…</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {brands.slice(0, 12).map((b) => (
              <div
                key={b.id}
                className="flex min-w-[100px] items-center justify-center rounded-lg border border-[var(--boodmo-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--boodmo-text)]"
              >
                {b.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
