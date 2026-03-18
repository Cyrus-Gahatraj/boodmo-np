"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { slugify } from "@/lib/slug";

export interface SidebarCategory {
  id: number;
  name: string;
  image?: string;
  childs?: SidebarCategory[];
}

interface Maker {
  id: string;
  name: string;
}

interface CategorySidebarProps {
  categories: SidebarCategory[];
  makers: Maker[];
  currentSlug: string;
  currentName: string;
}

export function CategorySidebar({
  categories,
  makers,
  currentSlug,
}: CategorySidebarProps) {
  const [makerId, setMakerId] = useState("");
  const [lineId, setLineId] = useState("");
  const [modelId, setModelId] = useState("");
  const [configId, setConfigId] = useState("");

  const [lines, setLines] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [configs, setConfigs] = useState<any[]>([]);

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

  const handleReset = () => {
    setMakerId("");
    setLineId("");
    setModelId("");
    setConfigId("");
  };

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


