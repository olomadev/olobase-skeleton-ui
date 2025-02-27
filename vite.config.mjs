// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
// import eslintPlugin from 'vite-plugin-eslint'

// Utilities
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'

// https://vitejs.dev/config/
// https://vitejs.dev/guide/env-and-mode.html#env-files
// 
export default defineConfig({
  transpileDependencies: ["vuetify"],
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  optimizeDeps: {
    exclude: ["vuetify"]  // fixes optimized deps warnings...
  },
  // fixes sass 2.0 deprecation bug
  // https://stackoverflow.com/questions/78997907/the-legacy-js-api-is-deprecated-and-will-be-removed-in-dart-sass-2-0-0
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern',
        silenceDeprecations: ["legacy-js-api"],
      }
    }
  },
  plugins: [
    // eslintPlugin(),
    vue({ 
      template: { 
        transformAssetUrls,
      }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    // https://github.com/lokalise/lokalise-tutorials/blob/main/vue-3-i18n/vite.config.js
    VueI18nPlugin({
      runtimeOnly: false,
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
    }),
  ],
  define: { 
    'process.env': {},
    // enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  }
})
