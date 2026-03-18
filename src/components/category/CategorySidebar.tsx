"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { slugify } from "@/lib/slug";

interface DualRangeSliderProps {
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
  step?: number;
}

function DualRangeSlider({ min, max, minValue, maxValue, onChange, step = 1 }: DualRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<"min" | "max" | null>(null);
  const [localMin, setLocalMin] = useState(minValue);
  const [localMax, setLocalMax] = useState(maxValue);

  const getPercent = useCallback((value: number) => Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)), [min, max]);

  const getValue = useCallback((percent: number) => {
    const raw = (percent / 100) * (max - min) + min;
    return Math.round(raw / step) * step;
  }, [min, max, step]);

  const handleMouseDown = (type: "min" | "max") => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = type;
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current || !trackRef.current) return;
      
      const rect = trackRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const percent = ((clientX - rect.left) / rect.width) * 100;
      const value = getValue(Math.min(100, Math.max(0, percent)));

      if (isDragging.current === "min") {
        const newMin = Math.min(value, localMax - step);
        setLocalMin(Math.max(min, newMin));
      } else {
        const newMax = Math.max(value, localMin + step);
        setLocalMax(Math.min(max, newMax));
      }
    };

    const handleUp = () => {
      if (isDragging.current) {
        onChange(localMin, localMax);
        isDragging.current = null;
      }
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, [localMin, localMax, min, max, step, getValue, onChange]);

  const minPercent = getPercent(localMin);
  const maxPercent = getPercent(localMax);

  return (
    <div className="space-y-3">
      <div className="relative h-2">
        <div ref={trackRef} className="absolute h-2 w-full rounded-full bg-[#e2edf7]" />
        <div 
          className="absolute h-2 rounded-full bg-[#00a1e5]"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-[#00a1e5] bg-white shadow transition-transform hover:scale-110 focus:outline-none"
          style={{ left: `${minPercent}%` }}
          onMouseDown={handleMouseDown("min")}
          onTouchStart={handleMouseDown("min")}
        />
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-[#00a1e5] bg-white shadow transition-transform hover:scale-110 focus:outline-none"
          style={{ left: `${maxPercent}%` }}
          onMouseDown={handleMouseDown("max")}
          onTouchStart={handleMouseDown("max")}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          value={localMin}
          onChange={(e) => {
            const val = Math.max(min, Math.min(Number(e.target.value), localMax - step));
            setLocalMin(val);
            onChange(val, localMax);
          }}
          className="w-full rounded border border-[#c4d8f0] px-2 py-1.5 text-xs text-[#394b63] focus:outline-none focus:ring-1 focus:ring-[#00a1e5]"
        />
        <span className="text-xs text-[#7c8fa8]">-</span>
        <input
          type="number"
          min={min}
          max={max}
          value={localMax}
          onChange={(e) => {
            const val = Math.min(max, Math.max(Number(e.target.value), localMin + step));
            setLocalMax(val);
            onChange(localMin, val);
          }}
          className="w-full rounded border border-[#c4d8f0] px-2 py-1.5 text-xs text-[#394b63] focus:outline-none focus:ring-1 focus:ring-[#00a1e5]"
        />
      </div>
    </div>
  );
}

export interface SidebarCategory {
  id: number;
  name: string;
  image?: string;
  childs?: SidebarCategory[];
}

export interface Brand {
  id: number;
  name: string;
}

export interface FilterState {
  brandIds: number[];
  minPrice: string;
  maxPrice: string;
}

interface Maker {
  id: string;
  name: string;
}

interface CategorySidebarProps {
  categories: SidebarCategory[];
  makers: Maker[];
  brands: Brand[];
  currentSlug: string;
  currentName: string;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function CategorySidebar({
  categories,
  makers,
  brands,
  currentSlug,
  filters,
  onFilterChange,
}: CategorySidebarProps) {
  const [makerId, setMakerId] = useState("");
  const [lineId, setLineId] = useState("");
  const [modelId, setModelId] = useState("");
  const [configId, setConfigId] = useState("");

  const [lines, setLines] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [configs, setConfigs] = useState<any[]>([]);

  const DEFAULT_MIN_PRICE = 0;
  const DEFAULT_MAX_PRICE = 100000;
  
  const [priceInput, setPriceInput] = useState({ 
    min: filters.minPrice ? Number(filters.minPrice) : DEFAULT_MIN_PRICE, 
    max: filters.maxPrice ? Number(filters.maxPrice) : DEFAULT_MAX_PRICE 
  });

  const handleBrandToggle = (brandId: number) => {
    const newBrandIds = filters.brandIds.includes(brandId)
      ? filters.brandIds.filter(id => id !== brandId)
      : [...filters.brandIds, brandId];
    onFilterChange({ ...filters, brandIds: newBrandIds });
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceInput({ min, max });
  };

  const handlePriceApply = () => {
    onFilterChange({ 
      ...filters, 
      minPrice: priceInput.min === DEFAULT_MIN_PRICE ? "" : String(priceInput.min), 
      maxPrice: priceInput.max === DEFAULT_MAX_PRICE ? "" : String(priceInput.max) 
    });
  };

  const handlePriceClear = () => {
    setPriceInput({ min: DEFAULT_MIN_PRICE, max: DEFAULT_MAX_PRICE });
    onFilterChange({ ...filters, minPrice: "", maxPrice: "" });
  };

  const handleReset = () => {
    setMakerId("");
    setLineId("");
    setModelId("");
    setConfigId("");
    setPriceInput({ min: DEFAULT_MIN_PRICE, max: DEFAULT_MAX_PRICE });
    onFilterChange({ brandIds: [], minPrice: "", maxPrice: "" });
  };

  useEffect(() => {
    if (!makerId) {
      setLines([]);
      return;
    }
    fetch(`/api/boodmo?action=lines&makerId=${makerId}`)
      .then((r) => r.json())
      .then((data) => setLines(data.data || data.items || data || []));
  }, [makerId]);

  useEffect(() => {
    if (!lineId || !makerId) {
      setModels([]);
      return;
    }
    fetch(`/api/boodmo?action=models&makerId=${makerId}&lineId=${lineId}`)
      .then((r) => r.json())
      .then((data) => setModels(data.data || data.items || data || []));
  }, [lineId, makerId]);

  useEffect(() => {
    if (!modelId || !lineId || !makerId) {
      setConfigs([]);
      return;
    }
    fetch(`/api/boodmo?action=configs&makerId=${makerId}&lineId=${lineId}&modelId=${modelId}`)
      .then((r) => r.json())
      .then((data) => setConfigs(data.data || data.items || data || []));
  }, [modelId, lineId, makerId]);

  return (
    <aside className="w-full shrink-0 md:w-56 lg:w-64">
      <div className="sticky top-4 space-y-6 rounded border border-[#e2edf7] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#394b63]">Filters</h3>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-[#7c8fa8] hover:text-[#0056a6]"
          >
            RESET
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#394b63]">
              Vehicle
            </label>
            <select 
              value={makerId}
              onChange={(e) => { setMakerId(e.target.value); setLineId(""); setModelId(""); setConfigId(""); }}
              className="w-full rounded border border-[#c4d8f0] bg-white px-3 py-2 text-xs text-[#394b63] focus:outline-none focus:ring-1 focus:ring-[#00a1e5]"
            >
              <option value="">Choose car maker</option>
              {makers.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          {makerId && (
            <select 
              value={lineId}
              onChange={(e) => { setLineId(e.target.value); setModelId(""); setConfigId(""); }}
              className="w-full rounded border border-[#c4d8f0] bg-white px-3 py-2 text-xs text-[#394b63] focus:outline-none focus:ring-1 focus:ring-[#00a1e5]"
            >
              <option value="">Choose model line</option>
              {lines.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          )}
          {lineId && (
            <select 
              value={modelId}
              onChange={(e) => { setModelId(e.target.value); setConfigId(""); }}
              className="w-full rounded border border-[#c4d8f0] bg-white px-3 py-2 text-xs text-[#394b63] focus:outline-none focus:ring-1 focus:ring-[#00a1e5]"
            >
              <option value="">Choose year/model</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          )}
          {modelId && configs.length > 0 && (
            <select 
              value={configId}
              onChange={(e) => setConfigId(e.target.value)}
              className="w-full rounded border border-[#c4d8f0] bg-white px-3 py-2 text-xs text-[#394b63] focus:outline-none focus:ring-1 focus:ring-[#00a1e5]"
            >
              <option value="">Choose modification</option>
              {configs.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Brand Filter */}
        {brands.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-[#394b63]">
              Brand
            </h3>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {brands.slice(0, 15).map((brand) => (
                <label
                  key={brand.id}
                  className="flex cursor-pointer items-center gap-2 text-xs text-[#394b63] hover:text-[#00a1e5]"
                >
                  <input
                    type="checkbox"
                    checked={filters.brandIds.includes(brand.id)}
                    onChange={() => handleBrandToggle(brand.id)}
                    className="rounded border-[#c4d8f0] text-[#00a1e5] focus:ring-[#00a1e5]"
                  />
                  {brand.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Filter */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[#394b63]">
            Price
          </h3>
          <DualRangeSlider
            min={DEFAULT_MIN_PRICE}
            max={DEFAULT_MAX_PRICE}
            minValue={priceInput.min}
            maxValue={priceInput.max}
            onChange={handlePriceChange}
            step={100}
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handlePriceApply}
              className="flex-1 rounded bg-[#00a1e5] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0088cc]"
            >
              Apply
            </button>
            {(filters.minPrice || filters.maxPrice) && (
              <button
                type="button"
                onClick={handlePriceClear}
                className="flex-1 rounded border border-[#c4d8f0] px-3 py-1.5 text-xs font-semibold text-[#7c8fa8] hover:text-[#394b63]"
              >
                Clear
              </button>
            )}
          </div>
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


