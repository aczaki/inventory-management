import api from "./api";
import type {
  InventoryStock,
  InventoryStockQueryParams,
} from "../types/inventoryStock";

export interface StockInRequest {
  product_id: number;
  warehouse_id: number;
  quantity: number;
  reference_number?: string;
  notes?: string;
}

export interface StockInResponse {
  message: string;
  data: InventoryStock;
}

export interface StockOutRequest {
  product_id: number;
  warehouse_id: number;
  quantity: number;
  customer_id?: number | null;
  reference_number?: string;
  notes?: string;
}

export interface StockOutResponse {
  message: string;
  data: InventoryStock;
}

export const getInventoryStocks = async (
  params?: InventoryStockQueryParams
): Promise<InventoryStock[]> => {
  const response = await api.get("/inventory/stocks", {
    params,
  });

  return response.data.data;
};

export const stockIn = async (
  data: StockInRequest
): Promise<InventoryStock> => {
  const response = await api.post<StockInResponse>(
    "/inventory/stocks/in",
    data
  );

  return response.data.data;
};

export const stockOut = async (
  data: StockOutRequest
): Promise<InventoryStock> => {
  const response = await api.post<StockOutResponse>(
    "/inventory/stocks/out",
    data
  );

  return response.data.data;
};