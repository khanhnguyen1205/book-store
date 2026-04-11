import axios from 'axios';

const api = axios.create({
  // Fallback to 3001 if needed, but the terminal shows 9999
  baseURL: 'http://localhost:9999',
});

export default api;
