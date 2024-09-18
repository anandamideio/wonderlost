import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/wonderlost.ts',
  output: {
    file: 'dist/wonderlost.mjs',
    sourcemap: true,
    name: 'Wonderlost',
    format: 'esm',
    plugins: [terser()]
  },
  plugins: [
    resolve({
      browser: true,
    }),
    typescript({
      sourceMap: true,
      inlineSources: true,
      tsconfig: 'tsconfig.json',
      cacheDir: '.cache'
    }),
  ],
  external: [
    "/scripts/greensock/esm/all.js",
    "../../../../../scripts/greensock/esm/all.js"
  ],
}
