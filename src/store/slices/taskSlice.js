import { createSlice } from '@reduxjs/toolkit';
import { mockTasks } from '@/data/mockData';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: mockTasks,
    loading: false,
    viewMode: 'board',
  },
  reducers: {
    addTask(state, action) {
      state.tasks.unshift(action.payload);
    },
    updateTask(state, action) {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.tasks[idx] = action.payload;
    },
    moveTask(state, action) {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) task.status = action.payload.newStatus;
    },
    setViewMode(state, action) {
      state.viewMode = action.payload;
    },
  },
});

export const { addTask, updateTask, moveTask, setViewMode } = taskSlice.actions;
export default taskSlice.reducer;
