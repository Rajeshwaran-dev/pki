import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    role: string;
    phone: string;
    company: string;
    avatar: string;
  } | null;
}

const stored = localStorage.getItem('auth');
const parsed = stored ? JSON.parse(stored) : null;

const initialState: AuthState = {
  isAuthenticated: !!parsed,
  user: parsed,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ email: string; password: string }>) {
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
