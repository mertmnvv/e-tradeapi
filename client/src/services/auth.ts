import api from './api';
import { AuthResponse, ApiResponse, User } from '../types';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
    email,
    password,
  });
  return response.data.data!;
};

export const register = async (
  username: string,
  email: string,
  password: string
): Promise<User> => {
  const response = await api.post<ApiResponse<User>>('/auth/register', {
    username,
    email,
    password,
  });
  return response.data.data!;
};

export const refreshToken = async (
  accessToken: string,
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
    '/auth/refresh-token',
    {
      accessToken,
      refreshToken,
    }
  );
  return response.data.data!;
};

export const revokeToken = async (refreshToken: string): Promise<boolean> => {
  const response = await api.post<ApiResponse<void>>('/auth/revoke-token', {
    refreshToken,
  });
  return response.data.success;
}; 