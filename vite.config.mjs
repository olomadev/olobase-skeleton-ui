// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

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
  build: {
    outDir: 'dist',
    emptyOutDir: false, // Warning !! -- prevents the distributed computer from being deleted when creating modules
    chunkSizeWarningLimit: 800,
    minify: false,
    rollupOptions: {
      external: ['assert', 'tty', 'os', 'zlib', 'util', 'path', 'fs', 'crypto', 'http', 'https', 'url', 'stream', 'events'],
      output: {
        manualChunks: {
          vendor: ['vue-i18n', 'vuetify', 'vue', 'pinia', 'vue-router'],
        }
      }
    }
  },  
  optimizeDeps: {
    include: ['stream'],
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
    nodePolyfills({
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
    vue({
      template: { 
        transformAssetUrls,
      }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/assets/styles/vuetify.scss',
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
      stream: 'stream-browserify',
      util: 'util',
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
