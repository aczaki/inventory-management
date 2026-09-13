import api from "./api";

import type {
  SupplierDeleteResponse,
  SupplierDetailResponse,
  SupplierResponse,
} from "../types/supplier";

export interface SupplierRequest {
  code: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contact_person?: string;
  status: "active" | "inactive";
}

export const getSuppliers =
  async (): Promise<SupplierResponse> => {
    const response =
      await api.get<SupplierResponse>(
        "/suppliers"
      );

    return response.data;
  };

export const getSupplier = async (
  id: number
): Promise<SupplierDetailResponse> => {
  const response =
    await api.get<SupplierDetailResponse>(
      `/suppliers/${id}`
    );

  return response.data;
};

export const createSupplier = async (
  data: SupplierRequest
): Promise<SupplierDetailResponse> => {
  const response =
    await api.post<SupplierDetailResponse>(
      "/suppliers",
      data
    );

  return response.data;
};

export const updateSupplier = async (
  id: number,
  data: SupplierRequest
): Promise<SupplierDetailResponse> => {
  const response =
    await api.put<SupplierDetailResponse>(
      `/suppliers/${id}`,
      data
    );

  return response.data;
};

export const deleteSupplier = async (
  id: number
): Promise<SupplierDeleteResponse> => {
  const response =
    await api.delete<SupplierDeleteResponse>(
      `/suppliers/${id}`
    );

  return response.data;
};

export const restoreSupplier = async (
  id: number
): Promise<SupplierDetailResponse> => {
  const response =
    await api.post<SupplierDetailResponse>(
      `/suppliers/${id}/restore`
    );

  return response.data;
};