import api from './api';
import { Category, PaginatedResponse, ApiResponse } from '../types';

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
}

export const getCategories = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  searchTerm?: string
): Promise<PaginatedResponse<Category>> => {
  const response = await api.get<PaginatedResponse<Category>>('/categories', {
    params: {
      pageNumber,
      pageSize,
      searchTerm,
    },
  });
  return response.data;
};

export const getCategory = async (id: number): Promise<Category> => {
  const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
  return response.data.data!;
};

export const createCategory = async (category: CreateCategoryRequest): Promise<Category> => {
  const response = await api.post<ApiResponse<Category>>('/categories', category);
  return response.data.data!;
};

export const updateCategory = async (
  id: number,
  category: UpdateCategoryRequest
): Promise<Category> => {
  const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, category);
  return response.data.data!;
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  const response = await api.delete<ApiResponse<void>>(`/categories/${id}`);
  return response.data.success;
}; 