"use client";

import Link from "next/link";
import {
  IconSearch,
  IconCar,
  IconHeart,
  IconCart,
  IconUser,
  IconMenu,
} from "@/components/ui/Icons";

import { VehicleSearchModal } from "@/components/home/VehicleSearchModal";
import { useEffect, useState, useRef } from 'react';

export function Header() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (term.length < 3) { setResults(null); return; }
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      fetch(`/api/boodmo?action=smartsearch&term=${encodeURIComponent(term)}&languageCode=en`)
        .then((r) => r.json())
        .then((data) => { setResults(data); setIsOpen(true); })
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [term]);

  return (
    <header className="pt-4 pb-8 md:pb-10" style={{ background: "var(--boodmo-header-bg)" }}>
      <div className="boodmo-container" ref={searchRef}>
        {/* Top row */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded px-3 py-1.5" style={{ background: "var(--boodmo-blue)" }}>
              <span className="font-bold text-white">bood</span>
              <span className="font-normal italic text-white">mo</span>
            </div>
          </Link>
          <nav className="flex items-center gap-4 md:gap-6">
            <button className="text-[var(--boodmo-blue)] hover:opacity-80"><IconHeart size={22}/></button>
            <button className="relative text-[var(--boodmo-blue)] hover:opacity-80">
              <IconCart size={22} />
              <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--boodmo-blue)] px-1 text-[10px] font-bold text-white">0</span>
            </button>
            <button className="text-[var(--boodmo-blue)] hover:opacity-80"><IconUser size={22} /></button>
            <button className="text-[var(--boodmo-blue)] hover:opacity-80 md:hidden"><IconMenu size={22} /></button>
          </nav>
        </div>

        {/* Search row */}
        <div className="mt-18 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1 max-w-2xl relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!term.trim()) return;
                setIsModalOpen(true);
              }}
            >
              <div className="flex overflow-hidden rounded-lg border border-[var(--boodmo-border)] bg-white shadow-sm focus-within:ring-2 focus-within:ring-[var(--boodmo-blue)]">
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder='Search: "Maruti Oil Filter"'
                  className="w-full border-0 px-4 py-3 text-[var(--boodmo-text)] focus:outline-none"
                />
                <button 
                  type="submit"
                  className="flex h-12 w-14 items-center justify-center text-white bg-[var(--boodmo-blue)]"
                >
                  <IconSearch size={22} />
                </button>
              </div>
            </form>

            <button
              type="button"
              className="mt-3 flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--boodmo-blue)" }}
            >
              <IconCar size={18} className="text-white" />
			  Add car to my garage
            </button>
          </div>

          <div className="hidden shrink-0 lg:block lg:w-80 xl:w-96">
            <div className="h-40 rounded-lg bg-gradient-to-br from-[var(--boodmo-logo-bg)] to-[var(--boodmo-blue)] opacity-90 xl:h-44" aria-hidden />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <VehicleSearchModal 
          vehicle={{ makerId: "", lineId: "", modelId: "" }} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </header>
  );
}
