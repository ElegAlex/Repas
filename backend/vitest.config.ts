import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/index.ts',      // Point d'entrée serveur
        'src/app.ts',        // Factory Express (testé via intégration)
        'src/db/index.ts',   // Initialisation BDD (infrastructure)
        'src/test/**',
      ],
    },
    testTimeout: 10000,
  },
});
