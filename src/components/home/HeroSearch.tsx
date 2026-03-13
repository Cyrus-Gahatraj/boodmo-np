export function HeroSearch() {
  return (
    <section className="bg-[#00a1e5] pb-10 pt-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="rounded bg-white/95 px-4 py-3 shadow-md md:px-6 md:py-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder='Search: "Maruti Oil Filter"'
                className="w-full border-none text-sm text-[#3b4b63] placeholder:text-[#9fb3cf] focus:outline-none"
              />
              <button className="grid h-9 w-9 place-items-center text-white md:h-10 md:w-10">
                🔍
              </button>
            </div>
          </div>
          <button className="mt-4 inline-flex items-center gap-2 rounded bg-[#0056a6] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md">
            <span>🚗</span>
            <span>Add car to my garage</span>
          </button>
        </div>
        <div className="flex-1">
          <div className="h-40 rounded bg-[#00aee8] bg-gradient-to-br from-[#00a1e5] to-[#00c7ff] shadow-lg md:h-44" />
        </div>
      </div>
    </section>
  );
}

