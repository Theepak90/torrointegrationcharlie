import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
    ],
    resolve: {
      alias: {
        // Set path aliases to match existing project structure
        src: resolve(__dirname, 'src'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@basics': resolve(__dirname, 'src/components/Basics'),
        '@lib': resolve(__dirname, 'src/lib'),
        '@comp': resolve(__dirname, 'src/components'),
        '@views': resolve(__dirname, 'src/views'),
        '@layouts': resolve(__dirname, 'src/layouts'),
      },
    },
    // CSS configuration removed - using CSS-in-JS with @emotion/styled
    server: {
      port: 8080, // Changed from 3000 to 3001
      proxy: {
        '/api': {
          target: 'http://52.175.16.230:8080/',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'build',
      sourcemap: true,
    },
  };
});
