import { readdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import vue from 'rollup-plugin-vue';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import copy from 'rollup-plugin-copy';
import env from './src/env.mjs';
import polyfillNode from 'rollup-plugin-polyfill-node';
import replace from '@rollup/plugin-replace';
const __dirname = dirname(fileURLToPath(import.meta.url));
import commonjs from '@rollup/plugin-commonjs';
const modulesDir = resolve(__dirname, 'src/modules');
const outputDir = resolve(__dirname, 'dist/modules');

const external = [
  'axios', 'assert',
  'tty', 'os', 'zlib', 'util', 'path', 'fs', 'crypto', 'http',
  'https', 'url', 'stream', 'events'
];
// Sadece src/index.js dosyası olan modülleri tara
const modules = readdirSync(modulesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .filter(module => existsSync(resolve(modulesDir, module, 'src/index.js')));

if (modules.length === 0) {
  console.warn('No modules found with src/index.js.');
}

// console.error(env.getVariables());


// Rollup config array oluştur
const config = [
  // Main.js için ayrı bir build
  {
    treeshake: true,
    external,
    input: resolve(__dirname, 'src/main.js'),
    output: {
      dir: resolve(__dirname, 'dist'),
      format: 'esm',
      sourcemap: false,
      entryFileNames: 'main.js',
      chunkFileNames: 'chunks/[name]-[hash].js',
      inlineDynamicImports: false,
      globals: {
        'axios': 'axios',
      },
    },
    plugins: [
      replace({
        ...env.getVariables(),
        preventAssignment: true,
      }),
      polyfillNode(),
      url({
        limit: 0, // Dosyaları inline etme, doğrudan URL olarak işle
        include: ['**/*.svg'],
        fileName: '[name]-[hash][extname]' // Dist klasörüne kopyalar
      }),
      alias({
        entries: [
          // { find: 'vue', replacement: 'node_modules/vue/dist/vue.runtime.esm-browser.js' },
          { find: '@', replacement: resolve(__dirname, './src') },
        ],
      }),
      vue(),
      commonjs(), // commonjs order is important it must be under the vue() plugin !!
      json(),
      postcss({
        extract: true,  // CSS dosyasını ayrı bir dosya olarak çıkartır
      }),
      nodeResolve({
        dedupe: ['vue', 'vue-router', 'vuetify'],
        browser: true,
        preferBuiltins: false,
        moduleDirectories: ['node_modules'],
        extensions: ['.js', '.vue'],
        exportConditions: ['browser'],
        mainFields: ['browser', 'module', 'main'],
      }),
      babel({ 
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      terser(), // Minification
      copy({
        targets: [
          { src: 'src/index.html', dest: 'dist' },   // 'index.html' dosyasını 'dist' altına kopyalar
          { src: 'src/favicon.ico', dest: 'dist' },   // 'favicon.ico' dosyasını 'dist' altına kopyalar
          { src: 'src/assets/**/*', dest: 'dist/assets' }  // 'assets' klasörünü 'dist/assets' altına kopyalar
        ],
        hook: 'writeBundle' // Build sonrası kopyalama işlemi yapılır.
      })
    ],
  }
];

// Modüller için ayrı configler
config.push(
  ...modules.map(module => ({
    treeshake: true,
    external,
    input: resolve(modulesDir, module, 'src/index.js'),
    output: {
      dir: resolve(outputDir, module),
      format: 'esm',
      sourcemap: false,
      entryFileNames: '[name].js',
      chunkFileNames: '[name]-[hash].js',
      inlineDynamicImports: false,
    },
    plugins: [
      replace({
        ...env.getVariables(),
        preventAssignment: true,
      }),
      polyfillNode(),
      alias({
        entries: [
          { find: '@', replacement: resolve(__dirname, './src') },
        ],
      }),
      vue(),
      commonjs(), // commonjs order is important it must be under the vue() plugin !!
      json(),
      postcss({
        extract: true,  // CSS dosyasını ayrı bir dosya olarak çıkartır
      }),
      nodeResolve({
        dedupe: ['vue', 'vue-router', 'vuetify'],
        browser: true,
        preferBuiltins: false,  // Built-in modülleri dışa aktarırken sorun çıkarabilir, false yaparak bu durumu engelleyin
      }),
      babel({ 
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      terser(), // Minification
    ],
  }))
);

export default config;
