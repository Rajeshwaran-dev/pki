import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import uiSlice from './slices/uiSlice';
import projectSlice from './slices/projectSlice';
import clientSlice from './slices/clientSlice';
import taskSlice from './slices/taskSlice';
import authSlice from './slices/authSlice';
import enquirySlice from './slices/enquirySlice';

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    projects: projectSlice,
    clients: clientSlice,
    tasks: taskSlice,
    auth: authSlice,
    enquiry: enquirySlice,
  },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
