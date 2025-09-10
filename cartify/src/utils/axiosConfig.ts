import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  console.error('Please provide a axios base URL!');
}

export const instance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 50000,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});
