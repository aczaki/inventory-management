import api from "./api";

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  address: string | null;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface WarehouseResponse {
  success: boolean;
  message: string;
  data: Warehouse[];
}

export const getWarehouses =
  async (): Promise<WarehouseResponse> => {
    const response =
      await api.get<WarehouseResponse>(
        "/warehouses"
      );

    return response.data;
  };