import { createSlice } from '@reduxjs/toolkit';
import { mockProjects } from '@/data/mockData';

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: mockProjects,
    loading: false,
    activeTab: 'All',
  },
  reducers: {
    addProject(state, action) {
      state.projects.unshift(action.payload);
    },
    updateProject(state, action) {
      const idx = state.projects.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.projects[idx] = action.payload;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
  },
});

export const { addProject, updateProject, setActiveTab } = projectSlice.actions;
export default projectSlice.reducer;
