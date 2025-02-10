import api from './api';
import { Discount, PaginatedResponse, ApiResponse } from '../types';

export interface CreateDiscountRequest {
  name: string;
  description?: string;
  discountPercent: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface UpdateDiscountRequest {
  name?: string;
  description?: string;
  discountPercent?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export const getDiscounts = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  searchTerm?: string,
  isActive?: boolean
): Promise<PaginatedResponse<Discount>> => {
  const response = await api.get<PaginatedResponse<Discount>>('/discounts', {
    params: {
      pageNumber,
      pageSize,
      searchTerm,
      isActive,
    },
  });
  return response.data;
};

export const getDiscount = async (id: number): Promise<Discount> => {
  const response = await api.get<ApiResponse<Discount>>(`/discounts/${id}`);
  return response.data.data!;
};

export const createDiscount = async (discount: CreateDiscountRequest): Promise<Discount> => {
  const response = await api.post<ApiResponse<Discount>>('/discounts', discount);
  return response.data.data!;
};

export const updateDiscount = async (
  id: number,
  discount: UpdateDiscountRequest
): Promise<Discount> => {
  const response = await api.put<ApiResponse<Discount>>(`/discounts/${id}`, discount);
  return response.data.data!;
};

export const deleteDiscount = async (id: number): Promise<boolean> => {
  const response = await api.delete<ApiResponse<void>>(`/discounts/${id}`);
  return response.data.success;
}; 