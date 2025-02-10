import api from './api';
import { Product, PaginatedResponse, ApiResponse } from '../types';

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
  discountId?: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: number;
  discountId?: number;
}

export const getProducts = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  searchTerm?: string,
  categoryId?: number,
  minPrice?: number,
  maxPrice?: number,
  includeOutOfStock: boolean = true
): Promise<PaginatedResponse<Product>> => {
  const response = await api.get<PaginatedResponse<Product>>('/products', {
    params: {
      pageNumber,
      pageSize,
      searchTerm,
      categoryId,
      minPrice,
      maxPrice,
      includeOutOfStock,
    },
  });
  return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data.data!;
};

export const createProduct = async (product: CreateProductRequest): Promise<Product> => {
  const response = await api.post<ApiResponse<Product>>('/products', product);
  return response.data.data!;
};

export const updateProduct = async (
  id: number,
  product: UpdateProductRequest
): Promise<Product> => {
  const response = await api.put<ApiResponse<Product>>(`/products/${id}`, product);
  return response.data.data!;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  const response = await api.delete<ApiResponse<void>>(`/products/${id}`);
  return response.data.success;
};

export const updateStock = async (id: number, quantity: number): Promise<boolean> => {
  const response = await api.patch<ApiResponse<void>>(`/products/${id}/stock`, { quantity });
  return response.data.success;
}; 