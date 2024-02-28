import { createRegExp, maybe, anyOf, word, global, multiline } from 'magic-regexp'
import { stripLiteral } from 'strip-literal'
import { LANGUAGES } from './constants'

export const matchRE = createRegExp(
  maybe('$'),
  't(',
  anyOf('\'', '"', '`'),
  anyOf('_', '', ...LANGUAGES).grouped(),
  ':',
  word.grouped(),
  anyOf('\'', '"', '`'),
  ')',
  [global, multiline]
)

const regexRE = /\/[^\s]*?(?<!\\)(?<!\[[^\]]*)\/[gimsuy]*/g

export const stripCommentsAndStrings = (code: string) => {
  return stripLiteral(code)
    .replace(regexRE, 'new RegExp("")')
}
