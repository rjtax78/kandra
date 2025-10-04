import API from './api.js';

class CompanyApplicationsAPI {
  // Get all applications for company's jobs
  async getApplications(params = {}) {
    try {
      console.log('Fetching company applications with params:', params);
      const response = await API.get('/company/applications', { params });
      console.log('Applications API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  // Get company's job list for filtering
  async getCompanyJobs() {
    try {
      console.log('Fetching company jobs...');
      const response = await API.get('/company/applications/jobs');
      console.log('Company jobs API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching company jobs:', error);
      throw error;
    }
  }

  // Update single application status
  async updateApplicationStatus(applicationId, status, notes) {
    try {
      console.log(`Updating application ${applicationId} status to:`, status);
      const response = await API.put(`/company/applications/${applicationId}/status`, {
        status,
        notes
      });
      console.log('Application status update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  // Bulk update application statuses
  async bulkUpdateApplications(applicationIds, status, notes) {
    try {
      console.log('Bulk updating applications:', applicationIds, 'to status:', status);
      const response = await API.put('/company/applications/bulk-update', {
        applicationIds,
        status,
        notes
      });
      console.log('Bulk update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error bulk updating applications:', error);
      throw error;
    }
  }

  // Get detailed candidate information
  async getCandidateDetails(applicationId, candidateId) {
    try {
      console.log('Fetching candidate details:', candidateId, 'for application:', applicationId);
      const response = await API.get(`/company/applications/${applicationId}/candidate/${candidateId}`);
      console.log('Candidate details API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      throw error;
    }
  }
}

export default new CompanyApplicationsAPI();