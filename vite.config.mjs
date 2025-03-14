// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import env from './src/env.mjs';

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'

// https://vitejs.dev/config/
// https://vitejs.dev/guide/env-and-mode.html#env-files
// 
export default defineConfig({
  define: env.getVariables(),
  transpileDependencies: ["vuetify"],
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  root: resolve(__dirname, 'src'), // Kök dizini src/ olarak ayarlıyoruz.
  // build: {
  //   outDir: 'dist',
  //   emptyOutDir: false, // Warning !! -- prevents the distributed computer from being deleted when creating modules
  //   chunkSizeWarningLimit: 800,
  //   minify: true,
  //   rollupOptions: {
  //     external: ['assert', 'tty', 'os', 'zlib', 'util', 'path', 'fs', 'crypto', 'http', 'https', 'url', 'stream', 'events'],
  //     output: {
  //       manualChunks: {
  //         vendor: ['vue-i18n', 'vuetify', 'vue', 'pinia', 'vue-router'],
  //       }
  //     }
  //   }
  // },  
  optimizeDeps: {
    exclude: ['vuetify', 'util', 'path', 'fs', 'crypto', 'http', 'https', 'url', 'stream']  // fixes optimized deps warnings...
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
    vue({
      template: {
        transformAssetUrls,
      }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'assets/styles/vuetify.scss',
      },
    }),
    // https://github.com/lokalise/lokalise-tutorials/blob/main/vue-3-i18n/vite.config.js
    VueI18nPlugin({
      runtimeOnly: false,
      include: resolve(__dirname, './src/i18n/locales/**'),
    }),
  ],
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
