import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import authService from '../../services/auth-service';

export default function Login() {
   const navigate = useNavigate();

   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
         setIsLoading(true);
         setError('');

         await authService.login(username, password);

         navigate('/');
      } catch (error) {
         setError(getLoginErrorMessage(error));
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <main className="mx-auto max-w-md px-4 py-12">
         <h1 className="mb-6 text-2xl font-bold">Log in</h1>

         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label htmlFor="username" className="mb-1 block">
                  Username
               </label>

               <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  className="w-full rounded border px-3 py-2"
               />
            </div>

            <div>
               <label htmlFor="password" className="mb-1 block">
                  Password
               </label>

               <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full rounded border px-3 py-2"
               />
            </div>

            {error && (
               <p role="alert" className="text-sm text-red-600">
                  {error}
               </p>
            )}

            <button
               type="submit"
               disabled={isLoading}
               className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
               {isLoading ? 'Logging in...' : 'Log in'}
            </button>
         </form>
      </main>
   );
}

function getLoginErrorMessage(error: unknown): string {
   if (axios.isAxiosError(error)) {
      const data = error.response?.data as
         | Record<string, unknown>
         | string
         | undefined;

      if (typeof data === 'string' && data.trim()) return data;

      if (data && typeof data === 'object') {
         const details = Object.entries(data)
            .map(([field, messages]) => {
               const message = Array.isArray(messages)
                  ? messages.join(' ')
                  : String(messages);
               return `${field}: ${message}`;
            })
            .join(' ');

         if (details) return details;
      }

      if (error.response?.status === 404) {
         return 'Account creation endpoint was not found. Check the server URL configuration.';
      }
      if (error.response?.status && error.response.status >= 500) {
         return 'The server could not complete sign in. Check the server logs.';
      }
   }

   return error instanceof Error && error.message
      ? error.message
      : 'Login or account creation failed. Check the username and password, then try again.';
}
