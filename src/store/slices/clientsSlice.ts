import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { SORT_FIELDS, SORT_ORDERS, RISK_PROFILE_ORDER } from '@/constants/domain';
import type { ClientsState, Client, RootState, ClientsSummary, SortDirection } from '@/types';
import { fetchClients } from '@/store/thunks/clientsThunks';

// Async thunks live in store/thunks/clientsThunks.ts
// This file owns: state shape, synchronous reducers, selectors, and extraReducers wiring

const initialState: ClientsState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    riskProfile: 'All',
    requiresRebalancing: false,
    searchQuery: '',
  },
  sort: {
    field: SORT_FIELDS.AUM,
    order: 'desc',
  },
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setRiskFilter(state, action: PayloadAction<string>) {
      state.filters.riskProfile = action.payload;
    },
    setRebalancingFilter(state, action: PayloadAction<boolean>) {
      state.filters.requiresRebalancing = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.filters.searchQuery = action.payload;
    },
    setSort(state, action: PayloadAction<{ field: string; order?: SortDirection }>) {
      const { field, order } = action.payload;
      state.sort.field = field;
      state.sort.order = order ?? 'desc';
    },
    toggleSortOrder(state) {
      state.sort.order = state.sort.order === 'asc' ? 'desc' : 'asc';
    },
    markRebalancingReviewed(state, action: PayloadAction<string>) {
      const client = state.items.find((c) => c.id === action.payload);
      if (client) client.requiresRebalancing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.clients;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to fetch clients';
      });
  },
});

export const {
  setRiskFilter,
  setRebalancingFilter,
  setSearchQuery,
  setSort,
  toggleSortOrder,
  markRebalancingReviewed,
} = clientsSlice.actions;

export const selectAllClients = (state: RootState): Client[] => state.clients.items;
export const selectClientById = (state: RootState, id: string): Client | undefined =>
  state.clients.items.find((c) => c.id === id);
export const selectClientsLoading = (state: RootState): boolean => state.clients.loading;
export const selectClientsError = (state: RootState): string | null => state.clients.error;
export const selectFilters = (state: RootState) => state.clients.filters;
export const selectSort = (state: RootState) => state.clients.sort;

export const selectFilteredSortedClients = createSelector(
  (state: RootState) => state.clients.items,
  (state: RootState) => state.clients.filters,
  (state: RootState) => state.clients.sort,
  (items, filters, sort): Client[] => {
    let result = [...items];

    if (filters.riskProfile !== 'All') {
      result = result.filter((c) => c.riskProfile === filters.riskProfile);
    }
    if (filters.requiresRebalancing) {
      result = result.filter((c) => c.requiresRebalancing);
    }
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.clientId.toLowerCase().includes(q) ||
          c.city?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let aVal: string | number = (a as unknown as Record<string, unknown>)[sort.field] as string | number;
      let bVal: string | number = (b as unknown as Record<string, unknown>)[sort.field] as string | number;

      if (sort.field === SORT_FIELDS.RISK) {
        aVal = RISK_PROFILE_ORDER[a.riskProfile] ?? 0;
        bVal = RISK_PROFILE_ORDER[b.riskProfile] ?? 0;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sort.order === SORT_ORDERS.ASC
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sort.order === SORT_ORDERS.ASC
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return result;
  }
);

export const selectClientsSummary = (state: RootState): ClientsSummary => {
  const clients = state.clients.items;
  return {
    totalClients: clients.length,
    totalAUM: clients.reduce((sum, c) => sum + c.aum, 0),
    alertCount: clients.filter((c) => c.requiresRebalancing).length,
    avgReturnYTD:
      clients.length > 0
        ? clients.reduce((sum, c) => sum + c.returnYTD, 0) / clients.length
        : 0,
  };
};

export default clientsSlice.reducer;
