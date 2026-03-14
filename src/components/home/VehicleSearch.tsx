"use client";

import { IconSearch } from "@/components/ui/Icons";

const SEARCH_CATEGORIES = [
  "Select Car Maker",
  "Select Model Line",
  "Select Year",
  "Select Modification",
];

export function VehicleSearch() {
  const selectStyles = "h-10 flex-1 rounded border border-[#c4d8f0] bg-white px-3 text-xs text-[#394b63] focus:outline-none";

  return (
    <section className="bg-white py-10">
      <div className="boodmo-container mx-auto max-w-6xl px-4">
        
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold" style={{ color: "var(--boodmo-blue)" }}>
            Search by <span style={{ color: "var(--boodmo-blue-light)" }}>Vehicle</span>
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-[var(--boodmo-text-muted)]">
              Search by number plate
            </span>
            <input
              type="text"
              placeholder="DL1CBA7545"
              className="h-9 w-36 rounded border border-[var(--boodmo-border)] bg-white px-3 text-sm text-[var(--boodmo-text)] placeholder:text-[var(--boodmo-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--boodmo-blue)]"
            />
            <button
              type="button"
              className="flex h-9 items-center gap-1.5 rounded px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--boodmo-blue-light)" }}
            >
              <IconSearch size={16} />
            </button>
          </div>
        </div>

        <div 
          className="overflow-hidden rounded border shadow-sm" 
          style={{ background: "var(--boodmo-blue)" }}
        >
          <div className="flex flex-col gap-3 px-4 py-4 md:flex-row">
            {SEARCH_CATEGORIES.map((label) => (
              <select key={label} className={selectStyles}>
                <option>{label}</option>
              </select>
            ))}
            
            <button
              className="h-10 rounded px-6 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--boodmo-blue-light)" }}
            >
              Search Parts
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
