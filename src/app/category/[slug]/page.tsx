"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { Header } from "@/components/home/Header";
import { Breadcrumbs } from "@/components/category/Breadcrumbs";
import {
  CategorySidebar,
  type SidebarCategory,
} from "@/components/category/CategorySidebar";
import {
  CategoryGrid,
  type GridItem,
} from "@/components/category/CategoryGrid";
import { CategorySeoContent } from "@/components/category/CategorySeoContent";
import { ProductCard, type Product } from "@/components/category/ProductCard";
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

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const title = slug ? slugToTitle(slug) : "Category";
  const vehicleMakerId = searchParams.get("makerId");
  const vehicleLineId = searchParams.get("lineId");
  const vehicleModelId = searchParams.get("modelId");
  const vehicleConfigId = searchParams.get("configId");
  const hasVehicleFilter = Boolean(vehicleMakerId && vehicleLineId && vehicleModelId);

  const [categories, setCategories] = useState<SidebarCategory[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [makers, setMakers] = useState<any[]>([]);
  const [topParts, setTopParts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [partsLoading, setPartsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const fetchInitialData = async () => {
      try {
        const [catRes, brandRes, makerRes] = await Promise.all([
          fetch(`${API_BASE}?action=categories`),
          fetch(`${API_BASE}?action=brands`),
          fetch(`${API_BASE}?action=makers`),
        ]);

        if (cancelled) return;

        const [catData, brandData, makerData] = await Promise.all([
          catRes.json(),
          brandRes.json(),
          makerRes.json(),
        ]);

        setCategories(normalizeCategories(catData));
        setBrands(brandData.results || brandData.brands || brandData || []);
        setMakers(makerData.data || makerData.items || makerData || []);
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to load initial data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchInitialData();
    return () => {
      cancelled = true;
    };
  }, []);

  const currentCategory = useMemo(() => {
    return slug ? findCategoryBySlug(categories, slug) : null;
  }, [categories, slug]);

  const gridItems = useMemo(() => {
    if (!currentCategory) return [] as GridItem[];
    const childs = (currentCategory.childs as GridItem[] | undefined) || [];
    return childs.length > 0
      ? childs
      : [{ id: currentCategory.id, name: currentCategory.name, image: currentCategory.image }];
  }, [currentCategory]);

  useEffect(() => {
    if (!currentCategory) return;

    let cancelled = false;
    setPartsLoading(true);
    
    fetch(`${API_BASE}?action=collection&categoryId=${currentCategory.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const rawParts = data.items || [];
        const mappedProducts: Product[] = rawParts.slice(0, 6).map((p: any) => ({
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
        setTopParts(mappedProducts);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setPartsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f9ff]">
        <Header />
        <div className="mx-auto max-w-6xl px-4 py-12 text-center text-[#7c8fa8]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00a1e5] border-r-transparent"></div>
          <p className="mt-4 font-medium">Loading Category...</p>
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
          { label: currentCategory?.name ?? title },
        ]}
      />
      <div className="boodmo-container py-6">
        {hasVehicleFilter && (
          <p className="mb-4 rounded-lg border border-[var(--boodmo-border)] bg-[var(--boodmo-header-bg)] px-4 py-2 text-sm text-[var(--boodmo-text)]">
            Showing parts for your selected vehicle.
          </p>
        )}
        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-8 lg:flex-row">
          <CategorySidebar
            categories={categories}
            makers={makers}
            currentSlug={slug}
            currentName={currentCategory?.name ?? title}
          />
          <main className="min-w-0 flex-1 space-y-10">
            {currentCategory ? (
              <>
                <CategoryGrid
                  title={currentCategory.name}
                  items={gridItems}
                />

                {/* Top Parts Section */}
                {topParts.length > 0 && (
                  <section>
                    <h2 className="mb-6 text-xl font-bold text-[var(--boodmo-text)]">
                      Top parts in <span className="text-[#00a1e5]">{currentCategory.name}</span>
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {topParts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Shop by Brand Section */}
                {brands.length > 0 && (
                  <section>
                    <h2 className="mb-6 text-xl font-bold text-[var(--boodmo-text)]">
                      Shop by <span className="text-[#00a1e5]">Brand</span>
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {brands.slice(0, 15).map((brand) => (
                        <div
                          key={brand.id}
                          className="flex items-center justify-center rounded-lg border border-[#e2edf7] bg-white px-4 py-2 text-sm font-semibold text-[#394b63] shadow-sm transition hover:border-[#00a1e5] hover:text-[#00a1e5]"
                        >
                          {brand.name}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Popular Car Makers Section */}
                {makers.length > 0 && (
                  <section>
                    <h2 className="mb-6 text-xl font-bold text-[var(--boodmo-text)]">
                      Popular <span className="text-[#00a1e5]">Car Makers</span>
                    </h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
                      {makers.slice(0, 12).map((maker) => (
                        <div
                          key={maker.id}
                          className="flex items-center justify-center rounded-lg border border-[#e2edf7] bg-white px-3 py-3 text-xs font-bold uppercase text-[#394b63] shadow-sm transition hover:border-[#00a1e5] hover:text-[#00a1e5]"
                        >
                          {maker.name}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <CategorySeoContent categoryName={currentCategory.name} />
              </>
            ) : (
              <div className="rounded border border-[#e2edf7] bg-white p-8 text-center">
                <p className="text-[#7c8fa8]">
                  Category not found. Try another from the sidebar or{" "}
                  <Link href="/" className="text-[#00a1e5] hover:underline">
                    go home
                  </Link>
                  .
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

