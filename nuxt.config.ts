// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN,
    public: {},
  },

  compatibilityDate: "2025-04-25",
})