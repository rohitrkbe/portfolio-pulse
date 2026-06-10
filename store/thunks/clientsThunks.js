import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchClients = createAsyncThunk(
  'clients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/clients');
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message || 'Failed to fetch clients');
      }
      return res.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  },
  {
    // Skip if already loading OR if data is cached — prevents React Strict Mode double-dispatch
    // and redundant re-fetches when navigating back to the dashboard
    condition: (_, { getState }) => {
      const { loading, items } = getState().clients;
      return !loading && items.length === 0;
    },
  }
);
