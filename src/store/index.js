import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import uiSlice from './slices/uiSlice';
import projectSlice from './slices/projectSlice';
import clientSlice from './slices/clientSlice';
import taskSlice from './slices/taskSlice';
import authSlice from './slices/authSlice';

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    projects: projectSlice,
    clients: clientSlice,
    tasks: taskSlice,
    auth: authSlice,
  },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
