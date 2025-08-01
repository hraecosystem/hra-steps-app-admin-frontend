import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./authStore"
import axiosIns from 'plugins/axios';

export const store = configureStore({
  reducer: {
        auth: authReducer
  },
});

axiosIns.interceptors.request.use((req) => {
  const auth = store.getState().auth;
  if (auth.isAuth && auth.accessToken) {
    req.headers.Authorization = `Bearer ${auth.accessToken}`;
  } 
  return req;
});