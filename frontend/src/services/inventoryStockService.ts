import api from "./api";
import type {
  InventoryStockResponse,
} from "../types/inventoryStock";

export interface InventoryStockQueryParams {
  search?: string;
  warehouse_id?: number;
}

export const getInventoryStocks = async (
  params?: InventoryStockQueryParams
): Promise<InventoryStockResponse> => {
  const response =
    await api.get<InventoryStockResponse>(
      "/inventory/stocks",
      {
        params,
      }
    );

  return response.data;
};