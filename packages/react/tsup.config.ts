import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2020',
  external: [/^@opace\//, 'react', 'react/jsx-runtime'],
  esbuildOptions(options) {
    // Keep the 'use client' directive at the top of the emitted bundles.
    options.banner = { js: "'use client';" };
  },
});
