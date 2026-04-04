import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import uiSlice from './slices/uiSlice';
import projectSlice from './slices/projectSlice';
import clientSlice from './slices/clientSlice';
import taskSlice from './slices/taskSlice';

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    projects: projectSlice,
    clients: clientSlice,
    tasks: taskSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
