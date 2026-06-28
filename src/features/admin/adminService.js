import api from '../../services/api';

/**
 * Service cho khu vực admin — CRUD sách & người dùng qua JSON Server.
 * Dùng chung axios instance (`api`) trỏ tới http://localhost:9999.
 */
export const adminService = {
  // ----- Books -----
  getBooks: async () => {
    const { data } = await api.get('/books');
    return data;
  },

  createBook: async (book) => {
    const { data } = await api.post('/books', book);
    return data;
  },

  updateBook: async (id, book) => {
    const { data } = await api.put(`/books/${id}`, book);
    return data;
  },

  deleteBook: async (id) => {
    await api.delete(`/books/${id}`);
    return id;
  },

  // ----- Users -----
  getUsers: async () => {
    const { data } = await api.get('/users');
    return data;
  },

  updateUserRole: async (id, role) => {
    const { data } = await api.patch(`/users/${id}`, { role });
    return data;
  },

  deleteUser: async (id) => {
    await api.delete(`/users/${id}`);
    return id;
  },
};
