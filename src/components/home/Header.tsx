export function Header() {
  return (
    <header className="bg-[#0056a6] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="rounded bg-white px-3 py-1 text-sm font-bold uppercase tracking-[0.08em] text-[#0056a6]">
            boodmo
          </div>
          <span className="text-[11px] uppercase tracking-[0.18em] text-[#b9dcff]">
            spare parts expert
          </span>
        </div>
        <nav className="hidden items-center gap-6 text-xs font-semibold md:flex">
          <button className="hover:text-[#b9dcff]">My Garage</button>
          <button className="hover:text-[#b9dcff]">My Account</button>
          <button className="hover:text-[#b9dcff]">Cart</button>
        </nav>
      </div>
    </header>
  );
}

