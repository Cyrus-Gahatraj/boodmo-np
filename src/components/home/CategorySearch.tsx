import { useState, useEffect } from "react";
import Link from "next/link";
import { slugify } from "@/lib/slug";

const ASSET_BASE = "https://demoapi.boodmo.in";
const API_BASE_URL = "/api/boodmo";

export interface Category {
  id: number;
  name: string;
  image: string;
  childs: any;
}

export function CategorySearch() {
	const [category, setCategory] = useState<Category[]>([]);
	const [categoryError, setCategoryError] = useState("");
	const [categoryLen, setCategoryLen] = useState(5);
	const [categoryFull, setCategoryFull] = useState(false);

	useEffect(() => {
		const fetchCategory = async () => {
			setCategoryError("");

			try {
				const response = await fetch(`${API_BASE_URL}?action=categories`, {
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				setCategory(data.results || data.brands || data || []);
			} catch (error) {
				setCategoryError(error instanceof Error ? error.message : "Failed to fetch brands");
			}
		}

		fetchCategory();
	}, []);

	const toggleFull = ()=> {
		setCategoryFull(!categoryFull);
		if (categoryLen == category.length) setCategoryLen(5);
		else setCategoryLen(category.length)
	}

  return (
    <section className="bg-white gap-4 pb-12 pt-6">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-baseline gap-2">
          <h2 className="text-lg font-semibold text-[#394b63]">Search by</h2>
          <span className="text-lg font-semibold text-[#00a1e5]">Category</span>
        </div>
		{categoryError && (
			<div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
			{categoryError}
			</div>
		)}

		{category.length > 0 ? (

			<div className="grid gap-4 md:grid-cols-0 lg:grid-cols-5">
			{category.slice(0, categoryLen).map((cat) => (
				<Link
				key={cat.id}
				href={`/category/${slugify(cat.name)}`}
				className="flex h-55 w-40 flex-col items-center justify-center gap-3 
				rounded border border-[#e2edf7] bg-white text-center shadow-sm transition hover:-translate-y-[1px] hover:shadow-md"
				>
				{cat.image ? (
					<img
					src={`${ASSET_BASE}/${cat.image}`}
					alt={cat.name}
					className="max-h-full max-w-full mt-4 object-contain"
					/>
				) : (
					<div className="text-xs text-gray-400">No Image</div>
				)}
				<span className="line-clamp-2 px-2 text-[10px] font-bold uppercase tracking-tight text-[#394b63]">
					{cat.name}
				</span>
				</Link>
			))}
			</div>
		) : (
			<div className="rounded border border-[#e2edf7] bg-[#f5f9ff] p-4 text-sm text-[#7c8fa8]">
				There was <span className="font-semibold">no Category</span> to load
				the list.
			</div>
			)}

        <div className="mt-6 flex justify-center">
          <button 
		  className="rounded border border-[#c4d8f0] px-4 py-2 text-xs font-semibold text-[#394b63] hover:bg-[#f5f9ff]"
		  onClick={toggleFull}
		  >
		  {!categoryFull ? (
				  <p>Load more</p>
			  ):(
				  <p>Hide</p>
			  )
		  }
          </button>
        </div>
      </div>
    </section>
  );
}

