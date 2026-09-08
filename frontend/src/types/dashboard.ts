export interface DashboardSummary {
  total_products: number;
  total_stock: number | string;
  low_stock: number;
  total_warehouses: number;
}

export interface StockMovement {
  stock_in: number;
  stock_out: number;
}

export interface LowStockProduct {
  id: number;
  sku: string;
  name: string;
  quantity: number;
  minimum_stock: number;
}

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  address?: string;
  description?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface WarehouseStock {
  warehouse_id: number;
  total_stock: number | string;
  warehouse: Warehouse;
}

export interface RecentTransaction {
  id: number;
  transaction_number: string;
  type: "in" | "out" | "adjustment" | string;
  warehouse_id: number | null;
  customer_id: number | null;
  user_id: number | null;
  reference_type: string | null;
  reference_number: string | null;
  notes: string | null;
  transaction_date: string;
  created_at?: string;
  updated_at?: string;
  warehouse: TransactionWarehouse | null;
  customer: TransactionCustomer | null;
  user: TransactionUser | null;
}

export interface DashboardData {
  summary: DashboardSummary;
  stock_movement: StockMovement;
  low_stock_products: LowStockProduct[];
  recent_transactions: RecentTransaction[];
  stock_by_warehouse: WarehouseStock[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export interface TransactionWarehouse {
  id: number;
  code: string;
  name: string;
}

export interface TransactionCustomer {
  id: number;
  code: string;
  business_name: string;
  contact_person: string;
  email: string;
  phone: string;
}

export interface TransactionUser {
  id: number;
  name: string;
  email: string;
}