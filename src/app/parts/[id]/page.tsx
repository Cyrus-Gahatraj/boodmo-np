"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Header } from "@/components/home/Header";
import { Breadcrumbs } from "@/components/category/Breadcrumbs";
import {
  CategorySidebar,
  type SidebarCategory,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setLoading(true);
    setError("");

    const fetchData = async () => {
      try {
        // Fetch categories for sidebar
        const catRes = await fetch(`${API_BASE}?action=categories`);
        if (catRes.ok) {
          const catData = await catRes.json();
          if (!cancelled) setCategories(catData.data || catData.results || catData || []);
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
          <a href="/" className="mt-4 inline-block text-[#00a1e5] hover:underline">Go back home</a>
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
            currentSlug=""
            currentName={part.name}
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
