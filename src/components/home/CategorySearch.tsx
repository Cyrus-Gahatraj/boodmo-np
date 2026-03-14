"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { slugify } from "@/lib/slug";

const ASSET_BASE = "https://demoapi.boodmo.in";
const API_BASE_URL = "/api/boodmo";

export interface Category {
  id: number;
  name: string;
  image: string;
  childs: unknown;
}

export function CategorySearch() {
  const [category, setCategory] = useState<Category[]>([]);
  const [categoryError, setCategoryError] = useState("");
  const [categoryLen, setCategoryLen] = useState(8);
  const [categoryFull, setCategoryFull] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      setCategoryError("");
      try {
        const response = await fetch(`${API_BASE_URL}?action=categories`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCategory(data.results || data.brands || data || []);
      } catch (error) {
        setCategoryError(
          error instanceof Error ? error.message : "Failed to fetch categories"
        );
      }
    };
    fetchCategory();
  }, []);

  const toggleFull = () => {
    setCategoryFull(!categoryFull);
    setCategoryLen(categoryFull ? 8 : category.length);
  };

  const displayCategories = category.slice(0, categoryLen);

  return (
    <section className="bg-white py-10">
      <div className="boodmo-container">
        <h2
          className="mb-6 text-3xl font-semibold"
          style={{ color: "var(--boodmo-blue)" }}
        >
          Search by <span style={{color: "var(--boodmo-blue-light)"}}>Category</span>
        </h2>
        {categoryError && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {categoryError}
          </div>
        )}
        {category.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {displayCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${slugify(cat.name)}`}
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
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={toggleFull}
                className="rounded border border-[var(--boodmo-border)] px-5 py-2 text-sm font-medium text-[var(--boodmo-text-muted)] hover:bg-gray-50"
              >
                {categoryFull ? "Hide" : "View More"}
              </button>
            </div>
          </>
        ) : (
          <div
            className="rounded-lg border p-4 text-sm"
            style={{
              borderColor: "var(--boodmo-border)",
              color: "var(--boodmo-text-muted)",
            }}
          >
            No categories to load.
          </div>
        )}
      </div>
    </section>
  );
}
