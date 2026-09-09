export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductUnit {
  id: number;
  name: string;
  code: string;
}

export interface Product {
  id: number;
  sku: string;
  barcode: string | null;
  name: string;
  description: string | null;
  default_purchase_price: number | string;
  selling_price: number | string;
  minimum_stock: number | string;
  status: "active" | "inactive" | string;
  image: string | null;
  image_url: string | null;
  category: ProductCategory | null;
  unit: ProductUnit | null;
  created_at: string;
  updated_at: string;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product[];
}