import { createUnplugin } from 'unplugin'
import type { FilterPattern } from '@rollup/pluginutils'
import { createFilter } from '@rollup/pluginutils'
import MagicString from 'magic-string'
import type { Un19nOptions } from './types'

export interface Un19nPluginOptions extends Un19nOptions {
  include: FilterPattern
  exclude: FilterPattern
}

export const defaultIncludes = [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.svelte$/]
export const defaultExcludes = [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]

const toArray = <T>(x: T | T[] | undefined | null): T[] => x == null ? [] : Array.isArray(x) ? x : [x]

export default createUnplugin<Partial<Un19nPluginOptions>>((options = {}) => {
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
    transform (code, id) {
      const s = new MagicString(code)

      return {
        code: s.toString(),
        map: s.generateMap()
      }
    }
  }
})
