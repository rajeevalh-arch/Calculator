
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env.SENDGRID_API_KEY': JSON.stringify(process.env.SENDGRID_API_KEY),
    'process.env.SENDER_EMAIL': JSON.stringify(process.env.SENDER_EMAIL)
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 3000
  }
});
