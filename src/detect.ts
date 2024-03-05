import type MagicString from 'magic-string'
import { getMagicString } from './utils'
import { matchRE } from './regexp'
import type { Translation, Language, Un19nContext, DetectTranslationResult, Platform } from './types'

export const detectCode = <T extends Platform>(code: string | MagicString, ctx: Un19nContext<T>): DetectTranslationResult => {
  const matchedTranslations: Translation[] = []
  const s = getMagicString(code)
  const original = s.original

  const matches = original.matchAll(matchRE(ctx))! ?? []

  for (const match of matches) {
    const [_, language, message] = match
    const to = ctx.options.to ?? []
    const isEmpty = !language || ['', '_'].includes(language)
    const from = (isEmpty ? ctx.options.from ?? 'auto' : language) as Language
    const content = !language ? message : `${language}:${message}`
    const src = `${ctx.options.prefix}.${content}`
    matchedTranslations.push({ message: message as string, src, from, to: [...new Set([...to, from])] })
  }

  return {
    s,
    matchedTranslations
  }
}

export const detectTranslation = <T extends Platform>(code: string, ctx: Un19nContext<T>) => {
  let message = ''
  let from = ctx.options.from
  const content = code.split('.')[1].split(':')

  if (content.length > 1) {
    from = content[0] as Language
    message = content[1]
  }

  if (content.length === 1) {
    message = content[0]
  }

  return {
    from,
    message,
    src: code
  }
}
