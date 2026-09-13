export interface InventoryStockProduct {
  id: number;
  sku: string;
  name: string;
  minimum_stock: number | string;
}

export interface InventoryStockWarehouse {
  id: number;
  code: string;
  name: string;
}

export interface InventoryStock {
  id: number;
  product_id: number;
  warehouse_id: number;
  quantity: number | string;
  product: InventoryStockProduct;
  warehouse: InventoryStockWarehouse;
}

export interface InventoryStockResponse {
  success: boolean;
  message: string;
  data: InventoryStock[];
}