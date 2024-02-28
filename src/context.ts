import type MagicString from 'magic-string'
import { version } from '../package.json'
import type { Platform, Un19nOptions, Un19n, Un19nContext, Translation } from './types'
import { getMagicString } from './utils'
import { detectTranslations } from './detect'

export const createUn19n = <T extends Platform>(options: Partial<Un19nOptions<T>>): Un19n => {
  const ctx = createInternalContext(options)

  const injectTranslationsWithContext = async () => {

  }

  return {
    detectTranslations
  }
}

const createInternalContext = <T extends Platform>(options: Partial<Un19nOptions<T>>) => {
  const _map: Record<string, Translation> = {}

  const ctx: Un19nContext<T> = {
    version,
    options
  }

  return ctx
}

const injectTranslations = (code: MagicString | string, id: string | undefined, ctx: Un19nContext) => {
  const s = getMagicString(code)

  const { matchedTranslations } = detectTranslations(s, ctx)
}
