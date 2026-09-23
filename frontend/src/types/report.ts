export type StockStatus =
  | "safe"
  | "low_stock"
  | "out_of_stock"
  | string;

export type ReportTransactionType =
  | "in"
  | "out"
  | "adjustment"
  | string;

/**
 * Inventory Report
 */
export interface InventoryReportItem {
  product_id: number;
  sku: string;
  product_name: string;
  warehouse_id: number;
  warehouse_name: string;
  quantity: number;
  minimum_stock: number;
  stock_status: StockStatus;
}

export interface InventoryReportResponse {
  success: boolean;
  message: string;
  data: InventoryReportItem[];
}

export interface InventoryReportQueryParams {
  warehouse_id?: number;
  product_id?: number;
}

/**
 * Transaction Report
 */
export interface TransactionReportItem {
  id: number;
  transaction_number: string;
  type: ReportTransactionType;
  warehouse: string | null;
  customer: string | null;
  user: string | null;
  reference_type: string | null;
  reference_number: string | null;
  notes: string | null;
  transaction_date: string;
}

export interface TransactionReportResponse {
  success: boolean;
  message: string;
  data: TransactionReportItem[];
}

export interface TransactionReportQueryParams {
  start_date?: string;
  end_date?: string;
  type?: "in" | "out" | "adjustment";
  warehouse_id?: number;
  customer_id?: number;
  reference_type?: string;
}

/**
 * Stock Movement Report
 */
export interface StockMovementReport {
  stock_in: number;
  stock_out: number;
  adjustment: number;
}

export interface StockMovementReportResponse {
  success: boolean;
  message: string;
  data: StockMovementReport;
}

export interface StockMovementReportQueryParams {
  start_date?: string;
  end_date?: string;
  warehouse_id?: number;
}

/**
 * Stock by Warehouse Report
 */
export interface StockByWarehouseItem {
  warehouse_id: number;
  warehouse_name: string;
  total_stock: number;
}

export interface StockByWarehouseResponse {
  success: boolean;
  message: string;
  data: StockByWarehouseItem[];
}