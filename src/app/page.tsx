"use client";

import { Header } from "@/components/home/Header";
import { VehicleSearch } from "@/components/home/VehicleSearch";
import { CategorySearch } from "@/components/home/CategorySearch";
import { BrandsWeTrust } from "@/components/home/BrandsWeTrust";
import { PopularCarMakers } from "@/components/home/PopularCarMakers";
import { HomeFooter } from "@/components/home/HomeFooter";
import { BoodmoNote } from "@/components/home/BoodmoNote";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <VehicleSearch />
      <CategorySearch />
      <BrandsWeTrust />
      <PopularCarMakers />
	  <BoodmoNote />
      <HomeFooter />
    </div>
  );
}
