import axios from 'axios';

const API_BASE_URL =
   import.meta.env.VITE_API_BASE_URL || '/api';

export interface TokenResponse {
   access: string;
   refresh: string;
}

const authService = {
   async login(username: string, password: string) {
      const tokenUrl = `${API_BASE_URL}/token/`;
      const requestOptions = {
         headers: { 'Content-Type': 'application/json' },
      };

      let response;
      try {
         response = await axios.post<TokenResponse>(
            tokenUrl,
            { username, password },
            requestOptions
         );
      } catch (error) {
         // First time shoppers can create an account from the login form.
         // A duplicate username still fails registration, so an existing
         // account's incorrect password is never accepted.
         if (!axios.isAxiosError(error) || error.response?.status !== 401) {
            throw error;
         }

         await axios.post(
            `${API_BASE_URL.replace(/\/api\/?$/, '')}/auth/users/`,
            {
               username,
               password,
               email: `${username.replace(/[^a-zA-Z0-9.-]/g, '-')}` +
                  '@users.shop-arena.invalid',
            },
            requestOptions
         );

         response = await axios.post<TokenResponse>(
            tokenUrl,
            { username, password },
            requestOptions
         );
      }

      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);

      return response.data;
   },

   async refreshAccessToken(): Promise<string> {
      const refreshToken = localStorage.getItem('refresh');

      if (!refreshToken) {
         throw new Error('No refresh token found. Please log in.');
      }

      const response = await axios.post<{
         access: string;
         refresh?: string;
      }>(
         `${API_BASE_URL}/token/refresh/`,
         {
            refresh: refreshToken,
         },
         {
            headers: {
               'Content-Type': 'application/json',
            },
         }
      );

      localStorage.setItem('access', response.data.access);

      // Save a rotated refresh token if Django returns one.
      if (response.data.refresh) {
         localStorage.setItem('refresh', response.data.refresh);
      }

      return response.data.access;
   },

   logout() {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
   },
};

export default authService;
