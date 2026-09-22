export type TransactionType =
  | "in"
  | "out"
  | "adjustment"
  | string;

export interface TransactionWarehouse {
  id: number;
  code: string;
  name: string;
}

export interface TransactionCustomer {
  id: number;
  name: string;
}

export interface TransactionUser {
  id: number;
  name: string;
}

export interface InventoryTransaction {
  id: number;
  transaction_number: string;
  type: TransactionType;

  warehouse: TransactionWarehouse | null;
  customer: TransactionCustomer | null;
  user: TransactionUser | null;

  reference_type: string | null;
  reference_number: string | null;
  notes: string | null;
  transaction_date: string;

  created_at: string;
  updated_at: string;
}

export interface TransactionPaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface TransactionPaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: TransactionPaginationLink[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface TransactionPaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface InventoryTransactionResponse {
  data: InventoryTransaction[];
  links: TransactionPaginationLinks;
  meta: TransactionPaginationMeta;
}

export interface InventoryTransactionDetailResponse {
  data: InventoryTransaction;
}

export interface InventoryTransactionQueryParams {
  type?: "in" | "out" | "adjustment";
  warehouse_id?: number;
  customer_id?: number;
  reference_type?: string;
  per_page?: number;
  page?: number;
}