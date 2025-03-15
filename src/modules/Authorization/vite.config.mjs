import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
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
    VueI18nPlugin({
      runtimeOnly: false,
      include: resolve(__dirname, '../../i18n/locales/**'),
    }),    
  ],
  root: 'src',
  build: {
    outDir: '../../../../dist/modules/Authorization',
    emptyOutDir: true, // Önceki build dosyalarını temizler
    lib: {
      entry: resolve(__dirname, 'src/index.js'),  // Giriş dosyasını belirtiriz
      name: "Authorization",  // Modülün ismini belirliyoruz
      fileName: 'index',  // Çıktı dosyasının adı sabit
    }
    // rollupOptions: {
    //   external: ['vue'],  // Vue dışarıda bırakılır, çünkü projede mevcut
    //   output: {
    //     globals: {
    //       vue: 'Vue',  // Vue'yu global olarak tanımlıyoruz
    //     },
    //   },
    // },
  },
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
