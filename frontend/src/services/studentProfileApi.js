import API from './api.js';

class StudentProfileAPI {
  // Get current student profile
  async getProfile() {
    try {
      console.log('Fetching student profile...');
      const response = await API.get('/candidat/profile/me');
      console.log('Profile API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching student profile:', error);
      throw error;
    }
  }

  // Update student profile
  async updateProfile(profileData) {
    try {
      console.log('Updating student profile with data:', profileData);
      const response = await API.put('/candidat/profile/me', profileData);
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating student profile:', error);
      throw error;
    }
  }

  // Get student statistics
  async getStatistics() {
    try {
      console.log('Fetching student statistics...');
      const response = await API.get('/candidat/profile/stats');
      console.log('Statistics API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching student statistics:', error);
      throw error;
    }
  }

  // Create or initialize student profile (for new users)
  async createProfile(profileData) {
    try {
      console.log('Creating student profile with data:', profileData);
      const response = await API.post('/candidat/', profileData);
      console.log('Profile creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating student profile:', error);
      throw error;
    }
  }
}

export default new StudentProfileAPI();