import type MagicString from 'magic-string'
import fse from 'fs-extra'
import { join } from 'pathe'
import { defu } from 'defu'
import { version } from '../package.json'
import type { Platform, Un19nOptions, Un19n, Un19nContext, TranslationMap } from './types'
import { detectTranslations } from './detect'
import { DEFAULT_UN19N_OPTIONS } from './constants'

export const createUn19n = <T extends Platform>(options: Partial<Un19nOptions<T>>): Un19n<T> => {
  const _options = defu(options, DEFAULT_UN19N_OPTIONS) as Un19nOptions<T>
  const ctx = createInternalContext(_options)

  const init = () => fse.ensureFile(join(process.cwd(), _options.output))

  const detectTranslationsWithContex = (code: string | MagicString) => detectTranslations(code, ctx)

  const injectTranslationsWithContext = async (code: string | MagicString, id: string) => {
    await injectTranslations(code, id, ctx)
  }

  return {
    options: _options,

    init,
    detectTranslations: detectTranslationsWithContex,
    injectTranslations: injectTranslationsWithContext
  }
}

const createInternalContext = <T extends Platform>(options: Un19nOptions<T>) => {
  const ctx: Un19nContext<T> = {
    version,
    options
  }

  return ctx
}

const injectTranslations = <T extends Platform>(code: string | MagicString, id: string | undefined, ctx: Un19nContext<T>) => {
  const _map: TranslationMap = {}
  const { matchedTranslations } = detectTranslations(code, ctx)

  matchedTranslations.forEach(({ message, from, to: targets }) => {
    if (!_map[from]) { _map[from] = {} }
    _map[from]![message] = message.split('_').join(' ')
    targets.forEach((to) => {
      if (!_map[to]) { _map[to] = {} }
      _map[to]![message] = ''
    })
  })
}
