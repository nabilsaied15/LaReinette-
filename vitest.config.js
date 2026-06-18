import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    environmentMatchGlobs: [
      ['test/pages/**/*.{test,spec}.{js,jsx}', 'jsdom'],
      ['test/components/**/*.{test,spec}.{js,jsx}', 'jsdom'],
    ],
    pool: 'threads',
    globals: true,
    setupFiles: ['./test/setup.js'],
    include: ['test/**/*.{test,spec}.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'test/**',
        '**/*.{test,spec}.{js,jsx}',
        'src/main.jsx',
        'src/config/**',
      ],
    },
  },
});
