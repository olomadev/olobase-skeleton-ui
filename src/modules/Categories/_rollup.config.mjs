import module from './src/index.js';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import vue from 'rollup-plugin-vue';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import terser from '@rollup/plugin-terser';
const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  external: ['vuetify', 'assert', 'tty', 'os', 'zlib', 'util', 'path', 'fs', 'crypto', 'http', 'https', 'url', 'stream', 'events'],
  input: resolve(__dirname, 'src/index.js'),
  output: {
    dir: resolve(__dirname, `../../../dist/modules/${module.name}`),
    format: 'esm',
    sourcemap: true,
    entryFileNames: '[name].js',
    chunkFileNames: '[name]-[hash].js',
    inlineDynamicImports: false,
  },
  plugins: [
    json(),
    alias({
      entries: [
        { find: '@', replacement: resolve(__dirname, '../../') },
      ],
    }),
    vue(),
    postcss(),
    nodeResolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    terser() // to Minify
  ]
};
