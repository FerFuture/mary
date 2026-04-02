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
  /**
   * Máximo de unidades permitidas en el carrito/pedido (coincide con inventario en servidor).
   * No mostrar en la UI como “stock”; solo usar para tope de cantidad y “agotado”.
   */
  maxOrderQuantity: number;
};
