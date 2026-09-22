import api from "./api";

import type {
  InventoryTransaction,
  InventoryTransactionDetailResponse,
  InventoryTransactionQueryParams,
  InventoryTransactionResponse,
} from "../types/inventoryTransaction";

export const getInventoryTransactions = async (
  params?: InventoryTransactionQueryParams
): Promise<InventoryTransactionResponse> => {
  const response =
    await api.get<InventoryTransactionResponse>(
      "/inventory/transactions",
      {
        params,
      }
    );

  return response.data;
};

export const getInventoryTransaction = async (
  id: number
): Promise<InventoryTransaction> => {
  const response =
    await api.get<InventoryTransactionDetailResponse>(
      `/inventory/transactions/${id}`
    );

  return response.data.data;
};