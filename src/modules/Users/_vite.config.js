import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import env from '../../env.mjs';
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  define: env.getVariables(),
  plugins: [
    vue({
      template: {
        transformAssetUrls,
      }
    }),
    vuetify({
      autoImport: true,
    }),
  ],
  root: 'src',
  // build: {
  //   outDir: '../../../../dist/modules/Users/src',
  //   emptyOutDir: true, // Önceki build dosyalarını temizler
  //   lib: {
  //     entry: resolve(__dirname, 'src/index.js'),  // Giriş dosyasını belirtiriz
  //     name: "Users",  // Modülün ismini belirliyoruz
  //     fileName: 'index',  // Çıktı dosyasının adı sabit
  //   }
  // },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../../', import.meta.url)),
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
});
