// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import env from './src/env.mjs';

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  root: 'src',
  publicDir: 'src',
  build: {
    outDir: '../dist',
    cssCodeSplit: true,
    emptyOutDir: false,
    chunkSizeWarningLimit: 800,
    minify: false,
    rollupOptions: {
      input: [
        resolve(__dirname, 'src/index.html'),
        resolve(__dirname, 'src/favicon.ico'),
      ],
      // external: (id) => id.includes('src/modules/'),    
      // external: (id) => [
      //   'assert', 'tty', 'os', 'zlib', 'util', 'path', 'fs', 'crypto', 'http', 'https', 'url', 'stream', 'events'
      // ].includes(id) || id.startsWith('src/modules/'),
      output: {
        globals: {
          vue: 'Vue', // Vue.js global değişkenini tanımla
        },
        format: 'es',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        manualChunks(id) {
          if (id.includes('src/modules/')) {
            const moduleName = id.split('src/modules/')[1].split('/')[0]; // 'Users', 'Authentication' gibi
            return `modules/${moduleName}/src/index`; // Chunkları modül adına göre grupla
          }
          if (id.includes('node_modules')) {
            return 'vendor'; // Üçüncü parti kütüphaneler için vendor chunk'ı
          }
        },
      }
    }
  },
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
