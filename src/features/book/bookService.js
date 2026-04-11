import api from '../../services/api';

const getBooks = async (params) => {
  const response = await api.get('/books', { params });
  return {
    data: response.data,
    totalCount: parseInt(response.headers['x-total-count'] || '0', 10),
  };
};

const getBookById = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const bookService = {
  getBooks,
  getBookById,
};
