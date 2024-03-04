import type MagicString from 'magic-string'
import fse from 'fs-extra'
import { join } from 'pathe'
import { defu } from 'defu'
import { version } from '../package.json'
import type { Platform, Un19nOptions, Un19n, Un19nContext, TranslationMap, Language, TranslatorOptions } from './types'
import { detectTranslations } from './detect'
import { DEFAULT_UN19N_OPTIONS } from './constants'

export const createUn19n = <T extends Platform>(options: Partial<Un19nOptions<T>>): Un19n<T> => {
  const _options = defu(options, DEFAULT_UN19N_OPTIONS) as Un19nOptions<T>
  const ctx = createInternalContext(_options)

  const init = () => fse.ensureFile(join(process.cwd(), _options.output))

  const detectTranslationsWithContext = (code: string | MagicString) => detectTranslations(code, ctx)

  const injectTranslationsWithContext = async (code: string | MagicString, id: string) => {
    await injectTranslations(code, id, ctx)
  }

  return {
    options: _options,

    init,
    detectTranslations: detectTranslationsWithContext,
    injectTranslations: injectTranslationsWithContext
  }
}

const createInternalContext = <T extends Platform>(options: Un19nOptions<T>) => {
  const _map: TranslationMap = new Map()

  const getTranslationMap = () => _map

  const ctx: Un19nContext<T> = {
    version,
    options,

    getTranslationMap
  }

  return ctx
}

export const getTranslatorWithContext = async <T extends Platform>(ctx: Un19nContext<T>) => {
  const translator = ctx.options.translator ?? ctx.options.platform === 'baidu' ? (await import('./translators/baidu')).default : undefined
  if (!translator) { return undefined }
  return (options: Omit<TranslatorOptions<string | string[], T>, 'ctx'>) => translator({ ...options, ctx } as any)
}

const injectTranslations = async <T extends Platform>(code: string | MagicString, id: string | undefined, ctx: Un19nContext<T>) => {
  let _json: Record<string, any> = {}
  const _map = ctx.getTranslationMap()
  const { matchedTranslations } = detectTranslations(code, ctx)
  const translator = await getTranslatorWithContext(ctx)

  if (!translator) { return }

  matchedTranslations.forEach(({ message, from, to: targets }) => {
    targets.forEach((to) => {
      const _key = [from, to] as [Language, Language]
      const _values = _map.get(_key) ?? {}
      const _result = from === to ? message.split('_').join(' ') : ''
      _values[message] = _result
      _map.set(_key, _values)
    })
  })

  const _keys = _map.keys()

  for (const _key of _keys) {
    const [from, to] = _key
    const message = Object.entries(_map.get(_key) ?? {}).filter(([_, r]) => Boolean(r)).map(([m]) => m.split('_').join(' '))
    const results = await translator({ message, from, to })

    results.forEach((m, i) => {
      _json[message[i]] = m
    })
  }

  const prefix = ctx.options.prefix

  if (prefix) {
    _json = { [prefix]: _json }
  }

  await fse.writeJson(join(process.cwd(), ctx.options.output), _json)
}
