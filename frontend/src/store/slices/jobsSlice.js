import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Async thunks for job operations
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('🚀 fetchJobs called with params:', params);
      
      const { 
        typeOffre, 
        category, 
        experienceLevel, 
        salaryMin, 
        salaryMax, 
        search, 
        limit = 20, 
        offset = 0 
      } = params;
      
      const queryParams = new URLSearchParams();
      
      // Add parameters only if they have valid values
      if (typeOffre && typeOffre !== 'all' && typeOffre !== 'anytime') {
        queryParams.append('typeOffre', typeOffre);
      }
      if (category && category !== 'anytime' && category !== 'all') {
        queryParams.append('category', category);
      }
      if (experienceLevel && experienceLevel !== 'all') {
        queryParams.append('experienceLevel', experienceLevel);
      }
      if (salaryMin && salaryMin > 0) {
        queryParams.append('salaryMin', salaryMin.toString());
      }
      if (salaryMax && salaryMax > 0) {
        queryParams.append('salaryMax', salaryMax.toString());
      }
      if (search && search.trim()) {
        queryParams.append('search', search.trim());
      }
      
      queryParams.append('limit', limit.toString());
      queryParams.append('offset', offset.toString());
      queryParams.append('statut', 'publiee'); // Only show published jobs

      const apiUrl = `/opportunites?${queryParams.toString()}`;
      console.log('🌐 API URL:', apiUrl);
      
      const response = await API.get(apiUrl);
      console.log('✅ API Response:', response.data);
      
      return {
        jobs: response.data || [],
        hasMore: (response.data || []).length === limit,
        offset: offset + limit
      };
    } catch (error) {
      console.error('❌ fetchJobs error:', error);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch jobs');
    }
  }
);

export const fetchJobDetails = createAsyncThunk(
  'jobs/fetchJobDetails',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/opportunites/${jobId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch job details');
    }
  }
);

export const searchJobs = createAsyncThunk(
  'jobs/searchJobs',
  async (searchParams, { rejectWithValue }) => {
    try {
      const { query, filters = {} } = searchParams;
      const params = {
        search: query,
        ...filters,
        limit: 20,
        offset: 0
      };
      
      const result = await fetchJobs(params, { rejectWithValue });
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to search jobs');
    }
  }
);

export const bookmarkJob = createAsyncThunk(
  'jobs/bookmarkJob',
  async ({ jobId, isBookmarked }, { rejectWithValue }) => {
    try {
      if (isBookmarked) {
        await API.delete(`/candidatures/bookmark/${jobId}`);
      } else {
        await API.post(`/candidatures/bookmark`, { jobId });
      }
      return { jobId, isBookmarked: !isBookmarked };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to bookmark job');
    }
  }
);

