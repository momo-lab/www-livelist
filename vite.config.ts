import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: env.VITE_BASE_URL || '/',
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-dom/client'],
            router: ['react-router-dom'],
            ui: [
              // Radix UI
              '@radix-ui/react-checkbox',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-select',
              '@radix-ui/react-slot',

              // icons
              'lucide-react',
              'react-icons',
            ],
            utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
            analytics: ['react-ga4'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.ts',
      testTransformMode: { web: ['**/*.{ts,tsx}'] },
    },
  };
});
