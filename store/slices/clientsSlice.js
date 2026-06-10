import { createSlice } from '@reduxjs/toolkit';
import { SORT_FIELDS, SORT_ORDERS, RISK_PROFILE_ORDER } from '@/lib/constants';
import { fetchClients } from '@/store/thunks/clientsThunks';

// Async thunks live in store/thunks/clientsThunks.js
// This file owns: state shape, synchronous reducers, selectors, and extraReducers wiring

const initialState = {
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
    order: SORT_ORDERS.DESC,
  },
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setRiskFilter(state, action) {
      state.filters.riskProfile = action.payload;
    },
    setRebalancingFilter(state, action) {
      state.filters.requiresRebalancing = action.payload;
    },
    setSearchQuery(state, action) {
      state.filters.searchQuery = action.payload;
    },
    setSort(state, action) {
      const { field, order } = action.payload;
      state.sort.field = field;
      state.sort.order = order ?? SORT_ORDERS.DESC;
    },
    toggleSortOrder(state) {
      state.sort.order =
        state.sort.order === SORT_ORDERS.ASC ? SORT_ORDERS.DESC : SORT_ORDERS.ASC;
    },
    markRebalancingReviewed(state, action) {
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
        state.error = action.payload;
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

export const selectAllClients = (state) => state.clients.items;
export const selectClientsLoading = (state) => state.clients.loading;
export const selectClientsError = (state) => state.clients.error;
export const selectFilters = (state) => state.clients.filters;
export const selectSort = (state) => state.clients.sort;

export const selectFilteredSortedClients = (state) => {
  const { items, filters, sort } = state.clients;

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
    let aVal = a[sort.field];
    let bVal = b[sort.field];

    if (sort.field === SORT_FIELDS.RISK) {
      aVal = RISK_PROFILE_ORDER[a.riskProfile] ?? 0;
      bVal = RISK_PROFILE_ORDER[b.riskProfile] ?? 0;
    }

    if (typeof aVal === 'string') {
      return sort.order === SORT_ORDERS.ASC
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return sort.order === SORT_ORDERS.ASC ? aVal - bVal : bVal - aVal;
  });

  return result;
};

export const selectClientsSummary = (state) => {
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
