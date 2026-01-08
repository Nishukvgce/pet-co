import apiClient from './api';

class DeliveryApi {
  /**
   * Check delivery availability for a pincode
   * @param {string} pincode - The pincode to check
   * @returns {Promise<Object>} Delivery information
   */
  async checkDelivery(pincode) {
    try {
      const response = await apiClient.get(`/delivery/check/${pincode}`);
      return response.data;
    } catch (error) {
      console.error('Error checking delivery:', error);
      throw error;
    }
  }

  /**
   * Update user's pincode
   * @param {string} email - User's email
   * @param {string} pincode - The pincode to set
   * @returns {Promise<Object>} Response with delivery info
   */
  async updateUserPincode(email, pincode) {
    try {
      const response = await apiClient.post('/delivery/update-pincode', { pincode }, {
        params: { email }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating pincode:', error);
      throw error;
    }
  }

  /**
   * Get user's current pincode and delivery info
   * @param {string} email - User's email
   * @returns {Promise<Object>} User's pincode and delivery info
   */
  async getUserPincode(email) {
    try {
      const response = await apiClient.get('/delivery/user-pincode', {
        params: { email }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting user pincode:', error);
      throw error;
    }
  }
}

export default new DeliveryApi();