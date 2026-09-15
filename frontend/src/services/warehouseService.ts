import api from "./api";

import type {
  Warehouse,
  WarehouseDeleteResponse,
  WarehouseDetailResponse,
  WarehouseFormData,
  WarehouseResponse,
} from "../types/warehouse";

export const getWarehouses = async (): Promise<Warehouse[]> => {
  const response = await api.get<WarehouseResponse>("/warehouses");

  return response.data.data;
};

export const getWarehouse = async (
  id: number
): Promise<Warehouse> => {
  const response = await api.get<WarehouseDetailResponse>(
    `/warehouses/${id}`
  );

  return response.data.data;
};

export const createWarehouse = async (
  data: WarehouseFormData
): Promise<Warehouse> => {
  const response = await api.post<WarehouseDetailResponse>(
    "/warehouses",
    data
  );

  return response.data.data;
};

export const updateWarehouse = async (
  id: number,
  data: WarehouseFormData
): Promise<Warehouse> => {
  const response = await api.put<WarehouseDetailResponse>(
    `/warehouses/${id}`,
    data
  );

  return response.data.data;
};

export const deleteWarehouse = async (
  id: number
): Promise<WarehouseDeleteResponse> => {
  const response = await api.delete<WarehouseDeleteResponse>(
    `/warehouses/${id}`
  );

  return response.data;
};