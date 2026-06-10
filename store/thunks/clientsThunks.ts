import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/types';
import type { Client } from '@/types';

interface FetchClientsResponse {
  clients: Client[];
  total: number;
}

export const fetchClients = createAsyncThunk<
  FetchClientsResponse,
  void,
  { state: RootState; rejectValue: string }
>(
  'clients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/clients');
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue((err.message as string) || 'Failed to fetch clients');
      }
      return res.json() as Promise<FetchClientsResponse>;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Network error');
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
