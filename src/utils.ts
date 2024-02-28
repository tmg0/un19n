import MagicString from 'magic-string'
import { Un19nOptions } from './types'

export const defineConfig = (options: Un19nOptions) => options

export const defineTranslator = () => {

}

export function getMagicString (code: string | MagicString) {
  if (typeof code === 'string') { return new MagicString(code) }
  return code
}
