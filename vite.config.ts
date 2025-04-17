import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// ESM ortamında __dirname yerine kullanılacak yol
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  
  return {
    plugins: [
      react()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: !isProd,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@nextui-org/react', 'framer-motion'],
            supabase: ['@supabase/supabase-js'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd,
        },
      },
    },
  };
});
