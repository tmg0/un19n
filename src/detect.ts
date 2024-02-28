import type MagicString from 'magic-string'
import { getMagicString } from './utils'
import { matchRE, stripCommentsAndStrings } from './regexp'
import type { Translation, Language, Un19nContext, DetectTranslationResult } from './types'

export const detectTranslations = (code: string | MagicString, ctx: Un19nContext): DetectTranslationResult => {
  const matchedTranslations: Translation[] = []
  const s = getMagicString(code)
  const original = s.original

  const strippedCode = stripCommentsAndStrings(original)

  const matches = strippedCode.matchAll(matchRE)! ?? []

  for (const match of matches) {
    const [_, language, message] = match
    matchedTranslations.push({ message: message as string, from: language as Language, to: ctx.options.to ?? [] })
  }

  return {
    s,
    matchedTranslations
  }
}
