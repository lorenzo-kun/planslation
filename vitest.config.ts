import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    clearMocks: true,
    environment: 'happy-dom',
    globals: true,
  },
});
