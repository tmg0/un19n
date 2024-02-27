import { version } from '../package.json'
import type { Platform, Un19nOptions, Un19n, Un19nContext, Translation } from './types'

export const createUn19n = <T extends Platform>(options: Partial<Un19nOptions<T>>): Un19n<T> => {
  const ctx = createInternalContext(options)

  return {
    detectTranslations: ctx.detectTranslations
  }
}

const createInternalContext = <T extends Platform>(options: Partial<Un19nOptions<T>>) => {
  const _map: Record<string, Translation> = {}

  const ctx: Un19nContext<T> = {
    version,
    options,

    detectTranslations: () => {
      return Promise.resolve(_map)
    }
  }

  return ctx
}
