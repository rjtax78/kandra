import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';
import { mockOffres } from '../../data/mockOffres';

// Async thunks for job operations
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { 
        page = 1, 
        limit = 12, 
        search = '', 
        category = '', 
        jobType = '', 
        experienceLevel = '', 
        minSalary = 0, 
        maxSalary = 100000 
      } = params;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter mock data based on search and filters
      let filteredJobs = [...mockOffres];
      
      if (search) {
        filteredJobs = filteredJobs.filter(job => 
          job.titre.toLowerCase().includes(search.toLowerCase()) ||
          job.description.toLowerCase().includes(search.toLowerCase()) ||
          job.entreprise_nom.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (category && category !== 'Anytime') {
        filteredJobs = filteredJobs.filter(job => 
          job.competences_requises.some(skill => 
            skill.toLowerCase().includes(category.toLowerCase())
          )
        );
      }
      
      if (experienceLevel) {
        filteredJobs = filteredJobs.filter(job => 
          job.niveau_experience.toLowerCase().includes(experienceLevel.toLowerCase())
        );
      }
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
      
      return {
        data: paginatedJobs,
        pagination: {
          total: filteredJobs.length,
          totalPages: Math.ceil(filteredJobs.length / limit),
          currentPage: page,
          hasMore: endIndex < filteredJobs.length
        }
      };
      
      // Original API call (commented out for now)
      // const queryParams = new URLSearchParams({
      //   page: page.toString(),
      //   limit: limit.toString(),
      //   ...(search && { search }),
      //   ...(category && { category }),
      //   ...(jobType && { jobType }),
      //   ...(experienceLevel && { experienceLevel }),
      //   ...(minSalary > 0 && { minSalary: minSalary.toString() }),
      //   ...(maxSalary < 100000 && { maxSalary: maxSalary.toString() }),
      // });
      // const response = await API.get(`/opportunite?${queryParams}`);
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch jobs' });
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (jobId, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const job = mockOffres.find(job => job.id === parseInt(jobId));
      if (!job) {
        throw new Error('Job not found');
      }
      
      return job;
      
      // Original API call (commented out for now)
      // const response = await API.get(`/opportunite/${jobId}`);
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch job details' });
    }
  }
);

export const saveJob = createAsyncThunk(
  'jobs/saveJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await API.post(`/opportunite/${jobId}/save`);
      return { jobId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to save job' });
    }
  }
);

export const unsaveJob = createAsyncThunk(
  'jobs/unsaveJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/opportunite/${jobId}/save`);
      return { jobId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to unsave job' });
    }
  }
);

export const applyToJob = createAsyncThunk(
  'jobs/applyToJob',
  async ({ jobId, applicationData }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/candidature`, {
        opportunite_id: jobId,
        ...applicationData
      });
      return { jobId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to apply to job' });
    }
  }
);

const initialState = {
  jobs: [],
  currentJob: null,
  savedJobs: [],
  appliedJobs: [],
  isLoading: false,
  error: null,
  totalJobs: 0,
  currentPage: 1,
  totalPages: 0,
  hasMore: false,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    resetJobs: (state) => {
      state.jobs = [];
      state.currentPage = 1;
      state.totalPages = 0;
      state.hasMore = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data, pagination } = action.payload || {};
        const jobsData = data || [];
        
        if (state.currentPage === 1) {
          state.jobs = jobsData;
        } else {
          state.jobs = [...state.jobs, ...jobsData];
        }
        
        state.totalJobs = pagination?.total || jobsData.length;
        state.totalPages = pagination?.totalPages || 1;
        state.hasMore = pagination?.hasMore || false;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error || 'Failed to fetch jobs';
      })
      
      // Fetch Job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error || 'Failed to fetch job details';
      })
      
      // Save Job
      .addCase(saveJob.pending, (state) => {
        state.error = null;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        const { jobId } = action.payload;
        if (!state.savedJobs.includes(jobId)) {
          state.savedJobs.push(jobId);
        }
        // Update job in the list if present
        const jobIndex = state.jobs.findIndex(job => job.id === jobId);
        if (jobIndex !== -1) {
          state.jobs[jobIndex].isSaved = true;
        }
      })
      .addCase(saveJob.rejected, (state, action) => {
        state.error = action.payload?.error || 'Failed to save job';
      })
      
      // Unsave Job
      .addCase(unsaveJob.fulfilled, (state, action) => {
        const { jobId } = action.payload;
        state.savedJobs = state.savedJobs.filter(id => id !== jobId);
        // Update job in the list if present
        const jobIndex = state.jobs.findIndex(job => job.id === jobId);
        if (jobIndex !== -1) {
          state.jobs[jobIndex].isSaved = false;
        }
      })
      .addCase(unsaveJob.rejected, (state, action) => {
        state.error = action.payload?.error || 'Failed to unsave job';
      })
      
      // Apply to Job
      .addCase(applyToJob.pending, (state) => {
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        const { jobId } = action.payload;
        if (!state.appliedJobs.includes(jobId)) {
          state.appliedJobs.push(jobId);
        }
        // Update job in the list if present
        const jobIndex = state.jobs.findIndex(job => job.id === jobId);
        if (jobIndex !== -1) {
          state.jobs[jobIndex].hasApplied = true;
        }
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.error = action.payload?.error || 'Failed to apply to job';
      });
  },
});

export const { clearError, clearCurrentJob, setCurrentPage, resetJobs } = jobSlice.actions;
export default jobSlice.reducer;