export const applyToJob = createAsyncThunk(
  'jobs/applyToJob',
  async ({ jobId, applicationData }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/candidatures`, {
        offreId: jobId,
        ...applicationData
      });
      return { jobId, application: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to apply to job');
    }
  }
);

const initialState = {
  // Job listings
  jobs: [],
  filteredJobs: [],
  featuredJobs: [],
  
  // Current job details
  selectedJob: null,
  
  // Pagination
  currentPage: 1,
  hasMore: true,
  totalJobs: 0,
  
  // Search and filters
  searchQuery: '',
  filters: {
    category: 'anytime',
    jobTypes: {
      fulltime: false,
      internship: false,
      freelance: false,
      volunteer: false
    },
    experienceLevels: {
      entry: false,
      intermediate: false,
      expert: false
    },
    salaryRange: [10, 100],
    salaryFilters: {
      under100: false,
      '100to1k': false,
      hourly: false
    },
    proposalRange: null
  },
  
  // User interactions
  bookmarkedJobs: [],
  appliedJobs: [],
  
  // Loading states
  isLoading: false,
  isLoadingMore: false,
  isSearching: false,
  isBookmarking: false,
  isApplying: false,
  
  // Error states
  error: null,
  searchError: null,
  bookmarkError: null,
  applicationError: null,
  
  // UI states
  showFilters: false,
  viewMode: 'grid' // grid or list
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.searchError = null;
      state.bookmarkError = null;
      state.applicationError = null;
    },
    
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    toggleFilter: (state, action) => {
      const { filterType, filterName } = action.payload;
      if (state.filters[filterType] && typeof state.filters[filterType] === 'object') {
        state.filters[filterType][filterName] = !state.filters[filterType][filterName];
      }
    },
    
    setSalaryRange: (state, action) => {
      state.filters.salaryRange = action.payload;
    },
    
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },
    
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
    
    toggleShowFilters: (state) => {
      state.showFilters = !state.showFilters;
    },
    
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    
    resetJobs: (state) => {
      state.jobs = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    
    updateJobInList: (state, action) => {
      const { jobId, updates } = action.payload;
      const jobIndex = state.jobs.findIndex(job => job.id === jobId);
      if (jobIndex !== -1) {
        state.jobs[jobIndex] = { ...state.jobs[jobIndex], ...updates };
      }
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state, action) => {
        if (action.meta.arg.offset === 0) {
          state.isLoading = true;
          state.jobs = [];
        } else {
          state.isLoadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        
        const jobs = action.payload?.jobs || action.payload || [];
        
        if (action.meta.arg.offset === 0) {
          state.jobs = jobs;
        } else {
          state.jobs.push(...jobs);
        }
        
        state.hasMore = action.payload?.hasMore || false;
        state.totalJobs = state.jobs.length;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = action.payload;
      })
      
      // Fetch Job Details
      .addCase(fetchJobDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Search Jobs
      .addCase(searchJobs.pending, (state) => {
        state.isSearching = true;
        state.searchError = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.isSearching = false;
        const jobs = action.payload?.jobs || action.payload || [];
        state.jobs = jobs;
        state.hasMore = action.payload?.hasMore || false;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload;
      })
      
      // Bookmark Job
      .addCase(bookmarkJob.pending, (state) => {
        state.isBookmarking = true;
        state.bookmarkError = null;
      })
      .addCase(bookmarkJob.fulfilled, (state, action) => {
        state.isBookmarking = false;
        const { jobId, isBookmarked } = action.payload;
        
        if (isBookmarked) {
          if (!state.bookmarkedJobs.includes(jobId)) {
            state.bookmarkedJobs.push(jobId);
          }
        } else {
          state.bookmarkedJobs = state.bookmarkedJobs.filter(id => id !== jobId);
        }
        
        // Update job in the list
        const jobIndex = state.jobs.findIndex(job => job.id === jobId);
        if (jobIndex !== -1) {
          state.jobs[jobIndex].isBookmarked = isBookmarked;
        }
      })
      .addCase(bookmarkJob.rejected, (state, action) => {
        state.isBookmarking = false;
        state.bookmarkError = action.payload;
      })
      
      // Apply to Job
      .addCase(applyToJob.pending, (state) => {
        state.isApplying = true;
        state.applicationError = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.isApplying = false;
        const { jobId } = action.payload;
        
        if (!state.appliedJobs.includes(jobId)) {
          state.appliedJobs.push(jobId);
        }
        
        // Update job in the list
        const jobIndex = state.jobs.findIndex(job => job.id === jobId);
        if (jobIndex !== -1) {
          state.jobs[jobIndex].hasApplied = true;
        }
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.isApplying = false;
        state.applicationError = action.payload;
      });
  }
});

export const {
  clearError,
  setSearchQuery,
  setFilters,
  resetFilters,
  toggleFilter,
  setSalaryRange,
  setSelectedJob,
  clearSelectedJob,
  toggleShowFilters,
  setViewMode,
  resetJobs,
  updateJobInList
} = jobsSlice.actions;

export default jobsSlice.reducer;