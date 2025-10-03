import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Async thunks for API calls
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async ({ jobId, filters = {} }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (jobId) queryParams.append('jobId', jobId);
      
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await API.get(`/applications?${queryParams}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

export const fetchApplicationById = createAsyncThunk(
  'applications/fetchApplicationById',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch application');
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateApplicationStatus',
  async ({ applicationId, status, note }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/applications/${applicationId}/status`, {
        status,
        note
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update application status');
    }
  }
);

export const bulkUpdateApplications = createAsyncThunk(
  'applications/bulkUpdateApplications',
  async ({ applicationIds, action, data }, { rejectWithValue }) => {
    try {
      const response = await API.patch('/applications/bulk', {
        applicationIds,
        action,
        ...data
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update applications');
    }
  }
);

export const scheduleInterview = createAsyncThunk(
  'applications/scheduleInterview',
  async ({ applicationId, interviewData }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/applications/${applicationId}/interview`, interviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to schedule interview');
    }
  }
);

export const addApplicationNote = createAsyncThunk(
  'applications/addApplicationNote',
  async ({ applicationId, note }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/applications/${applicationId}/notes`, { note });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add note');
    }
  }
);

export const rateApplication = createAsyncThunk(
  'applications/rateApplication',
  async ({ applicationId, rating, criteria }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/applications/${applicationId}/rating`, {
        rating,
        criteria
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to rate application');
    }
  }
);

export const exportApplications = createAsyncThunk(
  'applications/exportApplications',
  async ({ applicationIds, format = 'csv' }, { rejectWithValue }) => {
    try {
      const response = await API.post('/applications/export', {
        applicationIds,
        format
      }, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applications-export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export applications');
    }
  }
);

export const sendBulkEmail = createAsyncThunk(
  'applications/sendBulkEmail',
  async ({ applicationIds, template, customMessage }, { rejectWithValue }) => {
    try {
      const response = await API.post('/applications/bulk-email', {
        applicationIds,
        template,
        customMessage
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send emails');
    }
  }
);

const initialState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    experience: 'all',
    location: 'all',
    education: 'all',
    rating: 'all',
    dateRange: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  },
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  },
  stats: {
    total: 0,
    applied: 0,
    under_review: 0,
    shortlisted: 0,
    interviewed: 0,
    hired: 0,
    rejected: 0,
    on_hold: 0
  },
  bulkOperations: {
    loading: false,
    error: null,
    selectedIds: []
  },
  interviews: [],
  notes: {},
  ratings: {},
  emailTemplates: []
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.bulkOperations.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedApplications: (state, action) => {
      state.bulkOperations.selectedIds = action.payload;
    },
    addSelectedApplication: (state, action) => {
      if (!state.bulkOperations.selectedIds.includes(action.payload)) {
        state.bulkOperations.selectedIds.push(action.payload);
      }
    },
    removeSelectedApplication: (state, action) => {
      state.bulkOperations.selectedIds = state.bulkOperations.selectedIds.filter(
        id => id !== action.payload
      );
    },
    clearSelectedApplications: (state) => {
      state.bulkOperations.selectedIds = [];
    },
    updateApplicationInList: (state, action) => {
      const { id, data } = action.payload;
      const index = state.applications.findIndex(app => app.id === id);
      if (index !== -1) {
        state.applications[index] = { ...state.applications[index], ...data };
      }
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setCurrentApplication: (state, action) => {
      state.currentApplication = action.payload;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications || action.payload;
        state.stats = action.payload.stats || state.stats;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Application by ID
      .addCase(fetchApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Application Status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status, note } = action.payload;
        
        // Update in applications list
        const index = state.applications.findIndex(app => app.id === id);
        if (index !== -1) {
          state.applications[index].status = status;
          if (note) {
            state.applications[index].notes = note;
          }
        }
        
        // Update current application if it matches
        if (state.currentApplication && state.currentApplication.id === id) {
          state.currentApplication.status = status;
          if (note) {
            state.currentApplication.notes = note;
          }
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Bulk Update Applications
      .addCase(bulkUpdateApplications.pending, (state) => {
        state.bulkOperations.loading = true;
        state.bulkOperations.error = null;
      })
      .addCase(bulkUpdateApplications.fulfilled, (state, action) => {
        state.bulkOperations.loading = false;
        state.bulkOperations.selectedIds = [];
        
        // Update applications in state
        const updatedApplications = action.payload.applications || [];
        updatedApplications.forEach(updatedApp => {
          const index = state.applications.findIndex(app => app.id === updatedApp.id);
          if (index !== -1) {
            state.applications[index] = { ...state.applications[index], ...updatedApp };
          }
        });
        
        // Update stats if provided
        if (action.payload.stats) {
          state.stats = action.payload.stats;
        }
      })
      .addCase(bulkUpdateApplications.rejected, (state, action) => {
        state.bulkOperations.loading = false;
        state.bulkOperations.error = action.payload;
      })

      // Schedule Interview
      .addCase(scheduleInterview.fulfilled, (state, action) => {
        const { applicationId, interview } = action.payload;
        
        // Update application
        const index = state.applications.findIndex(app => app.id === applicationId);
        if (index !== -1) {
          state.applications[index].interviewScheduled = interview.scheduledDate;
          state.applications[index].status = 'interviewed';
        }
        
        // Add to interviews
        state.interviews.push(interview);
      })

      // Add Application Note
      .addCase(addApplicationNote.fulfilled, (state, action) => {
        const { applicationId, note } = action.payload;
        if (!state.notes[applicationId]) {
          state.notes[applicationId] = [];
        }
        state.notes[applicationId].push(note);
      })

      // Rate Application
      .addCase(rateApplication.fulfilled, (state, action) => {
        const { applicationId, rating, criteria } = action.payload;
        
        // Update rating in state
        state.ratings[applicationId] = { rating, criteria };
        
        // Update application rating
        const index = state.applications.findIndex(app => app.id === applicationId);
        if (index !== -1) {
          state.applications[index].rating = rating;
        }
      })

      // Export Applications
      .addCase(exportApplications.fulfilled, (state) => {
        // Export completed successfully
      })

      // Send Bulk Email
      .addCase(sendBulkEmail.pending, (state) => {
        state.bulkOperations.loading = true;
      })
      .addCase(sendBulkEmail.fulfilled, (state, action) => {
        state.bulkOperations.loading = false;
        // Mark applications as having received email
        const sentTo = action.payload.sentTo || [];
        sentTo.forEach(applicationId => {
          const index = state.applications.findIndex(app => app.id === applicationId);
          if (index !== -1) {
            state.applications[index].lastEmailSent = new Date().toISOString();
          }
        });
      })
      .addCase(sendBulkEmail.rejected, (state, action) => {
        state.bulkOperations.loading = false;
        state.bulkOperations.error = action.payload;
      });
  }
});

export const {
  clearError,
  setFilters,
  resetFilters,
  setSelectedApplications,
  addSelectedApplication,
  removeSelectedApplication,
  clearSelectedApplications,
  updateApplicationInList,
  setPagination,
  setCurrentApplication,
  clearCurrentApplication
} = applicationsSlice.actions;

export default applicationsSlice.reducer;