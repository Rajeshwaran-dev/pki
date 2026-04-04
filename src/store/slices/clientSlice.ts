import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client, mockClients } from '@/data/mockData';

interface ClientState {
  clients: Client[];
  loading: boolean;
}

const initialState: ClientState = {
  clients: mockClients,
  loading: false,
};

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    addClient(state, action: PayloadAction<Client>) {
      state.clients.unshift(action.payload);
    },
    updateClient(state, action: PayloadAction<Client>) {
      const idx = state.clients.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) state.clients[idx] = action.payload;
    },
  },
});

export const { addClient, updateClient } = clientSlice.actions;
export default clientSlice.reducer;
