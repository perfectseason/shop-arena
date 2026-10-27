import axios, { CanceledError, type InternalAxiosRequestConfig, } from 'axios';
import authService from './auth-service';


// const API_BASE_URL =
//    // import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
   baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
   headers: {
      'Content-Type': 'application/json',
   },
});


// Attach the access token to outgoing API requests.
apiClient.interceptors.request.use((config) => {
   const accessToken = localStorage.getItem('access');

   if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
   }

   return config;
});

type RetryConfig = InternalAxiosRequestConfig & {
   _retry?: boolean;
};

// Refresh an expired access token and retry the failed request.
apiClient.interceptors.response.use(
   (response) => response,

   async (error: unknown) => {
      if (!axios.isAxiosError(error) || !error.config) {
         return Promise.reject(error);
      }

      const originalRequest = error.config as RetryConfig;
      const requestUrl = originalRequest.url || '';

      const isTokenRequest =
         requestUrl.includes('/token/') ||
         requestUrl.includes('/token/refresh/');

      if (
         error.response?.status !== 401 ||
         originalRequest._retry ||
         isTokenRequest
      ) {
         return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
         const newAccessToken =
            await authService.refreshAccessToken();

         originalRequest.headers.Authorization =
            `Bearer ${newAccessToken}`;

         return apiClient(originalRequest);
      } catch (refreshError) {
         authService.logout();

         return Promise.reject(refreshError);
      }
   }
);



export default apiClient;

export { CanceledError };
