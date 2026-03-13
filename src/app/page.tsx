"use client";

import { Header } from "@/components/home/Header";
import { HeroSearch } from "@/components/home/HeroSearch";
import { VehicleSearch } from "@/components/home/VehicleSearch";
import { CategorySearch } from "@/components/home/CategorySearch";
import { BrandList } from "@/components/home/BrandList";

export default function Home() {

  return (
    <div className="min-h-screen bg-[#f5f9ff]">
      <Header />
      <HeroSearch />
      <VehicleSearch />
      <CategorySearch />
      <BrandList/>
    </div>
  );
}
