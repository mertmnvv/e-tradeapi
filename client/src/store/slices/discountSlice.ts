import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Discount } from '../../types';
import * as discountService from '../../services/discounts';
import { CreateDiscountRequest, UpdateDiscountRequest } from '../../services/discounts';

interface DiscountState {
  items: Discount[];
  selectedDiscount: Discount | null;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: {
    searchTerm?: string;
    isActive?: boolean;
  };
}

const initialState: DiscountState = {
  items: [],
  selectedDiscount: null,
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  loading: false,
  error: null,
  filters: {},
};

export const fetchDiscounts = createAsyncThunk(
  'discounts/fetchDiscounts',
  async ({
    pageNumber,
    pageSize,
    searchTerm,
    isActive,
  }: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    isActive?: boolean;
  }) => {
    return await discountService.getDiscounts(pageNumber, pageSize, searchTerm, isActive);
  }
);

export const fetchDiscount = createAsyncThunk(
  'discounts/fetchDiscount',
  async (id: number) => {
    return await discountService.getDiscount(id);
  }
);

export const createDiscount = createAsyncThunk(
  'discounts/createDiscount',
  async (discount: CreateDiscountRequest) => {
    return await discountService.createDiscount(discount);
  }
);

export const updateDiscount = createAsyncThunk(
  'discounts/updateDiscount',
  async ({ id, discount }: { id: number; discount: UpdateDiscountRequest }) => {
    return await discountService.updateDiscount(id, discount);
  }
);

export const deleteDiscount = createAsyncThunk(
  'discounts/deleteDiscount',
  async (id: number) => {
    await discountService.deleteDiscount(id);
    return id;
  }
);

const discountSlice = createSlice({
  name: 'discounts',
  initialState,
  reducers: {
    setSelectedDiscount: (state, action: PayloadAction<Discount | null>) => {
      state.selectedDiscount = action.payload;
    },
    clearSelectedDiscount: (state) => {
      state.selectedDiscount = null;
    },
    setFilters: (state, action: PayloadAction<Partial<DiscountState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    // Fetch Discounts
    builder
      .addCase(fetchDiscounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.totalCount = action.payload.totalCount;
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'İndirimler yüklenemedi';
      });

    // Fetch Discount
    builder
      .addCase(fetchDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDiscount = action.payload;
      })
      .addCase(fetchDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'İndirim yüklenemedi';
      });

    // Create Discount
    builder
      .addCase(createDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.totalCount += 1;
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'İndirim oluşturulamadı';
      });

    // Update Discount
    builder
      .addCase(updateDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDiscount.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedDiscount?.id === action.payload.id) {
          state.selectedDiscount = action.payload;
        }
      })
      .addCase(updateDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'İndirim güncellenemedi';
      });

    // Delete Discount
    builder
      .addCase(deleteDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedDiscount?.id === action.payload) {
          state.selectedDiscount = null;
        }
      })
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'İndirim silinemedi';
      });
  },
});

export const { setSelectedDiscount, clearSelectedDiscount, setFilters, clearFilters } =
  discountSlice.actions;

export default discountSlice.reducer; 