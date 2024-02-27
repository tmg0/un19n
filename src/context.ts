import type { Platform, Un19nOptions, Un19n } from './types'

export const createUn19n = <T extends Platform>(options: Partial<Un19nOptions<T>>): Un19n => {
  return {}
}
