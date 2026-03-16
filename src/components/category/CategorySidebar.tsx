"use client";

import Link from "next/link";
import { slugify } from "@/lib/slug";

export interface SidebarCategory {
  id: number;
  name: string;
  image?: string;
  childs?: SidebarCategory[];
}

interface CategorySidebarProps {
  categories: SidebarCategory[];
  currentSlug: string;
  currentName: string;
}

export function CategorySidebar({
  categories,
  currentSlug,
  currentName,
}: CategorySidebarProps) {
  return (
    <aside className="w-full shrink-0 md:w-56 lg:w-64">
      <div className="sticky top-4 space-y-6 rounded border border-[#e2edf7] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#394b63]">Filters</h3>
          <button
            type="button"
            className="text-xs text-[#7c8fa8] hover:text-[#0056a6]"
          >
            RESET
          </button>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#394b63]">
            Vehicle
          </label>
          <select className="w-full rounded border border-[#c4d8f0] bg-white px-3 py-2 text-xs text-[#394b63] focus:outline-none focus:ring-1 focus:ring-[#00a1e5]">
            <option>Choose car maker</option>
          </select>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[#394b63]">
            Category
          </h3>
          <ul className="max-h-[60vh] space-y-0.5 overflow-y-auto">
            {categories.map((cat) => {
              const slug = slugify(cat.name);
              const isActive = slug === currentSlug;
              const hasChildren = cat.childs && cat.childs.length > 0;
              const href = hasChildren ? `/category/${slug}` : `/catalog/${slug}`;

              return (
                <li key={cat.id}>
                  <Link
                    href={href}
                    className={`block rounded px-3 py-2 text-xs ${
                      isActive
                        ? "bg-[#e2edf7] font-semibold text-[#0056a6]"
                        : "text-[#394b63] hover:bg-[#f5f9ff] hover:text-[#0056a6]"
                    }`}
                  >
                    {cat.name}
                  </Link>
                  {isActive && hasChildren && (
                    <ul className="ml-3 mt-1 space-y-0.5 border-l border-[#e2edf7] pl-3">
                      {cat.childs!.map((child) => {
                        const childSlug = slugify(child.name);
                        const childHasChildren = child.childs && child.childs.length > 0;
                        const childHref = childHasChildren 
                          ? `/category/${childSlug}` 
                          : `/catalog/${childSlug}`;

                        return (
                          <li key={child.id}>
                            <Link
                              href={childHref}
                              className="block py-1.5 text-xs text-[#7c8fa8] hover:text-[#00a1e5]"
                            >
                              {child.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}

          </ul>
        </div>
      </div>
    </aside>
  );
}
