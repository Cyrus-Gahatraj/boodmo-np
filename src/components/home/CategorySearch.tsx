import { categories } from "./data";

export function CategorySearch() {
  return (
    <section className="bg-white pb-12 pt-6">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-baseline gap-2">
          <h2 className="text-lg font-semibold text-[#394b63]">Search by</h2>
          <span className="text-lg font-semibold text-[#00a1e5]">Category</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="flex h-32 flex-col items-center justify-center gap-3 
			  rounded border border-[#e2edf7] bg-white text-center shadow-sm transition hover:-translate-y-[1px] hover:shadow-md"
            >
              <div className="text-3xl">{cat.icon}</div>
              <span className="px-2 text-xs font-semibold text-[#394b63]">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <button className="rounded border border-[#c4d8f0] px-4 py-2 text-xs font-semibold text-[#394b63] hover:bg-[#f5f9ff]">
            Load more
          </button>
        </div>
      </div>
    </section>
  );
}

