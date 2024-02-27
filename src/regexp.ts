import { createRegExp, maybe, anyOf, char } from 'magic-regexp'
import { Language } from './types'

export const matchRE = createRegExp(maybe('$'), 't(', maybe(anyOf(...Language)), ':', char, ')')
