// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { readdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url));

// 📦 Modules klasörünü tara
const modulesDir = resolve(__dirname, 'src/modules');
const modules = readdirSync(modulesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .filter(dirent => existsSync(resolve(modulesDir, dirent.name, 'src/index.js')))
  .map(dirent => dirent.name);

// 📤 Dinamik giriş noktaları oluştur
const input = {
  main: resolve(__dirname, 'src/main.js'),
  router: resolve(__dirname, 'src/router/index.js'),
  store: resolve(__dirname, 'src/store/index.js'),
}

// Modülleri ekleyelim:
modules.forEach(module => {
  input[`modules/${module}`] = resolve(modulesDir, module, 'src/index.js');
});

// ⚙️ Vite Config
export default defineConfig({
  transpileDependencies: ["vuetify"],
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false, // Mevcut dosyaları silme
    chunkSizeWarningLimit: 800,
    minify: true,
    sourcemap: true,
    rollupOptions: {
      input,
      output: {
        entryFileNames: ({ name }) => {
          // 📂 Modülleri ayrı klasörlere koy
          if (name.startsWith('modules/')) {
            const moduleName = name.split('/')[1];
            return `modules/${moduleName}/index.js`;
          }
          return `${name}.js`;
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  plugins: [
    vue({
      template: { 
        transformAssetUrls,
      }
    }),
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/assets/styles/vuetify.scss',
      },
    }),
    VueI18nPlugin({
      runtimeOnly: false,
      include: resolve(__dirname, './src/i18n/locales/**'),
    }),
  ],
  define: {
    'process.env': {},
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
