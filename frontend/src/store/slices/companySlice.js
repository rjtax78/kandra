import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Async thunks for company operations
export const fetchCompanyStats = createAsyncThunk(
  'company/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/opportunites/company/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch company stats' });
    }
  }
);

export const fetchCompanyJobs = createAsyncThunk(
  'company/fetchJobs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { statut, typeOffre, limit = 50, offset = 0 } = params;
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        ...(statut && { statut }),
        ...(typeOffre && { typeOffre }),
      });

      const response = await API.get(`/opportunites/company/offers?${queryParams}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch company jobs' });
    }
  }
);

export const createCompanyJob = createAsyncThunk(
  'company/createJob',
  async (jobData, { rejectWithValue, getState }) => {
    try {
      console.log('Redux: Received job data:', jobData);
      
      // Use the entrepriseId from jobData if provided, otherwise try from auth state
      let entrepriseId = jobData.entrepriseId;
      
      if (!entrepriseId) {
        const { auth } = getState();
        entrepriseId = auth.user?.id;
        console.log('Redux: Getting user ID from auth state:', entrepriseId);
      }
      
      if (!entrepriseId) {
        throw new Error('No company ID found. Please login again.');
      }

      const payload = {
        ...jobData,
        entrepriseId
      };
      
      console.log('Redux: Final API payload:', payload);

      const response = await API.post('/opportunites', payload);
      console.log('Redux: API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Redux: Create job error:', error);
      return rejectWithValue(error.response?.data || { error: 'Failed to create job' });
    }
  }
);

export const updateCompanyJob = createAsyncThunk(
  'company/updateJob',
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/opportunites/${jobId}`, jobData);
      return { jobId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to update job' });
    }
  }
);

export const deleteCompanyJob = createAsyncThunk(
  'company/deleteJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/opportunites/${jobId}`);
      return { jobId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to delete job' });
    }
  }
);

const initialState = {
  // Statistics
  stats: {
    totalOffers: 0,
    activeOffers: 0,
    draftOffers: 0,
    archivedOffers: 0,
    totalApplications: 0,
    avgApplicationsPerOffer: 0
  },
  
  // Jobs data
  jobs: [],
  totalJobs: 0,
  
  // Loading states
  isLoadingStats: false,
  isLoadingJobs: false,
  isCreatingJob: false,
  isUpdatingJob: false,
  isDeletingJob: false,
  
  // Error states
  statsError: null,
  jobsError: null,
  createError: null,
  updateError: null,
  deleteError: null,

  // UI states
  selectedJob: null,
  filters: {
    statut: '',
    typeOffre: '',
    search: ''
  }
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.statsError = null;
      state.jobsError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },
    
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {
        statut: '',
        typeOffre: '',
        search: ''
      };
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch Company Stats
      .addCase(fetchCompanyStats.pending, (state) => {
        state.isLoadingStats = true;
        state.statsError = null;
      })
      .addCase(fetchCompanyStats.fulfilled, (state, action) => {
        state.isLoadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchCompanyStats.rejected, (state, action) => {
        state.isLoadingStats = false;
        state.statsError = action.payload?.error || 'Failed to fetch stats';
      })
      
      // Fetch Company Jobs
      .addCase(fetchCompanyJobs.pending, (state) => {
        state.isLoadingJobs = true;
        state.jobsError = null;
      })
      .addCase(fetchCompanyJobs.fulfilled, (state, action) => {
        state.isLoadingJobs = false;
        state.jobs = action.payload.offers || [];
        state.totalJobs = action.payload.total || 0;
      })
      .addCase(fetchCompanyJobs.rejected, (state, action) => {
        state.isLoadingJobs = false;
        state.jobsError = action.payload?.error || 'Failed to fetch jobs';
      })
      
      // Create Company Job
      .addCase(createCompanyJob.pending, (state) => {
        state.isCreatingJob = true;
        state.createError = null;
      })
      .addCase(createCompanyJob.fulfilled, (state, action) => {
        state.isCreatingJob = false;
        // Optionally add the new job to the list if it was returned
        if (action.payload.offre) {
          state.jobs.unshift(action.payload.offre);
        }
      })
      .addCase(createCompanyJob.rejected, (state, action) => {
        state.isCreatingJob = false;
        state.createError = action.payload?.error || 'Failed to create job';
      })
      
      // Update Company Job
      .addCase(updateCompanyJob.pending, (state) => {
        state.isUpdatingJob = true;
        state.updateError = null;
      })
      .addCase(updateCompanyJob.fulfilled, (state, action) => {
        state.isUpdatingJob = false;
        const { jobId } = action.payload;
        // Update the job in the list
        const jobIndex = state.jobs.findIndex(job => job.id === jobId);
        if (jobIndex !== -1 && action.payload.offer) {
          state.jobs[jobIndex] = action.payload.offer;
        }
      })
      .addCase(updateCompanyJob.rejected, (state, action) => {
        state.isUpdatingJob = false;
        state.updateError = action.payload?.error || 'Failed to update job';
      })
      
      // Delete Company Job
      .addCase(deleteCompanyJob.pending, (state) => {
        state.isDeletingJob = true;
        state.deleteError = null;
      })
      .addCase(deleteCompanyJob.fulfilled, (state, action) => {
        state.isDeletingJob = false;
        const { jobId } = action.payload;
        // Remove the job from the list
        state.jobs = state.jobs.filter(job => job.id !== jobId);
        state.totalJobs = Math.max(0, state.totalJobs - 1);
      })
      .addCase(deleteCompanyJob.rejected, (state, action) => {
        state.isDeletingJob = false;
        state.deleteError = action.payload?.error || 'Failed to delete job';
      });
  },
});

export const { 
  clearErrors, 
  setSelectedJob, 
  clearSelectedJob, 
  setFilters, 
  clearFilters 
} = companySlice.actions;

export default companySlice.reducer;