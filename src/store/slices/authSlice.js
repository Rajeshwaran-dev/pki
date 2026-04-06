import { createSlice } from '@reduxjs/toolkit';

const stored = localStorage.getItem('auth');
const parsed = stored ? JSON.parse(stored) : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!parsed,
    user: parsed,
  },
  reducers: {
    login(state, action) {
      const { email, password } = action.payload;
      if (email === 'superadmin@gmail.com' && password === '123456') {
        const user = {
          name: 'Super Admin',
          email: 'superadmin@gmail.com',
          role: 'Super Admin',
          phone: '+91 98765 43210',
          company: 'Perspective Kitchens & Interiors Pvt Ltd',
          avatar: 'SA',
        };
        state.isAuthenticated = true;
        state.user = user;
        localStorage.setItem('auth', JSON.stringify(user));
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('auth');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
