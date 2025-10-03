import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import jobSlice from './slices/jobSlice';
import filterSlice from './slices/filterSlice';
import companySlice from './slices/companySlice';
import applicationsSlice from './slices/applicationsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    jobs: jobSlice,
    filters: filterSlice,
    company: companySlice,
    applications: applicationsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// For TypeScript usage (if needed later)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
