export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  parent_id: number | null;
  name: string;
  slug: string;
  description: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface CategoryDetailResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface CategoryDeleteResponse {
  success: boolean;
  message: string;
  data: null;
}