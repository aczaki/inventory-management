import api from "./api";
import type {
  Product,
  ProductResponse,
} from "../types/product";

export interface ProductRequest {
  category_id: number;
  unit_id: number;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  default_purchase_price: number;
  selling_price: number;
  minimum_stock: number;
  status: "active" | "inactive";
  image?: File | null;
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface ProductDeleteResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface ProductQueryParams {
  search?: string;
  category_id?: number;
  status?: "active" | "inactive";
  sort_by?: string;
  sort_direction?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

const buildProductFormData = (
  data: ProductRequest
): FormData => {
  const formData = new FormData();

  formData.append(
    "category_id",
    String(data.category_id)
  );

  formData.append(
    "unit_id",
    String(data.unit_id)
  );

  formData.append("sku", data.sku);

  if (data.barcode) {
    formData.append("barcode", data.barcode);
  }

  formData.append("name", data.name);

  if (data.description) {
    formData.append(
      "description",
      data.description
    );
  }

  formData.append(
    "default_purchase_price",
    String(data.default_purchase_price)
  );

  formData.append(
    "selling_price",
    String(data.selling_price)
  );

  formData.append(
    "minimum_stock",
    String(data.minimum_stock)
  );

  formData.append("status", data.status);

  if (data.image) {
    formData.append("image", data.image);
  }

  return formData;
};

export const getProducts = async (
  params?: ProductQueryParams
): Promise<ProductResponse> => {
  const response =
    await api.get<ProductResponse>(
      "/products",
      {
        params,
      }
    );

  return response.data;
};

export const getProduct = async (
  id: number
): Promise<ProductDetailResponse> => {
  const response =
    await api.get<ProductDetailResponse>(
      `/products/${id}`
    );

  return response.data;
};

export const createProduct = async (
  data: ProductRequest
): Promise<ProductDetailResponse> => {
  const formData = buildProductFormData(data);

  const response =
    await api.post<ProductDetailResponse>(
      "/products",
      formData
    );

  return response.data;
};

export const updateProduct = async (
  id: number,
  data: ProductRequest
): Promise<ProductDetailResponse> => {
  const formData = buildProductFormData(data);

  formData.append("_method", "PUT");

  const response =
    await api.post<ProductDetailResponse>(
      `/products/${id}`,
      formData
    );

  return response.data;
};

export const deleteProduct = async (
  id: number
): Promise<ProductDeleteResponse> => {
  const response =
    await api.delete<ProductDeleteResponse>(
      `/products/${id}`
    );

  return response.data;
};