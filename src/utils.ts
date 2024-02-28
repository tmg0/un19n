import MagicString from 'magic-string'

export const defineTranslator = () => {

}

export function getMagicString (code: string | MagicString) {
  if (typeof code === 'string') { return new MagicString(code) }
  return code
}
