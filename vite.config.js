import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Permitir conexiones desde cualquier host
    allowedHosts: ['docentek.ddns.net'], // Agregar el host permitido
  },
});
