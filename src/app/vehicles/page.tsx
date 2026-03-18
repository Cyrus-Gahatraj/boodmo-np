"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Breadcrumbs } from "@/components/category/Breadcrumbs";

const API_BASE_URL = "/api/boodmo";

interface Maker {
  id: number;
  name: string;
  slug?: string;
}

export default function VehiclesPage() {
  const [makers, setMakers] = useState<Maker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchMakers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}?action=makers`, {
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        if (mounted) {
          const makerList = data.results || data.makers || data || [];
          setMakers(makerList);
        }
      } catch {
        if (mounted) setError("Could not load vehicles");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMakers();
    return () => { mounted = false; };
  }, []);

  const filteredMakers = makers.filter((maker) =>
    maker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Vehicles", href: "/vehicles" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="boodmo-container py-8">
        <Breadcrumbs items={breadcrumbs} />
        
        <div className="mt-6">
          <h1
            className="text-2xl font-bold md:text-3xl"
            style={{ color: "var(--boodmo-blue)" }}
          >
            Popular <span style={{ color: "var(--boodmo-blue-light)" }}>Car Makers</span>
          </h1>
          
          <p className="mt-2 text-sm text-[#7c8fa8]">
            Browse all available car makers
          </p>
        </div>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded border border-[#e2edf7] px-4 py-2 text-sm outline-none focus:border-[#00a1e5] focus:ring-1 focus:ring-[#00a1e5]"
          />
        </div>

        {error && (
          <div className="mt-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center rounded-lg border border-[#e2edf7] bg-[#f5f9ff] p-4"
              >
                <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : filteredMakers.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {filteredMakers.map((maker) => (
              <Link
                key={maker.id}
                href={`/search?makerId=${maker.id}`}
                className="rounded-lg border border-[#e2edf7] bg-white px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-[#394b63] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {maker.name}
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded border border-[#e2edf7] bg-[#f5f9ff] p-8 text-center text-sm text-[#7c8fa8]">
            {searchQuery ? "No vehicles found matching your search" : "No vehicles available"}
          </div>
        )}
      </main>
    </div>
  );
}
