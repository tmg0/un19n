import { createRegExp, maybe, anyOf, word, global, multiline } from 'magic-regexp'
import { Language } from './types'

export const matchRE = createRegExp(maybe('$'), 't(', anyOf('\'', '"', '`'), anyOf('_', ...Language), ':', word, anyOf('\'', '"', '`'), [global, multiline])
