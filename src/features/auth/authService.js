import api from '../../services/api';

export const authService = {
  login: async (email, password) => {
    try {
      // JSON Server GET with query matching
      const response = await api.get(`/users?email=${email}&password=${password}`);
      return response.data?.[0] ?? null;
    } catch (error) {
      console.error("Login API Error:", error);
      throw error;
    }
  },

  /** True if the email is already used by a different account. */
  isEmailTaken: async (email, excludeId) => {
    const { data } = await api.get(`/users?email=${email}`);
    return data.some((u) => u.id !== excludeId);
  },

  /** Re-fetches the account and checks the supplied password against it. */
  verifyPassword: async (id, password) => {
    const { data } = await api.get(`/users/${id}`);
    return data.password === password;
  },

  /** Updates the given fields on a user and returns the saved record. */
  updateProfile: async (id, data) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  }
};
