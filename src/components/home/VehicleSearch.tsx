export function VehicleSearch() {
  return (
    <section className="bg-white pb-10 pt-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg font-semibold text-[#394b63]">Search by</h2>
            <span className="text-lg font-semibold text-[#00a1e5]">Vehicle</span>
          </div>
          <div className="text-xs font-medium text-[#7c8fa8]">
            Search by number plate:
            <input
              type="text"
              placeholder="DL1AA2345"
              className="ml-2 inline-flex h-8 w-28 items-center rounded border border-[#c4d8f0] bg-[#f5f9ff] px-2 text-center text-xs tracking-[0.25em] text-[#394b63] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded border border-[#c4d8f0] bg-[#0056a6] shadow-sm">
          <div className="flex flex-col gap-3 px-4 py-4 md:flex-row">
            <select className="h-10 flex-1 rounded border border-[#c4d8f0] bg-white px-3 text-xs text-[#394b63] focus:outline-none">
              <option>Select Car Maker</option>
            </select>
            <select className="h-10 flex-1 rounded border border-[#c4d8f0] bg-white px-3 text-xs text-[#394b63] focus:outline-none">
              <option>Select Model Line</option>
            </select>
            <select className="h-10 flex-1 rounded border border-[#c4d8f0] bg-white px-3 text-xs text-[#394b63] focus:outline-none">
              <option>Select Year</option>
            </select>
            <select className="h-10 flex-1 rounded border border-[#c4d8f0] bg-white px-3 text-xs text-[#394b63] focus:outline-none">
              <option>Select Modification</option>
            </select>
            <button className="h-10 rounded bg-[#ff8a00] px-4 text-xs font-semibold uppercase tracking-wide text-white">
              Search Parts
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

