import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  entry: ['./index.ts'],
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  format: ['esm'],
  minify: !options.watch
}))
