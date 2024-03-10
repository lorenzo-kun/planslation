// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  typescript: {
    typeCheck: true,
  },

  modules: ['@nuxtjs/i18n', '@nuxtjs/tailwindcss'],

  i18n: {
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        name: 'English (US)',
        files: ['en.yaml'],
      },
      {
        code: 'en-gb',
        name: 'English (UK)',
        files: ['en.yaml', 'en-gb.yaml'],
      },
    ],
  },
});
