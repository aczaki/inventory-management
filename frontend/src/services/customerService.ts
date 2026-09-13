import api from "./api";

import type {
  CustomerDeleteResponse,
  CustomerDetailResponse,
  CustomerResponse,
} from "../types/customer";

export interface CustomerRequest {
  code: string;
  business_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CustomerQueryParams {
  search?: string;
  per_page?: number;
  page?: number;
}

export const getCustomers = async (
  params?: CustomerQueryParams
): Promise<CustomerResponse> => {
  const response =
    await api.get<CustomerResponse>(
      "/customers",
      {
        params,
      }
    );

  return response.data;
};

export const getCustomer = async (
  id: number
): Promise<CustomerDetailResponse> => {
  const response =
    await api.get<CustomerDetailResponse>(
      `/customers/${id}`
    );

  return response.data;
};

export const createCustomer = async (
  data: CustomerRequest
): Promise<CustomerDetailResponse> => {
  const response =
    await api.post<CustomerDetailResponse>(
      "/customers",
      data
    );

  return response.data;
};

export const updateCustomer = async (
  id: number,
  data: CustomerRequest
): Promise<CustomerDetailResponse> => {
  const response =
    await api.put<CustomerDetailResponse>(
      `/customers/${id}`,
      data
    );

  return response.data;
};

export const deleteCustomer = async (
  id: number
): Promise<CustomerDeleteResponse> => {
  const response =
    await api.delete<CustomerDeleteResponse>(
      `/customers/${id}`
    );

  return response.data;
};