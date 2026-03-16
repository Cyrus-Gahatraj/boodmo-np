import Link from "next/link";
import { slugify } from "@/lib/slug";

const ASSET_BASE = "https://demoapi.boodmo.in";

export interface GridItem {
  id: number;
  name: string;
  image?: string;
  childs?: unknown[];
}

interface CategoryGridProps {
  title: string;
  items: GridItem[];
}

export function CategoryGrid({ title, items }: CategoryGridProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#394b63] md:text-3xl">
        {title.split(" ").slice(0, -1).join(" ")}{" "}
        <span className="text-[#00a1e5]">
          {title.split(" ").slice(-1)[0]}
        </span>
      </h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => {
          const isLeaf = !item.childs || item.childs.length === 0;
          const href = isLeaf 
            ? `/catalog/${slugify(item.name)}` 
            : `/category/${slugify(item.name)}`;
            
          return (
            <Link
              key={item.id}
              href={href}
              className="flex flex-col items-center rounded border border-[#e2edf7] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 flex h-24 w-24 items-center justify-center overflow-hidden rounded bg-[#f5f9ff]">
                {item.image ? (
                  <img
                    src={`${ASSET_BASE}/${item.image}`}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-3xl text-[#c4d8f0]">⚙️</span>
                )}
              </div>
              <span className="line-clamp-2 text-center text-xs font-semibold text-[#394b63]">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
