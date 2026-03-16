"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/home/Header";
import { Breadcrumbs } from "@/components/category/Breadcrumbs";
import {
  CategorySidebar,
  type SidebarCategory,
} from "@/components/category/CategorySidebar";
import { ProductCard, type Product } from "@/components/category/ProductCard";
import { Icons } from "@/components/ui/Icons";
import { slugify, slugToTitle } from "@/lib/slug";

const API_BASE = "/api/boodmo";

function normalizeCategories(raw: unknown): SidebarCategory[] {
  if (Array.isArray(raw)) return raw as SidebarCategory[];
  if (raw && typeof raw === "object" && "results" in (raw as object))
    return ((raw as { results: unknown }).results as SidebarCategory[]) || [];
  if (raw && typeof raw === "object" && "data" in (raw as object)) {
    const d = (raw as { data: unknown }).data;
    return Array.isArray(d) ? (d as SidebarCategory[]) : [];
  }
  return [];
}

function findCategoryBySlug(
  categories: SidebarCategory[],
  slug: string
): SidebarCategory | null {
  for (const c of categories) {
    if (slugify(c.name) === slug) return c;
    if (c.childs?.length) {
      const found = findCategoryBySlug(c.childs as SidebarCategory[], slug);
      if (found) return found;
    }
  }
  return null;
}

export default function CatalogPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const title = slug ? slugToTitle(slug) : "Catalog";

  const [categories, setCategories] = useState<SidebarCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const fetchData = async () => {
      try {
        // 1. Fetch categories
        const catRes = await fetch(`${API_BASE}?action=categories`);
        if (!catRes.ok) throw new Error(`Failed to load categories: ${catRes.status}`);
        const catData = await catRes.json();
        const cats = normalizeCategories(catData);
        if (!cancelled) setCategories(cats);

        const current = findCategoryBySlug(cats, slug);
        if (!current) {
          throw new Error(`Category "${title}" not found. Please try another.`);
        }

        // 2. Fetch products using the correct filter[categoryId] format via our route
        const url = `${API_BASE}?action=collection&categoryId=${current.id}`;

        const prodRes = await fetch(url);
        const prodData = await prodRes.json();

        if (!prodRes.ok) {
           throw new Error(prodData.error?.message || prodData.error || "Failed to load products");
        }

        // The API returns an "items" array as per documentation
        const rawParts = prodData.items || [];
        const mappedProducts: Product[] = rawParts.map((p: any) => ({
          id: p.id.toString(),
          name: p.name || "Unknown Part",
          price: p.price || p.mrp || 0,
          mrp: p.mrp || p.price || 0,
          discount: p.mrp && p.price && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0,
          brand: p.brand?.name || "Generic",
          partNumber: p.number || "N/A",
          image: p.image ? `https://demoapi.boodmo.in/${p.image}` : "/next.svg",
          isFulfilledByBoodmo: p.is_fulfilled || false,
          isBoodmosChoice: p.is_boodmo_choice || false,
          hasFreeDelivery: p.has_free_delivery || false,
          tag: p.brand?.origin === "oem" ? "OEM" : (p.brand?.origin === "aftermarket" ? "Aftermarket" : undefined),
        }));

        if (!cancelled) {
          setProducts(mappedProducts);
          setTotalCount(prodData.total || mappedProducts.length);
        }

      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "An unexpected error occurred");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [slug, title]);

  const currentCategoryName = useMemo(() => {
    const current = findCategoryBySlug(categories, slug);
    return current?.name ?? title;
  }, [categories, slug, title]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f9ff]">
        <Header />
        <div className="mx-auto max-w-6xl px-4 py-12 text-center text-[#7c8fa8]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00a1e5] border-r-transparent"></div>
          <p className="mt-4 font-medium">Connecting to Boodmo Market...</p>
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
          { label: "Catalog", href: "/category" },
          { label: currentCategoryName },
        ]}
      />
      <div className="boodmo-container py-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <CategorySidebar
            categories={categories}
            currentSlug={slug}
            currentName={currentCategoryName}
          />
          <main className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[var(--boodmo-text)]">{currentCategoryName}</h1>
                <p className="text-sm text-[#7c8fa8]">Total {totalCount} parts</p>
              </div>
              <div className="flex items-center gap-4">
                <select className="rounded border border-[#c4d8f0] bg-white px-3 py-1.5 text-sm text-[var(--boodmo-text)] focus:outline-none">
                  <option>Best match</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <div className="flex rounded border border-[#c4d8f0] bg-white p-1">
                  <button className="rounded bg-[#e2edf7] p-1.5 text-[#00a1e5]">
                    <Icons.grid className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-[#7c8fa8] hover:text-[#00a1e5]">
                    <Icons.list className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {error && (
               <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Icons.info className="w-5 h-5" />
                    <span className="font-bold">Market Access Issue</span>
                  </div>
                  <p className="text-sm">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-3 text-xs font-semibold underline hover:no-underline"
                  >
                    Try again
                  </button>
               </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {products.length === 0 && !error && (
              <div className="rounded-lg border border-[#e2edf7] bg-white p-12 text-center shadow-sm">
                <p className="text-[#7c8fa8]">No parts found in the "{currentCategoryName}" market.</p>
                <a href="/" className="mt-4 inline-block text-sm text-[#00a1e5] hover:underline">
                  Browse other categories
                </a>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
