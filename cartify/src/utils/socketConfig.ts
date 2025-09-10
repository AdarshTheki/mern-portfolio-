import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  console.error('Please provide a socket base URL!');
}

export const socket = io(BASE_URL, {
  timeout: 10000,
  auth: { token: localStorage.getItem('accessToken') },
});
