import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getCookie } from '../utils/CookieUtils.ts';

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
