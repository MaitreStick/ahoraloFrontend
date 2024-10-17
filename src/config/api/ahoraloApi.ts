import { STAGE, API_URL as PROD_URL, API_URL_IOS, API_URL_ANDROID } from '@env';
import axios from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '../../presentation/store/auth/useAuthStore';
import { StorageAdapter } from '../adapters/storage-adapter';


export const API_URL =
  (STAGE === 'prod')
    ? PROD_URL
    : Platform.OS === 'ios'
      ? API_URL_IOS
      : API_URL_ANDROID;



const ahoraloApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

ahoraloApi.interceptors.request.use(
  async (config) => {
    const token = await StorageAdapter.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Interceptor: Token incluido en la solicitud:', token);
    } else {
      console.log('Interceptor: No se encontró token');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { ahoraloApi };