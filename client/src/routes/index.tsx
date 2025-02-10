import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/shop/HomePage';
import ProductDetailsPage from '../pages/shop/ProductDetailsPage';
import CategoryProductsPage from '../pages/shop/CategoryProductsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products/:id', element: <ProductDetailsPage /> },
      { path: 'categories/:id', element: <CategoryProductsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute roles={['Admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/" replace /> },
    ],
  },
]);

export default router; 