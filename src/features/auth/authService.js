import api from '../../services/api';

export const authService = {
  login: async (email, password) => {
    try {
      // JSON Server GET with query matching
      const response = await api.get(`/accounts?email=${email}&password=${password}`);
      const accounts = response.data;
      if (accounts && accounts.length > 0) {
        return accounts[0];
      }
      return null;
    } catch (error) {
      console.error("Login API Error:", error);
      throw error;
    }
  }
};
