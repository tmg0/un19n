import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  entry: ['./src/index.ts'],
  splitting: true,
  clean: true,
  treeshake: true,
  dts: !options.watch,
  format: ['esm'],
  minify: !options.watch
}))
