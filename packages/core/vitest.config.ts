import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    environmentOptions: {
      happyDOM: {
        settings: { disableJavaScriptFileLoading: true },
      },
    },
    coverage: {
      provider: 'v8',
      include: ['src/**'],
    },
  },
});
