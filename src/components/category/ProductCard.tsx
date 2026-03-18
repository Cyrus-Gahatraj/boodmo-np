"use client";

import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/ui/Icons";

export interface Product {
  id: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  brand: string;
  partNumber: string;
  image: string;
  isFulfilledByBoodmo?: boolean;
  isBoodmosChoice?: boolean;
  hasFreeDelivery?: boolean;
  tag?: string;
}

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (viewMode === "list") {
    return (
      <Link 
        href={`/parts/${product.id}`}
        className="flex rounded-lg border border-[var(--boodmo-border)] bg-white overflow-hidden hover:shadow-md transition-shadow group"
      >
        {/* Product Image and Tag */}
        <div className="relative w-40 min-w-[160px] bg-[#f5f9ff] flex items-center justify-center p-4 group-hover:bg-white transition-colors">
          {product.tag && (
            <div className="absolute top-2 left-2 z-10 bg-[#00a1e5] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {product.tag}
            </div>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="p-4 flex flex-1">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-[var(--boodmo-text)] line-clamp-2 mb-2 group-hover:text-[#00a1e5] transition-colors">
              {product.name}
            </h3>

            {/* Brand and Part Number */}
            <div className="flex justify-between items-center text-[11px] text-[#7c8fa8] mb-2">
              <span className="font-semibold uppercase">{product.brand}</span>
              <span>{product.partNumber}</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1">
              {product.isFulfilledByBoodmo && (
                <div className="flex items-center gap-1 border border-[var(--boodmo-border)] rounded px-1.5 py-0.5 text-[10px] text-[var(--boodmo-text)]">
                  <span className="text-[#0056a6] font-bold italic">Fulfilled by</span>
                  <div className="bg-[#0056a6] text-white rounded-sm px-1 font-bold">b</div>
                </div>
              )}
              {product.isBoodmosChoice && (
                <div className="bg-[#5c3ce6] text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                  boodmo&apos;s Choice
                </div>
              )}
              {product.hasFreeDelivery && (
                <div className="flex items-center gap-1 border border-[#00a1e5] bg-[#eefaff] rounded px-1.5 py-0.5 text-[10px] text-[#00a1e5]">
                  <span>Free Delivery</span>
                </div>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col items-end justify-center ml-4">
            <div className="flex items-baseline gap-2 flex-wrap justify-end">
              <span className="text-lg font-bold text-[var(--boodmo-text)]">
                {formatPrice(product.price)}
              </span>
              {product.discount > 0 && (
                <div className="bg-[#00a1e5] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  -{product.discount}%
                </div>
              )}
            </div>
            <div className="text-xs text-[#7c8fa8]">
              MRP: <span className="line-through">{formatPrice(product.mrp)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/parts/${product.id}`}
      className="flex flex-col rounded-lg border border-[var(--boodmo-border)] bg-white overflow-hidden hover:shadow-md transition-shadow h-full group"
    >
      {/* Product Image and Tag */}
      <div className="relative aspect-[4/3] bg-[#f5f9ff] flex items-center justify-center p-4 group-hover:bg-white transition-colors">
        {product.tag && (
          <div className="absolute top-2 left-2 z-10 bg-[#00a1e5] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
            {product.tag}
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-[var(--boodmo-text)] line-clamp-2 mb-2 min-h-[40px] group-hover:text-[#00a1e5] transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto">
          {/* Price and Discount */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg font-bold text-[var(--boodmo-text)]">
              {formatPrice(product.price)}
            </span>
            {product.discount > 0 && (
              <div className="bg-[#00a1e5] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                -{product.discount}%
              </div>
            )}
          </div>
          <div className="text-xs text-[#7c8fa8] mb-2">
            MRP: <span className="line-through">{formatPrice(product.mrp)}</span>
          </div>

          {/* Brand and Part Number */}
          <div className="flex justify-between items-center text-[11px] text-[#7c8fa8] border-t border-[var(--boodmo-border)] pt-2 mb-2">
            <span className="font-semibold uppercase">{product.brand}</span>
            <span>{product.partNumber}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1">
            {product.isFulfilledByBoodmo && (
              <div className="flex items-center gap-1 border border-[var(--boodmo-border)] rounded px-1.5 py-0.5 text-[10px] text-[var(--boodmo-text)]">
                <span className="text-[#0056a6] font-bold italic">Fulfilled by</span>
                <div className="bg-[#0056a6] text-white rounded-sm px-1 font-bold">b</div>
                <Icons.info className="w-3 h-3 text-[#7c8fa8]" />
              </div>
            )}
            {product.isBoodmosChoice && (
              <div className="bg-[#5c3ce6] text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                boodmo&apos;s Choice
              </div>
            )}
            {product.hasFreeDelivery && (
              <div className="flex items-center gap-1 border border-[#00a1e5] bg-[#eefaff] rounded px-1.5 py-0.5 text-[10px] text-[#00a1e5]">
                <span>Free Delivery</span>
                <Icons.truck className="w-3 h-3" />
                <Icons.info className="w-3 h-3" />
              </div>
            )}
            {product.tag === "Best Offer" && (
              <div className="bg-[#00a1e5] text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                Best Offer
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
