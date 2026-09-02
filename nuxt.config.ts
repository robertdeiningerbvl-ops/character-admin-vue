// https://nuxt.com/docs/api/configuration/nuxt-config
const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@pinia/nuxt'
  ],

  ssr: false,

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      isDev,
      apiBaseUrl: isDev ? process.env.API_BASE_URL : ''
    }
  },

  devServer: {
    host: '0.0.0.0', // 局域网调试
    port: 3001
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    output: {
      dir: '.output',
      publicDir: 'dist'
    },
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    },
    devProxy: {
      '/admin': {
        target: process.env.API_BASE_URL,
        changeOrigin: true
      }
    }
  },

    vite: {
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 将 Vue 相关库分离
            if (
              id.includes('node_modules/vue/') ||
              id.includes('node_modules/vue-router/') ||
              id.includes('node_modules/@vue/shared/')
            ) {
              return 'vue-vendor'
            }
            // 将工具库分离
            if (
              id.includes('node_modules/lodash-es/') ||
              id.includes('node_modules/dayjs/')
            ) {
              return 'utils-vendor'
            }
            // 将图表库分离
            if (
              id.includes('node_modules/@unovis/vue/') ||
              id.includes('node_modules/echarts/') ||
              id.includes('node_modules/vue-echarts/')
            ) {
              return 'chart-vendor'
            }
            // 将编辑器分离
            if (
              id.includes('node_modules/@tiptap/vue-3/') ||
              id.includes('node_modules/@tiptap/starter-kit/')
            ) {
              return 'editor-vendor'
            }
            // 将 VueUse 分离
            if (id.includes('node_modules/@vueuse/core/')) {
              return 'vueuse-vendor'
            }
          }
        }
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  image: {
    provider: 'none'
  }
})
