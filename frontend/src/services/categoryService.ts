import api from "./api";

export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export const getCategories =
  async (): Promise<CategoryResponse> => {
    const response =
      await api.get<CategoryResponse>("/categories");

    return response.data;
  };