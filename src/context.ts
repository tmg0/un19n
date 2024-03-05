import type MagicString from 'magic-string'
import fse from 'fs-extra'
import { join } from 'pathe'
import { defu } from 'defu'
import { version } from '../package.json'
import type { Platform, Un19nOptions, Un19n, Un19nContext, TranslationMap, Language, TranslatorOptions } from './types'
import { detectCode, detectTranslation } from './detect'
import { DEFAULT_UN19N_OPTIONS } from './constants'
import { sleep } from './utils'

export const createUn19n = <T extends Platform>(options: Partial<Un19nOptions<T>>): Un19n<T> => {
  const _options = defu(options, DEFAULT_UN19N_OPTIONS) as Un19nOptions<T>
  const ctx = createInternalContext(_options)

  const init = () => fse.ensureFile(join(process.cwd(), _options.output))

  const detectCodeWithContext = (code: string | MagicString) => detectCode(code, ctx)

  const injectTranslationsWithContext = async (code: string | MagicString, id: string) => {
    await injectTranslations(code, id, ctx)
  }

  return {
    options: _options,

    init,
    detectCode: detectCodeWithContext,
    injectTranslations: injectTranslationsWithContext
  }
}

const createInternalContext = <T extends Platform>(options: Un19nOptions<T>) => {
  const _map: TranslationMap = new Map()
  let _translations: Record<string, any> = {}
  const absoluteOutput = join(process.cwd(), options.output)

  const getTranslations = async () => {
    _translations = (await fse.readJSON(absoluteOutput, { throws: false })) ?? {}
    return _translations
  }

  const updateTranslations = async () => { await getTranslations() }

  const getTranslationMap = async () => {
    if (!_translations.length) {
      await updateTranslations()
      _map.clear()
    }

    Object.entries(_translations).forEach(([to, _messages]) => {
      Object.entries(_messages as Record<string, string>).forEach(([_mKey, _value]) => {
        const { from } = detectTranslation(_mKey, ctx)
        const _key = [from, to].join('|')
        const _values = _map.get(_key) ?? {}
        _map.set(_key, { ..._values, [_mKey]: _value })
      })
    })

    return _map
  }

  const ctx: Un19nContext<T> = {
    version,
    options,
    absoluteOutput,

    getTranslations,
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
  const _json = await ctx.getTranslations()
  const _map = await ctx.getTranslationMap()
  const { matchedTranslations } = detectCode(code, ctx)
  const translator = await getTranslatorWithContext(ctx)

  if (!translator) { return }
  if (!matchedTranslations.length) { return }

  matchedTranslations.forEach(({ message, src, from, to: targets }) => {
    targets.forEach((to) => {
      const _key = [from, to].join('|')
      const _values = _map.get(_key) ?? {}
      if (!_values[src]) {
        const _result = from === to ? message.split('_').join(' ') : ''
        _values[src] = _result
        _map.set(_key, _values)
      }
    })
  })

  for (const [_key, _values] of _map.entries()) {
    const [from, to] = _key.split('|') as [Language, Language]
    if (from === to) {
      _json[to] = { ..._json[to], ..._values }
      continue
    }

    const sources = Object.entries(_values ?? {}).filter(([_, r]) => !r).map(([m]) => {
      const { message, src } = detectTranslation(m, ctx)
      return { message: message.split('_').join(' '), src }
    })

    const targets = await translator({ message: sources.map(({ message }) => message), from, to })

    await sleep(1000 / ctx.options.qps)

    targets.forEach((m, i) => {
      if (!_json[to]) { _json[to] = {} }
      _json[to][sources[i].src] = m
    })
  }

  await fse.outputJSON(ctx.absoluteOutput, _json)
}
