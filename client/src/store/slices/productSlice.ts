import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';
import * as productService from '../../services/products';
import { CreateProductRequest, UpdateProductRequest } from '../../services/products';

interface ProductState {
  items: Product[];
  selectedProduct: Product | null;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: {
    searchTerm?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    includeOutOfStock: boolean;
  };
}

const initialState: ProductState = {
  items: [],
  selectedProduct: null,
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  loading: false,
  error: null,
  filters: {
    includeOutOfStock: true,
  },
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({
    pageNumber,
    pageSize,
    searchTerm,
    categoryId,
    minPrice,
    maxPrice,
    includeOutOfStock,
  }: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    includeOutOfStock?: boolean;
  }) => {
    return await productService.getProducts(
      pageNumber,
      pageSize,
      searchTerm,
      categoryId,
      minPrice,
      maxPrice,
      includeOutOfStock
    );
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id: number) => {
    return await productService.getProduct(id);
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (product: CreateProductRequest) => {
    return await productService.createProduct(product);
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, product }: { id: number; product: UpdateProductRequest }) => {
    return await productService.updateProduct(id, product);
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: number) => {
    await productService.deleteProduct(id);
    return id;
  }
);

export const updateStock = createAsyncThunk(
  'products/updateStock',
  async ({ id, quantity }: { id: number; quantity: number }) => {
    const success = await productService.updateStock(id, quantity);
    if (success) {
      return { id, quantity };
    }
    throw new Error('Stok güncellenemedi');
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setFilters: (state, action: PayloadAction<Partial<ProductState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.totalCount = action.payload.totalCount;
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ürünler yüklenemedi';
      });

    // Fetch Product
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ürün yüklenemedi';
      });

    // Create Product
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.totalCount += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ürün oluşturulamadı';
      });

    // Update Product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ürün güncellenemedi';
      });

    // Delete Product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ürün silinemedi';
      });

    // Update Stock
    builder
      .addCase(updateStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.loading = false;
        const product = state.items.find((item) => item.id === action.payload.id);
        if (product) {
          product.stock -= action.payload.quantity;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct.stock -= action.payload.quantity;
        }
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Stok güncellenemedi';
      });
  },
});

export const { setSelectedProduct, clearSelectedProduct, setFilters, clearFilters } =
  productSlice.actions;

export default productSlice.reducer; 