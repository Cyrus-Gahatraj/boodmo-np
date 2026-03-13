import { useState } from "react";

const API_BASE_URL = "/api/boodmo";

interface Brand { 
	id: number;
	name: string;
	slug?: string;
}

export function BrandList() {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [brandsLoading, setBrandsLoading] = useState(false);
	const [brandsError, setBrandsError] = useState("");

	const fetchBrands = async () => {
		setBrandsLoading(true);
		setBrandsError("");

		try {
			const response = await fetch(`${API_BASE_URL}?action=brands`, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setBrands(data.results || data.brands || data || []);
		} catch (error) {
			setBrandsError(error instanceof Error ? error.message : "Failed to fetch brands");
		} finally {
			setBrandsLoading(false);
		}
	}

		return (
			<section className="bg-white pb-12 pt-4">
			<div className="mx-auto max-w-6xl px-4">
			<div className="mb-4 flex items-center justify-between gap-4">
			<div className="flex items-baseline gap-2">
			<h2 className="text-lg font-semibold text-[#394b63]">Brands</h2>
			<span className="text-xs font-medium text-[#7c8fa8]">
			(from API)
			</span>
			</div>
			<button
			onClick={fetchBrands}
			disabled={brandsLoading}
			className="h-9 rounded bg-[#0056a6] px-4 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-60"
			>
			{brandsLoading ? "Loading..." : "Fetch Brands"}
			</button>
			</div>

			{brandsError && (
				<div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
				{brandsError}
				</div>
			)}

			{brands.length > 0 ? (
				<div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
				{brands.slice(0, 18).map((brand) => (
					<div
					key={brand.id}
					className="rounded border border-[#e2edf7] bg-white px-3 py-3 text-center text-xs font-semibold text-[#394b63] shadow-sm"
					>
					{brand.name}
					</div>
				))}
				</div>
			) : (
			<div className="rounded border border-[#e2edf7] bg-[#f5f9ff] p-4 text-sm text-[#7c8fa8]">
			Click <span className="font-semibold">Fetch Brands</span> to load
			the list.
				</div>
			)}
			</div>
			</section>
		);
}
