import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project, mockProjects } from '@/data/mockData';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  activeTab: string;
}

const initialState: ProjectState = {
  projects: mockProjects,
  loading: false,
  activeTab: 'All',
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject(state, action: PayloadAction<Project>) {
      state.projects.unshift(action.payload);
    },
    updateProject(state, action: PayloadAction<Project>) {
      const idx = state.projects.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.projects[idx] = action.payload;
    },
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
  },
});

export const { addProject, updateProject, setActiveTab } = projectSlice.actions;
export default projectSlice.reducer;
