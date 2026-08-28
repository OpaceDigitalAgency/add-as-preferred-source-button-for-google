import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/register.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2020',
  // Bundle the tiny core so dist/register.js works from a CDN <script type="module">
  // with no bare-specifier resolution. splitting: false keeps each entry self-contained.
  noExternal: [/^@opacedev\//],
  splitting: false,
});
