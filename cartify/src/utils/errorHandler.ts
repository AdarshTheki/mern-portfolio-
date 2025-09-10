import type { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const errorHandler = (error: AxiosError) => {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response) {
      toast.error(`${axiosError.response.data.message || axiosError.response.statusText}`);
    } else if (axiosError.request) {
      toast.error('No response received from server');
    } else {
      toast.error(`Error: ${axiosError.message}`);
    }
  } else {
    toast.error('An unexpected error occurred.');
  }
};
