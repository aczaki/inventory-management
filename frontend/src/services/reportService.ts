import api from "./api";

import type {
  InventoryReportQueryParams,
  InventoryReportResponse,
  StockByWarehouseResponse,
  StockMovementReportQueryParams,
  StockMovementReportResponse,
  TransactionReportQueryParams,
  TransactionReportResponse,
} from "../types/report";

/**
 * Inventory Report
 */
export const getInventoryReport = async (
  params?: InventoryReportQueryParams
) => {
  const response = await api.get<InventoryReportResponse>(
    "/reports/inventory",
    {
      params,
    }
  );

  return response.data;
};

/**
 * Transaction Report
 */
export const getTransactionReport = async (
  params?: TransactionReportQueryParams
) => {
  const response = await api.get<TransactionReportResponse>(
    "/reports/transactions",
    {
      params,
    }
  );

  return response.data;
};

/**
 * Stock Movement Report
 */
export const getStockMovementReport = async (
  params?: StockMovementReportQueryParams
) => {
  const response = await api.get<StockMovementReportResponse>(
    "/reports/stock-movement",
    {
      params,
    }
  );

  return response.data;
};

/**
 * Stock by Warehouse Report
 */
export const getStockByWarehouseReport = async () => {
  const response = await api.get<StockByWarehouseResponse>(
    "/reports/stock-by-warehouse"
  );

  return response.data;
};