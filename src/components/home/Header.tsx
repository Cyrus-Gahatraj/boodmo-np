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

export function Header() {
  return (
    <header
      className="pt-4 pb-8 md:pb-10"
      style={{ background: "var(--boodmo-header-bg)" }}
    >
      <div className="boodmo-container">
        {/* Top row: logo + nav icons */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="rounded px-3 py-1.5"
              style={{ background: "var(--boodmo-blue)" }}
            >
              <span className="font-bold text-white">bood</span>
              <span className="font-normal italic text-white">mo</span>
            </div>
          </Link>
          <nav className="flex items-center gap-4 md:gap-6">
            <button
              type="button"
              className="text-white hover:opacity-90"
              aria-label="Wishlist"
            >
              <IconHeart size={22} />
            </button>
            <button
              type="button"
              className="relative text-white hover:opacity-90"
              aria-label="Cart"
            >
              <IconCart size={22} />
              <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[var(--boodmo-blue)]">
                0
              </span>
            </button>
            <button
              type="button"
              className="text-white hover:opacity-90"
              aria-label="Account"
            >
              <IconUser size={22} />
            </button>
            <button
              type="button"
              className="text-white hover:opacity-90 md:hidden"
              aria-label="Menu"
            >
              <IconMenu size={22} />
            </button>
          </nav>
        </div>

        {/* Search row: input + search button, then ADD A VEHICLE + engine image */}
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1 max-w-2xl">
            <div className="flex overflow-hidden rounded-lg border border-[var(--boodmo-border)] bg-white shadow-sm">
              <input
                type="text"
                placeholder="All Auto Parts"
                className="w-full border-0 px-4 py-3 text-[var(--boodmo-text)] placeholder:text-[var(--boodmo-text-muted)] focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                className="flex h-12 w-14 shrink-0 items-center justify-center text-white hover:opacity-95"
                style={{ background: "var(--boodmo-blue)" }}
                aria-label="Search"
              >
                <IconSearch size={22} className="text-white" />
              </button>
            </div>
            <button
              type="button"
              className="mt-3 flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white"
              style={{ background: "var(--boodmo-blue)" }}
            >
              <IconCar size={18} className="text-white" />
              Add A Vehicle To Start
            </button>
          </div>
          <div className="hidden shrink-0 lg:block lg:w-80 xl:w-96">
            <div
              className="h-40 rounded-lg bg-gradient-to-br from-[var(--boodmo-logo-bg)] to-[var(--boodmo-blue)] opacity-90 xl:h-44"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </header>
  );
}
