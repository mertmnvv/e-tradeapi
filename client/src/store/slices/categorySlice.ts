import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types';
import * as categoryService from '../../services/categories';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../../services/categories';

interface CategoryState {
  items: Category[];
  selectedCategory: Category | null;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  items: [],
  selectedCategory: null,
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async ({ pageNumber, pageSize, searchTerm }: { pageNumber?: number; pageSize?: number; searchTerm?: string }) => {
    return await categoryService.getCategories(pageNumber, pageSize, searchTerm);
  }
);

export const fetchCategory = createAsyncThunk(
  'categories/fetchCategory',
  async (id: number) => {
    return await categoryService.getCategory(id);
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (category: CreateCategoryRequest) => {
    return await categoryService.createCategory(category);
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, category }: { id: number; category: UpdateCategoryRequest }) => {
    return await categoryService.updateCategory(id, category);
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number) => {
    await categoryService.deleteCategory(id);
    return id;
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.totalCount = action.payload.totalCount;
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Kategoriler yüklenemedi';
      });

    // Fetch Category
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Kategori yüklenemedi';
      });

    // Create Category
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.totalCount += 1;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Kategori oluşturulamadı';
      });

    // Update Category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedCategory?.id === action.payload.id) {
          state.selectedCategory = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Kategori güncellenemedi';
      });

    // Delete Category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedCategory?.id === action.payload) {
          state.selectedCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Kategori silinemedi';
      });
  },
});

export const { setSelectedCategory, clearSelectedCategory } = categorySlice.actions;

export default categorySlice.reducer; 