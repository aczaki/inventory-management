export interface Supplier {
  id: number;
  code: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  contact_person: string | null;
  status: "active" | "inactive" | string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SupplierFormData {
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contact_person: string;
  status: "active" | "inactive";
}

export interface SupplierResponse {
  success: boolean;
  message: string;
  data: Supplier[];
}

export interface SupplierDetailResponse {
  success: boolean;
  message: string;
  data: Supplier;
}

export interface SupplierDeleteResponse {
  success: boolean;
  message: string;
  data: null;
}