import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import jobSlice from './slices/jobSlice';
import jobsSlice from './slices/jobsSlice';
import filterSlice from './slices/filterSlice';
import companySlice from './slices/companySlice';
import applicationsSlice from './slices/applicationsSlice';
import applicationSlice from './slices/applicationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    jobs: jobSlice,
    studentJobs: jobsSlice,
    filters: filterSlice,
    company: companySlice,
    applications: applicationsSlice,
    studentApplications: applicationSlice,
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
