import api from "./api";
import type { ProductResponse } from "../types/product";

export const getProducts = async (): Promise<ProductResponse> => {
  const response =
    await api.get<ProductResponse>("/products");

  return response.data;
};