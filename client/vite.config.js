import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

// The API port is read from server/.env, so it only has to be changed in one place
const serverDir = fileURLToPath(new URL('../server', import.meta.url));

export default defineConfig(({ mode }) => {
  const apiPort = loadEnv(mode, serverDir, '').PORT || 5000;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
      proxy: {
        // 127.0.0.1 instead of localhost avoids the IPv6 (::1) problem on Windows
        '/api': { target: `http://127.0.0.1:${apiPort}`, changeOrigin: true },
      },
    },
  };
});
