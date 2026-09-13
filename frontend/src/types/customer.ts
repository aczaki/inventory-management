export interface Customer {
  id: number;
  code: string;
  business_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerFormData {
  code: string;
  business_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
}

export interface CustomerPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface CustomerPaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: CustomerPaginationLink[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface CustomerPaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface CustomerResponse {
  data: Customer[];
  links: CustomerPaginationLinks;
  meta: CustomerPaginationMeta;
}

export interface CustomerDetailResponse {
  data: Customer;
}

export interface CustomerDeleteResponse {
  message: string;
}