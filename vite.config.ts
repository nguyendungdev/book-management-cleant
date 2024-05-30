import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      components: `${path.resolve(__dirname, './src/components/')}`,
      public: `${path.resolve(__dirname, './public/')}`,
      pages: `${path.resolve(__dirname, './src/pages')}`,
      typings: `${path.resolve(__dirname, './src/typings')}`,
      hooks: `${path.resolve(__dirname, './src/hooks')}`,
      store: `${path.resolve(__dirname, './src/store')}`,
      utils: `${path.resolve(__dirname, './src/utils')}`,
      layouts: `${path.resolve(__dirname, './src/layouts')}`,
      repositories: `${path.resolve(__dirname, './src/repositories')}`,
    },
  },
});
