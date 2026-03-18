"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Header } from "@/components/home/Header";
import { Breadcrumbs } from "@/components/category/Breadcrumbs";
import {
  CategorySidebar,
  type SidebarCategory,
  type FilterState,
  type Brand,
} from "@/components/category/CategorySidebar";
import { PartDetail } from "@/components/category/PartDetail";

const API_BASE = "/api/boodmo";

export default function PartPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [part, setPart] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [compat, setCompat] = useState<any[]>([]);
  const [replacements, setReplacements] = useState<any[]>([]);
  const [categories, setCategories] = useState<SidebarCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [makers, setMakers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    brandIds: [],
    minPrice: "",
    maxPrice: "",
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setLoading(true);
    setError("");

    const fetchData = async () => {
      try {
        // Fetch categories, makers and brands for sidebar
        const [catRes, makerRes, brandRes] = await Promise.all([
          fetch(`${API_BASE}?action=categories`),
          fetch(`${API_BASE}?action=makers`),
          fetch(`${API_BASE}?action=brands`),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          if (!cancelled) {
            const raw = catData.data || catData.results || catData || [];
            setCategories(Array.isArray(raw) ? raw : []);
          }
        }
        
        if (makerRes.ok) {
          const makerData = await makerRes.json();
          if (!cancelled) {
            setMakers(makerData.data || makerData.items || makerData || []);
          }
        }

        if (brandRes.ok) {
          const brandData = await brandRes.json();
          if (!cancelled) {
            setBrands(brandData.results || brandData.brands || brandData || []);
          }
        }

        // Fetch part details
        const partRes = await fetch(`${API_BASE}?action=part&partId=${id}`);
        if (!partRes.ok) throw new Error("Part not found");
        const partData = await partRes.json();
        if (!cancelled) setPart(partData);

        // Fetch other info in parallel
        const [offersRes, compatRes, replacementsRes] = await Promise.all([
          fetch(`${API_BASE}?action=offers&partId=${id}`),
          fetch(`${API_BASE}?action=compat&partId=${id}`),
          fetch(`${API_BASE}?action=replacements&partId=${id}`)
        ]);

        if (offersRes.ok) {
          const d = await offersRes.json();
          if (!cancelled) setOffers(d.data || d.results || []);
        }
        if (compatRes.ok) {
          const d = await compatRes.json();
          if (!cancelled) setCompat(d.data || d.results || []);
        }
        if (replacementsRes.ok) {
          const d = await replacementsRes.json();
          if (!cancelled) setReplacements(d.data || d.results || []);
        }

      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to load part information");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f9ff]">
        <Header />
        <div className="mx-auto max-w-6xl px-4 py-12 text-center text-[#7c8fa8]">
          Loading part information…
        </div>
      </div>
    );
  }

  if (error || !part) {
    return (
      <div className="min-h-screen bg-[#f5f9ff]">
        <Header />
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="text-red-600">{error || "Product not found"}</p>
          <Link href="/" className="mt-4 inline-block text-[#00a1e5] hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f9ff]">
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Parts", href: "/search" },
          { label: part.name || "Part Detail" },
        ]}
      />
      <div className="boodmo-container py-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <CategorySidebar
            categories={categories}
            makers={makers}
            brands={brands}
            currentSlug=""
            currentName={part.name}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          <main className="min-w-0 flex-1">
            <PartDetail 
              part={part}
              offers={offers}
              compatibilities={compat}
              replacements={replacements}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
