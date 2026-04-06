import { createSlice } from '@reduxjs/toolkit';
import { mockClients } from '@/data/mockData';

const clientSlice = createSlice({
  name: 'clients',
  initialState: {
    clients: mockClients,
    loading: false,
  },
  reducers: {
    addClient(state, action) {
      state.clients.unshift(action.payload);
    },
    updateClient(state, action) {
      const idx = state.clients.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) state.clients[idx] = action.payload;
    },
  },
});

export const { addClient, updateClient } = clientSlice.actions;
export default clientSlice.reducer;
