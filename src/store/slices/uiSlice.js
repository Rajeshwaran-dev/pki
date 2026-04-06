import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: localStorage.getItem('theme') || 'light',
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setSidebarCollapsed(state, action) {
      state.sidebarCollapsed = action.payload;
    },
    setMobileSidebarOpen(state, action) {
      state.mobileSidebarOpen = action.payload;
    },
  },
});

export const { toggleTheme, setSidebarCollapsed, setMobileSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
