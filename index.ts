
import { createUnplugin } from 'unplugin'

export { translators } from './src/core'

export const translationFuncRE = /\st\({zh|en}:(.*)\s*?/

export const un19n = createUnplugin(() => {
  return {
    name: 'un19n',
    transformInclude: id => /.*src.*\.(ts|js|tsx|jsx|vue)/.test(id),
    transform: () => {
      return {
        code: '',
        map: ''
      }
    }
  }
})
