export interface Category {
  id: number;
  name: string;
  icon: string;
  count: number;
}

export interface FeaturedProduct {
  id: number;
  name: string;
  price: string;
  image: string;
}

export const categories: Category[] = [
  { id: 1, name: "Maintainance service", icon: "⚙️", count: 1250 },
  { id: 2, name: "Brake System", icon: "🛑", count: 890 },
  { id: 3, name: "Electrical", icon: "🔋", count: 720 },
  { id: 4, name: "Body Parts", icon: "🚗", count: 1100 },
  { id: 5, name: "Interior", icon: "🪑", count: 450 },
];

export const featuredProducts: FeaturedProduct[] = [
  { id: 1, name: "Toyota Camry Filter Set", price: "Rs. 2,500", image: "filter" },
  { id: 2, name: "Honda Brake Pads Premium", price: "Rs. 4,200", image: "brake" },
  { id: 3, name: "Suzuki Spark Plug Set", price: "Rs. 1,200", image: "spark" },
  { id: 4, name: "Hyundai Oil Filter", price: "Rs. 850", image: "oil" },
];

