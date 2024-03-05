import MagicString from 'magic-string'
import type { Translator } from './types'

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => resolve(), ms)
})

export const defineTranslator = <M extends string | string[], C extends Platform>(translator: Translator<M, C>) => translator

export function getMagicString (code: string | MagicString) {
  if (typeof code === 'string') { return new MagicString(code) }
  return code
}
