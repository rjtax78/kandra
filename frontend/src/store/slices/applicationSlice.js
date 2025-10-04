import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:5000/api';

// Submit job application
export const submitJobApplication = createAsyncThunk(
  'application/submit',
  async (applicationData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('jobId', applicationData.jobId);
      formData.append('coverLetter', applicationData.coverLetter);
      formData.append('motivation', applicationData.motivation);
      formData.append('portfolioUrl', applicationData.portfolioUrl);
      formData.append('linkedinUrl', applicationData.linkedinUrl);
      formData.append('additionalNotes', applicationData.additionalNotes);
      formData.append('appliedAt', applicationData.appliedAt);

      // Add files if they exist
      if (applicationData.resume) {
        formData.append('resume', applicationData.resume);
      }
      if (applicationData.portfolio) {
        formData.append('portfolio', applicationData.portfolio);
      }

      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit application');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get user's applications
export const getUserApplications = createAsyncThunk(
  'application/getUserApplications',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/applications/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch applications');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get application details
export const getApplicationDetails = createAsyncThunk(
  'application/getDetails',
  async (applicationId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch application details');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update application status (for tracking)
export const updateApplicationStatus = createAsyncThunk(
  'application/updateStatus',
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update application status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    applications: [],
    currentApplication: null,
    isSubmitting: false,
    isLoading: false,
    error: null,
    successMessage: null,
    applicationStats: {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Submit application
      .addCase(submitJobApplication.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitJobApplication.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.applications.unshift(action.payload.application);
        state.successMessage = 'Application submitted successfully!';
        state.applicationStats.total += 1;
        state.applicationStats.pending += 1;
      })
      .addCase(submitJobApplication.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })
      
      // Get user applications
      .addCase(getUserApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload.applications || [];
        
        // Update stats
        const stats = { total: 0, pending: 0, accepted: 0, rejected: 0 };
        state.applications.forEach(app => {
          stats.total += 1;
          if (app.status === 'pending') stats.pending += 1;
          else if (app.status === 'accepted') stats.accepted += 1;
          else if (app.status === 'rejected') stats.rejected += 1;
        });
        state.applicationStats = stats;
      })
      .addCase(getUserApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get application details
      .addCase(getApplicationDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getApplicationDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentApplication = action.payload.application;
      })
      .addCase(getApplicationDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update application status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const updatedApp = action.payload.application;
        const index = state.applications.findIndex(app => app._id === updatedApp._id);
        if (index !== -1) {
          state.applications[index] = updatedApp;
        }
        if (state.currentApplication && state.currentApplication._id === updatedApp._id) {
          state.currentApplication = updatedApp;
        }
        
        // Recalculate stats
        const stats = { total: 0, pending: 0, accepted: 0, rejected: 0 };
        state.applications.forEach(app => {
          stats.total += 1;
          if (app.status === 'pending') stats.pending += 1;
          else if (app.status === 'accepted') stats.accepted += 1;
          else if (app.status === 'rejected') stats.rejected += 1;
        });
        state.applicationStats = stats;
      });
  }
});

export const { clearError, clearSuccessMessage, clearCurrentApplication } = applicationSlice.actions;

export default applicationSlice.reducer;