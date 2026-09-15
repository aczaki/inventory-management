export interface Warehouse {
  id: number;
  code: string;
  name: string;
  address: string | null;
  description: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface WarehouseFormData {
  code: string;
  name: string;
  address: string;
  description: string;
  status: "active" | "inactive";
}

export interface WarehouseResponse {
  success: boolean;
  message: string;
  data: Warehouse[];
}

export interface WarehouseDetailResponse {
  success: boolean;
  message: string;
  data: Warehouse;
}

export interface WarehouseDeleteResponse {
  success: boolean;
  message: string;
}