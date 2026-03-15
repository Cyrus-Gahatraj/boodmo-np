"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/home/Header";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const plate = searchParams.get("plate");
  const makerId = searchParams.get("makerId");
  const lineId = searchParams.get("lineId");
  const modelId = searchParams.get("modelId");
  const configId = searchParams.get("configId");

  const isPlateSearch = Boolean(plate?.trim());
  const isVehicleSearch = Boolean(makerId && lineId && modelId);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="boodmo-container py-10">
        {isPlateSearch && (
          <p className="text-[var(--boodmo-text)]">
            Search by number plate: <strong>{plate}</strong> (results can be wired to API later).
          </p>
        )}
        {isVehicleSearch && (
          <p className="text-[var(--boodmo-text)]">
            Vehicle selected: Maker ID {makerId}, Line ID {lineId}, Model ID {modelId}
            {configId && `, Config ID ${configId}`}. Parts search can be wired to <code>part-collection</code> or vehicle-specific API here.
          </p>
        )}
        {!isPlateSearch && !isVehicleSearch && (
          <p className="text-[var(--boodmo-text-muted)]">
            No search criteria. Use the vehicle search on the homepage to select maker, model line, year, and modification.
          </p>
        )}
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium"
          style={{ color: "var(--boodmo-blue)" }}
        >
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
