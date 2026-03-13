export interface FeaturedProduct {
  id: number;
  name: string;
  price: string;
  image: string;
}

export const featuredProducts: FeaturedProduct[] = [
  { id: 1, name: "Toyota Camry Filter Set", price: "Rs. 2,500", image: "filter" },
  { id: 2, name: "Honda Brake Pads Premium", price: "Rs. 4,200", image: "brake" },
  { id: 3, name: "Suzuki Spark Plug Set", price: "Rs. 1,200", image: "spark" },
  { id: 4, name: "Hyundai Oil Filter", price: "Rs. 850", image: "oil" },
];

