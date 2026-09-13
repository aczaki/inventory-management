import api from "./api";

import type {
  Category,
  CategoryDeleteResponse,
  CategoryDetailResponse,
  CategoryResponse,
} from "../types/category";

export interface CategoryRequest {
  parent_id: number | null;
  name: string;
  slug: string;
  description?: string;
}

export const getCategories =
  async (): Promise<CategoryResponse> => {
    const response =
      await api.get<CategoryResponse>(
        "/categories"
      );

    return response.data;
  };

export const getCategory = async (
  id: number
): Promise<CategoryDetailResponse> => {
  const response =
    await api.get<CategoryDetailResponse>(
      `/categories/${id}`
    );

  return response.data;
};

export const createCategory = async (
  data: CategoryRequest
): Promise<CategoryDetailResponse> => {
  const response =
    await api.post<CategoryDetailResponse>(
      "/categories",
      data
    );

  return response.data;
};

export const updateCategory = async (
  id: number,
  data: CategoryRequest
): Promise<CategoryDetailResponse> => {
  const response =
    await api.put<CategoryDetailResponse>(
      `/categories/${id}`,
      data
    );

  return response.data;
};

export const deleteCategory = async (
  id: number
): Promise<CategoryDeleteResponse> => {
  const response =
    await api.delete<CategoryDeleteResponse>(
      `/categories/${id}`
    );

  return response.data;
};

export const restoreCategory = async (
  id: number
): Promise<CategoryDetailResponse> => {
  const response =
    await api.post<CategoryDetailResponse>(
      `/categories/${id}/restore`
    );

  return response.data;
};