import api from "./api";
import type {
  InventoryStock,
  InventoryStockQueryParams,
  InventoryStockResponse,
} from "../types/inventoryStock";

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