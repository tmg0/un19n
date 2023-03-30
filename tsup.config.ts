import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  entry: ['./src/index.ts'],
  splitting: true,
  clean: true,
  treeshake: true,
  dts: true,
  format: ['esm'],
  minify: !options.watch
}))
