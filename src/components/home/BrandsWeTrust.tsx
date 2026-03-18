"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/Icons";

const API_BASE_URL = "/api/boodmo";
const ASSET_BASE = "https://demoapi.boodmo.in";

interface Brand {
	id: number;
	name: string;
	slug?: string;
	image?: string;
}

const BRANDS_PER_PAGE = 6;
const TOTAL_BRANDS = 24;
const TOTAL_PAGES = Math.ceil(TOTAL_BRANDS / BRANDS_PER_PAGE);

export function BrandsWeTrust() {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		let mounted = true;

		const fetchBrands = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}?action=brands`, {
					headers: { "Content-Type": "application/json" },
				});

				if (!response.ok) throw new Error("Failed");

				const data = await response.json();
				if (mounted) {
					const brandList = data.results || data.brands || data || [];
					setBrands(brandList);
				}
			} catch (err) {
				if (mounted) setError("Could not load brands");
			} finally {
				if (mounted) setLoading(false);
			}
		};

		fetchBrands();

		return () => { mounted = false; };
	}, []);

	useEffect(() => {
		if (brands.length === 0 || loading) return;

		intervalRef.current = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % TOTAL_PAGES);
		}, 3000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [brands.length, loading]);

	const visibleBrands = useMemo(() => {
		if (brands.length === 0) return [];

		const extended: Brand[] = [];
		let i = 0;
		while (extended.length < TOTAL_BRANDS && brands.length > 0) {
			extended.push(brands[i % brands.length]);
			i++;
		}

		return extended.slice(
			currentIndex * BRANDS_PER_PAGE,
			(currentIndex + 1) * BRANDS_PER_PAGE
		);
	}, [brands, currentIndex]);

	const handlePrevious = useCallback(() => {
		setCurrentIndex((prev) => (prev - 1 + TOTAL_PAGES) % TOTAL_PAGES);
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = setInterval(() => {
				setCurrentIndex((prev) => (prev + 1) % TOTAL_PAGES);
			}, 3000);
		}
	}, []);

	const handleNext = useCallback(() => {
		setCurrentIndex((prev) => (prev + 1) % TOTAL_PAGES);
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = setInterval(() => {
				setCurrentIndex((prev) => (prev + 1) % TOTAL_PAGES);
			}, 3000);
		}
	}, []);

	const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
		const img = e.currentTarget;
		img.style.display = 'none';
		const parent = img.parentElement;
		if (parent) {
			const fallback = document.createElement('div');
			fallback.className = "fallback flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold";
			fallback.style.background = "#f3f4f6";
			fallback.style.color = "#374151";
			fallback.textContent = img.alt.charAt(0).toUpperCase();
			parent.appendChild(fallback);
		}
	}, []);

	if (error) {
		return (
			<section className="bg-white py-16">
			<div className="boodmo-container">
			<p className="text-sm text-red-600">{error}</p>
			</div>
			</section>
		);
	}

	return (
		<section className="bg-white py-16">
		<div className="boodmo-container">
		{/* Header */}
		<div className="mb-10 flex items-center justify-between">
		<h2 
		className="text-3xl font-semibold"
		style={{ color: "var(--boodmo-blue)" }}
		>
		Brands we <span style={{ color: "var(--boodmo-blue-light)" }}>Trust</span>
		<div className="ml-4 inline-flex items-center gap-1">
		<button
		type="button"
		className="rounded-full text-[var(--boodmo-text-muted)] transition hover:bg-gray-100 hover:text-[var(--boodmo-text)] disabled:opacity-50"
		aria-label="Previous"
		onClick={handlePrevious}
		disabled={loading || brands.length === 0}
		>
		<IconChevronLeft size={20} />
		</button>
		<button
		type="button"
		className="rounded-full p-2 text-[var(--boodmo-text-muted)] transition hover:bg-gray-100 hover:text-[var(--boodmo-text)] disabled:opacity-50"
		aria-label="Next"
		onClick={handleNext}
		disabled={loading || brands.length === 0}
		>
		<IconChevronRight size={20} />
		</button>
		</div>
		</h2>

		{brands.length > 0 && (
			<Link
			href="/brands"
			className="text-sm font-medium transition hover:underline"
			style={{ color: "var(--boodmo-blue-light)" }}
			>
			View All
			</Link>
		)}
		</div>        

		{/* Brands Grid */}
		{loading ? (
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
			{[...Array(BRANDS_PER_PAGE)].map((_, i) => (
				<div
				key={i}
				className="flex flex-col items-center justify-center rounded-lg border border-[var(--boodmo-border)] bg-[var(--boodmo-header-bg)] p-6"
				>
				<div className="h-16 w-16 animate-pulse rounded-full bg-gray-200" />
				</div>
			))}
			</div>
		) : visibleBrands.length > 0 ? (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
		{visibleBrands.map((b, idx) => (
			<div
			key={`${b.id}-${idx}`}
			className="flex flex-col items-center justify-center rounded-lg border border-[var(--boodmo-border)] bg-white p-6 transition-all hover:border-gray-200 hover:shadow-md"
			>
			{b.image ? (
				<img
				src={`${ASSET_BASE}/${b.image}`}
				alt={b.name}
				className="h-16 w-16 object-contain transition-transform hover:scale-110"
				loading="lazy"
				onError={handleImageError}
				/>
			) : (
			<div
			className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
			style={{ background: "var(--boodmo-header-bg)", color: "var(--boodmo-text-muted)" }}
			>
			{b.name?.charAt(0)?.toUpperCase() || '?'}
			</div>
			)}
			<span 
			className="mt-3 text-center text-sm font-medium"
			style={{ color: "var(--boodmo-text)" }}
			>
			{b.name}
			</span>
			</div>
		))}
		</div>
		) : (
		<p className="text-sm" style={{ color: "var(--boodmo-text-muted)" }}>No brands available</p>
		)}

		{/* Pagination Dots */}
		{brands.length > 0 && !loading && (
			<div className="mt-8 flex justify-center gap-2">
			{[...Array(TOTAL_PAGES)].map((_, i) => (
				<button
				key={i}
				onClick={() => setCurrentIndex(i)}
				className={`h-2 rounded-full transition-all ${
					i === currentIndex 
						? "w-6" 
						: "w-2 hover:bg-gray-400"
				}`}
				style={{
					backgroundColor: i === currentIndex ? "var(--boodmo-blue-light)" : "var(--boodmo-border)"
				}}
				aria-label={`Go to page ${i + 1}`}
				/>
			))}
			</div>
		)}
		</div>
		</section>
	);
}
