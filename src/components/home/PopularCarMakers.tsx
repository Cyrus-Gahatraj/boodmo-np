import Link from "next/link";

const makers = [
  "MARUTI",
  "HYUNDAI",
  "TATA",
  "MAHINDRA",
  "CHEVROLET",
  "FORD",
  "HONDA",
  "TOYOTA",
];

export function PopularCarMakers() {
  return (
    <section className="bg-white py-10">
      <div className="boodmo-container">
        <div className="mb-6 flex items-center justify-between">
          <h2
            className="text-3xl font-semibold"
            style={{ color: "var(--boodmo-blue)" }}
          >
            Popular <span style={{ color: "var(--boodmo-blue-light)" }}>Car Makers</span>
          </h2>
          
          <Link
            href="/vehicles"
            className="text-sm font-medium transition hover:underline"
            style={{ color: "var(--boodmo-blue-light)" }}
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8">
          {makers.map((name) => (
            <button
              key={name}
              type="button"
              className="rounded-lg border border-[var(--boodmo-border)] bg-white px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--boodmo-text)] hover:bg-gray-50"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
