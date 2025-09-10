// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AxiosResponseType<T = any> {
  message: string;
  data?: T;
  statusCode: number;
  status: boolean;
  success: boolean;
}
