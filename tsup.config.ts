import { defineConfig } from 'tsup'
import { MagicRegExpTransformPlugin } from 'magic-regexp/transform'

export default defineConfig(options => ({
  entry: ['./src/index.ts'],
  splitting: true,
  clean: true,
  treeshake: true,
  dts: !options.watch,
  format: ['cjs'],
  minify: !options.watch,
  esbuildPlugins: [MagicRegExpTransformPlugin.esbuild()]
}))
