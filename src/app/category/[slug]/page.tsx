"use client";

import { useParams } from "next/navigation";
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
  const slug = typeof params.slug === "string" ? params.slug : "";
  const title = slug ? slugToTitle(slug) : "Category";

  const [categories, setCategories] = useState<SidebarCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(`${API_BASE}?action=categories`, {
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setCategories(normalizeCategories(data));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load categories");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { currentCategory, gridItems } = useMemo(() => {
    const current = slug ? findCategoryBySlug(categories, slug) : null;
    if (!current) {
      return {
        currentCategory: null,
        gridItems: [] as GridItem[],
      };
    }
    const childs = (current.childs as GridItem[] | undefined) || [];
    const items: GridItem[] =
      childs.length > 0
        ? childs
        : [{ id: current.id, name: current.name, image: current.image }];
    return { currentCategory: current, gridItems: items };
  }, [categories, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f9ff]">
        <Header />
        <div className="mx-auto max-w-6xl px-4 py-12 text-center text-[#7c8fa8]">
          Loading…
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
        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-8 lg:flex-row">
          <CategorySidebar
            categories={categories}
            currentSlug={slug}
            currentName={currentCategory?.name ?? title}
          />
          <main className="min-w-0 flex-1">
            {currentCategory ? (
              <>
                <CategoryGrid
                  title={currentCategory.name}
                  items={gridItems}
                />
                <CategorySeoContent categoryName={currentCategory.name} />
              </>
            ) : (
              <div className="rounded border border-[#e2edf7] bg-white p-8 text-center">
                <p className="text-[#7c8fa8]">
                  Category not found. Try another from the sidebar or{" "}
                  <a href="/" className="text-[#00a1e5] hover:underline">
                    go home
                  </a>
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
