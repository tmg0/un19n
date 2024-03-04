import { createUnplugin } from 'unplugin'
import type { FilterPattern } from '@rollup/pluginutils'
import { createFilter } from '@rollup/pluginutils'
import MagicString from 'magic-string'
import type { Un19nOptions } from './types'
import { createUn19n } from './context'

export interface Un19nPluginOptions<T extends Platform> extends Un19nOptions<T> {
  include: FilterPattern
  exclude: FilterPattern
}

export const defaultIncludes = [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.svelte$/]
export const defaultExcludes = [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]

const toArray = <T>(x: T | T[] | undefined | null): T[] => x == null ? [] : Array.isArray(x) ? x : [x]

export default createUnplugin<Partial<Un19nPluginOptions<Platform>>>((options = {}) => {
  const ctx = createUn19n(options)

  const filter = createFilter(
    toArray(options.include as string[] || []).length
      ? options.include
      : defaultIncludes,
    options.exclude || defaultExcludes
  )

  return {
    name: 'un19n',
    enforce: 'post',
    transformInclude (id) {
      return filter(id)
    },
    async transform (code, id) {
      const s = new MagicString(code)

      await ctx.injectTranslations(code, id)

      if (!s.hasChanged()) { return }

      return {
        code: s.toString(),
        map: s.generateMap()
      }
    },
    async buildStart () {
      await ctx.init()
    }
  }
})
