import type MagicString from 'magic-string'
import { getMagicString } from './utils'
import { matchRE, stripCommentsAndStrings } from './regexp'
import type { Translation, Language, Un19nContext, DetectTranslationResult, Platform } from './types'

export const detectTranslations = <T extends Platform>(code: string | MagicString, ctx: Un19nContext<T>): DetectTranslationResult => {
  const matchedTranslations: Translation[] = []
  const s = getMagicString(code)
  const original = s.original

  const strippedCode = stripCommentsAndStrings(original)

  const matches = strippedCode.matchAll(matchRE)! ?? []

  for (const match of matches) {
    const [_, language, message] = match
    const to = ctx.options.to ?? []
    const isEmpty = !language || ['', '_'].includes(language)
    const from = (isEmpty ? ctx.options.from ?? 'auto' : language) as Language
    matchedTranslations.push({ message: message as string, from, to: [...new Set([...to, from])] })
  }

  return {
    s,
    matchedTranslations
  }
}
