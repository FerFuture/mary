export type Category = "COLLAR" | "PULSERA" | "ANILLO" | "DIJE";

export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  /** Imagen principal (listados, carrito); coincide con la primera de `imageUrls`. */
  imageUrl: string;
  /** Todas las imágenes en orden de visualización (galería en ficha). */
  imageUrls: string[];
  category: Category;
  featured: boolean;
  /**
   * Máximo de unidades permitidas en el carrito/pedido (coincide con inventario en servidor).
   * No mostrar en la UI como “stock”; solo usar para tope de cantidad y “agotado”.
   */
  maxOrderQuantity: number;
  /** Claves de color (minúsculas). Vacío = sin selector. */
  colors: string[];
  /** Texto por clave; si falta una clave se capitaliza en la UI. */
  colorLabels: Record<string, string>;
};
