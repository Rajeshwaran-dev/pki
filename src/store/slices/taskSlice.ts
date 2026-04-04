import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus, mockTasks } from '@/data/mockData';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  viewMode: 'board' | 'list';
}

const initialState: TaskState = {
  tasks: mockTasks,
  loading: false,
  viewMode: 'board',
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.unshift(action.payload);
    },
    updateTask(state, action: PayloadAction<Task>) {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.tasks[idx] = action.payload;
    },
    moveTask(state, action: PayloadAction<{ taskId: string; newStatus: TaskStatus }>) {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) task.status = action.payload.newStatus;
    },
    setViewMode(state, action: PayloadAction<'board' | 'list'>) {
      state.viewMode = action.payload;
    },
  },
});

export const { addTask, updateTask, moveTask, setViewMode } = taskSlice.actions;
export default taskSlice.reducer;
