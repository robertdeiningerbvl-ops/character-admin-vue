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
          manualChunks: {
            // 将 Vue 相关库分离
            'vue-vendor': ['vue', 'vue-router', '@vue/shared'],
            // 将工具库分离
            'utils-vendor': ['lodash-es', 'dayjs'],
            // 将图表库分离
            'chart-vendor': ['@unovis/vue'],
            // 将编辑器分离
            'editor-vendor': ['@tiptap/vue-3', '@tiptap/starter-kit'],
            // 将 VueUse 分离
            'vueuse-vendor': ['@vueuse/core']
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
