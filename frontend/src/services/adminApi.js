import API from './api.js';

class AdminAPI {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      console.log('Fetching admin dashboard statistics...');
      const response = await API.get('/admin/dashboard/stats');
      console.log('Dashboard stats API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Get all users with pagination and filtering
  async getUsers(params = {}) {
    try {
      console.log('Fetching users with params:', params);
      const response = await API.get('/admin/users', { params });
      console.log('Users API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Update user status (activate/suspend)
  async updateUserStatus(userId, isActive) {
    try {
      console.log(`Updating user ${userId} status to:`, isActive);
      const response = await API.put(`/admin/users/${userId}/status`, { isActive });
      console.log('User status update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      console.log(`Deleting user ${userId}...`);
      const response = await API.delete(`/admin/users/${userId}`);
      console.log('User deletion response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Get job management data
  async getJobManagementData() {
    try {
      console.log('Fetching job management data...');
      const response = await API.get('/admin/jobs/management');
      console.log('Job management API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching job management data:', error);
      throw error;
    }
  }

  // Get company management data
  async getCompanyManagementData() {
    try {
      console.log('Fetching company management data...');
      const response = await API.get('/admin/companies/management');
      console.log('Company management API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching company management data:', error);
      throw error;
    }
  }

  // Get system alerts
  async getSystemAlerts() {
    try {
      console.log('Fetching system alerts...');
      const response = await API.get('/admin/alerts');
      console.log('System alerts API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching system alerts:', error);
      throw error;
    }
  }
}

export default new AdminAPI();