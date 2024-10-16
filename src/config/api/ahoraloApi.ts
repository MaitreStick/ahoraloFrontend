import { STAGE, API_URL as PROD_URL, API_URL_IOS, API_URL_ANDROID } from '@env';
import axios from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '../../presentation/store/auth/useAuthStore';


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
  }
})

let currentToken: string | undefined;

// Suscribirse al estado del token
useAuthStore.subscribe((state) => {
  currentToken = state.token;
});

ahoraloApi.interceptors.request.use(
  (config) => {
    if (currentToken) {
      config.headers['Authorization'] = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export {
  ahoraloApi,
}