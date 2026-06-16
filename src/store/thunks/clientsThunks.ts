import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest, ApiError } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { RootState, Client } from '@/types';

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
      return await apiRequest<FetchClientsResponse>({
        url: ENDPOINTS.clients.list,
      });
    } catch (err) {
      return rejectWithValue(err instanceof ApiError ? err.message : 'Network error');
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading, items } = getState().clients;
      return !loading && items.length === 0;
    },
  }
);
