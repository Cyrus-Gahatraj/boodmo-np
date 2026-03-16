"use client";

import { Icons } from "@/components/ui/Icons";
import { Product } from "./ProductCard";

interface PartDetailProps {
  part: any; // Using any for API data, could be typed further
  offers: any[];
  compatibilities: any[];
  replacements: any[];
}

export function PartDetail({ part, offers, compatibilities, replacements }: PartDetailProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  };

  const ASSET_BASE = "https://demoapi.boodmo.in";
  
  // Get the main image from the images array (usually the first big one)
  const mainImage = part.images?.[0]?.big || part.images?.[0]?.medium || part.image;
  const imageUrl = mainImage ? `${ASSET_BASE}/${mainImage}` : "/next.svg";

  // Calculate the best price from offers if available, fallback to part.price or part.mrp
  const bestOfferPrice = offers.length > 0 ? Math.min(...offers.map(o => o.price)) : undefined;
  const displayPrice = bestOfferPrice || part.price || part.mrp || 0;
  const displayMrp = part.mrp || displayPrice;

  return (
    <div className="space-y-8">
      {/* Product Main Info */}
      <div className="rounded-lg border border-[var(--boodmo-border)] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Image Section */}
          <div className="relative aspect-square w-full max-w-[400px] shrink-0 overflow-hidden rounded-lg bg-[#f5f9ff] p-8">
            <img
              src={imageUrl}
              alt={part.name}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-1 flex-col">
            <h1 className="mb-4 text-2xl font-bold text-[var(--boodmo-text)]">{part.name}</h1>
            
            <div className="mb-6 flex items-baseline gap-4">
              <span className="text-3xl font-bold text-[var(--boodmo-text)]">
                {formatPrice(displayPrice)}
              </span>
              {displayMrp > displayPrice && (
                <div className="flex flex-col">
                  <span className="text-sm text-[#7c8fa8] line-through">
                    MRP: {formatPrice(displayMrp)}
                  </span>
                  <span className="text-sm font-bold text-[#00a1e5]">
                    -{Math.round(((displayMrp - displayPrice) / displayMrp) * 100)}%
                  </span>
                </div>
              )}
            </div>

            <div className="mb-6 grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <span className="block text-[#7c8fa8]">Brand</span>
                <span className="font-semibold uppercase">{part.brand?.name || "N/A"}</span>
              </div>
              <div>
                <span className="block text-[#7c8fa8]">Part Number</span>
                <span className="font-semibold">{part.numberPublic || part.number || "N/A"}</span>
              </div>
              <div>
                <span className="block text-[#7c8fa8]">Origin</span>
                <span className="font-semibold capitalize">{part.brand?.origin || "Aftermarket"}</span>
              </div>
              <div>
                <span className="block text-[#7c8fa8]">Class</span>
                <span className="font-semibold">{part.class?.name || "N/A"}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {part.is_fulfilled && (
                <div className="flex items-center gap-1 border border-[var(--boodmo-border)] rounded px-2 py-1 text-xs text-[var(--boodmo-text)]">
                  <span className="text-[#0056a6] font-bold italic">Fulfilled by</span>
                  <div className="bg-[#0056a6] text-white rounded-sm px-1.5 font-bold">b</div>
                </div>
              )}
              {part.is_boodmo_choice && (
                <div className="bg-[#5c3ce6] text-white text-xs font-medium px-2 py-1 rounded">
                  boodmo&apos;s Choice
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attributes Section */}
      {part.attributes && Object.keys(part.attributes).length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--boodmo-text)]">Specifications</h2>
          <div className="rounded-lg border border-[var(--boodmo-border)] bg-white shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:gap-x-0">
              {Object.entries(part.attributes).map(([key, value], idx) => (
                <div key={key} className={`flex justify-between px-6 py-4 text-sm ${idx % 2 === 0 ? 'md:border-r border-[var(--boodmo-border)]' : ''} border-b border-[var(--boodmo-border)]`}>
                  <span className="text-[#7c8fa8]">{key}</span>
                  <span className="font-medium text-[var(--boodmo-text)]">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Offers Section */}
      {offers.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--boodmo-text)]">Available Offers</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer, idx) => (
              <div key={idx} className="rounded-lg border border-[var(--boodmo-border)] bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-bold text-[#0056a6]">{formatPrice(offer.price)}</span>
                  {offer.is_free_delivery && (
                    <span className="text-[10px] font-bold text-[#00a1e5] uppercase">Free Delivery</span>
                  )}
                </div>
                <div className="text-xs text-[#7c8fa8]">
                  Seller: <span className="text-[var(--boodmo-text)] font-medium">{offer.seller?.name || "Unknown"}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Compatibilities Section */}
      {compatibilities.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--boodmo-text)]">Compatible Vehicles</h2>
          <div className="overflow-hidden rounded-lg border border-[var(--boodmo-border)] bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f5f9ff] text-[var(--boodmo-text-muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Make</th>
                  <th className="px-4 py-3 font-semibold">Model</th>
                  <th className="px-4 py-3 font-semibold">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--boodmo-border)]">
                {compatibilities.slice(0, 10).map((compat, idx) => (
                  <tr key={idx} className="hover:bg-[#f9fcff]">
                    <td className="px-4 py-3">{compat.maker?.name}</td>
                    <td className="px-4 py-3">{compat.model?.name}</td>
                    <td className="px-4 py-3">{compat.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
