export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  productCount: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  discountId?: number;
  discountedPrice?: number;
}

export interface Discount {
  id: number;
  name: string;
  description?: string;
  discountPercent: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
} 