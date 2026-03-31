export type Category = "COLLAR" | "PULSERA" | "ANILLO";

export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category;
  featured: boolean;
};
