// src/components/Product/Product.types.ts
export interface Product {
  id: number;
  name: string;
  description?: string;
  price_in_RS: number;
  manufacture_date?: string;
  expiry_date?: string;
  weight_in_KG?: number;
  category?: string;
}
