import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
// import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias'; // Alias çözümlemek için
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss'; // CSS işlemek için
import vue from 'rollup-plugin-vue'; // Vue plugin'i doğru import edilmiş
import nodePolyfills  from 'rollup-plugin-polyfill-node';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import replace from '@rollup/plugin-replace';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  external: ['vuetify', 'assert', 'tty', 'os', 'zlib', 'util', 'path', 'fs', 'crypto', 'http', 'https', 'url', 'stream', 'events'],
  input: resolve(__dirname, 'src/index.js'),
  output: {
    dir: resolve(__dirname, '../../../dist/modules/Users'), // Tek bir ortak dist klasörü
    format: 'esm',
    sourcemap: true,
    entryFileNames: '[name].js',
    chunkFileNames: '[name]-[hash].js',
    inlineDynamicImports: false  // If "false" rollup creates chunks for each dynamic module.
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
    replace({
      'process.env': JSON.stringify({}),
      preventAssignment: true,
    }),
    json(),
    alias({
      entries: [
        { find: '@', replacement: resolve(__dirname, '../../') } 
      ]
    }),
    vue(), // Vue plugin'i eklenmiş
    postcss(), // CSS işleme plugin'i
    nodeResolve(), // NPM modüllerini çözümlemek için
    commonjs(), // CommonJS modüllerini çözümlemek için
    babel({ babelHelpers: 'bundled' }), // Babel ile dönüştürme
    // terser() // to enable minify
  ]
};
