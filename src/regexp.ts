import { createRegExp, maybe, anyOf, word, global, multiline, whitespace, tab, linefeed, carriageReturn } from 'magic-regexp'
import { LANGUAGES } from './constants'
import type { Un19nContext, Platform } from './types'

export const matchRE = <T extends Platform>(ctx: Un19nContext<T>) => createRegExp(
  anyOf(whitespace, tab, linefeed, carriageReturn, '{', ',', ';', '+'),
  maybe('$'),
  't(',
  anyOf('\'', '"', '`'),
  ctx.options.prefix,
  '.',
  maybe(anyOf('_', ...LANGUAGES)).grouped(),
  maybe(':'),
  word.grouped(),
  anyOf('\'', '"', '`'),
  ')',
  [global, multiline]
)
