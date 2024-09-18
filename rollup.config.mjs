import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';

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
    alias({
      entries: [
        { find: "/scripts/greensock/esm/all.js", replacement: "../../scripts/greensock/esm/all.js" },
      ]
    }),
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
    "../../scripts/greensock/esm/all.js"
  ],
}
