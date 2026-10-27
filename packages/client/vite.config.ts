import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
   plugins: [react(), tailwindcss()],
   server: {
      proxy: {
         '/api': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
         },
         '/auth': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
         },
         // Forward Django's admin pages and their static assets through Vite.
         '/admin': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
         },
         '/static': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
         },
      },
   },
});
