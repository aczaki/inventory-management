import api from "./api";
import type {
  InventoryStock,
  InventoryStockQueryParams,
  InventoryStockResponse,
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

export const getInventoryStocks = async (
  params?: InventoryStockQueryParams
): Promise<InventoryStock[]> => {
  const response = await api.get<InventoryStockResponse>(
    "/inventory/stocks",
    {
      params,
    }
  );

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