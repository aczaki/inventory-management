export interface InventoryStockProduct {
  id: number;
  sku: string;
  barcode: string | null;
  name: string;
  description: string | null;
  default_purchase_price: number | string;
  selling_price: number | string;
  minimum_stock: number | string;
  status: "active" | "inactive";
  image: string | null;
  image_url: string | null;
  category: {
    id: number;
    name: string;
  } | null;
  unit: {
    id: number;
    name: string;
    code: string;
  } | null;
}

export interface InventoryStockWarehouse {
  id: number;
  code: string;
  name: string;
  address?: string | null;
  description?: string | null;
  status?: "active" | "inactive" | string;
}

export interface InventoryStock {
  id: number;
  product_id: number;
  warehouse_id: number;
  quantity: number | string;
  product: InventoryStockProduct;
  warehouse: InventoryStockWarehouse;
  created_at: string;
  updated_at: string;
}

export interface InventoryStockQueryParams {
  search?: string;
  warehouse_id?: number;
}

export interface InventoryStockResponse {
  success: boolean;
  message: string;
  data: InventoryStock[];
}