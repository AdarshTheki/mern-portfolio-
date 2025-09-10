/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { axios } from '../utils';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  callApi: (url: string, payload?: any, method?: HttpMethod) => Promise<T | null>;
  setData: (data: T | null) => void;
}

function useApi<T = any>(): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const callApi = useCallback(
    async (url: string, payload: any = {}, method: HttpMethod = 'post'): Promise<T | null> => {
      setLoading(true);
      setData(null);
      setError(null);

      try {
        const response = await axios({
          method,
          url,
          ...(method.toLowerCase() === 'get' ? { params: payload } : { data: payload }),
        });

        const result = response.data?.data ?? response.data;
        setData(result);
        return result;
      } catch (err: any) {
        const apiError = err?.response?.data?.message || err.message || 'Something went wrong';
        console.error('API Error:', apiError);
        setError(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, data, error, callApi, setData };
}

export default useApi;
