
import { createUnplugin } from 'unplugin'
import { translate, translators } from './src/core'
import { readUn19nConfig } from './src/shared/common'

export { translators } from './src/core'

export const re = /(?:\$)?t\(["']((?:zh|en):.+?)["']\)/g

export interface Un19nOptions {
  includes?: string[]
}

export const un19n = createUnplugin((options: Un19nOptions) => {
  const [src] = options?.includes || ['src']

  const fileRE = new RegExp(`.*${src}.*.(ts|js|tsx|jsx|vue)`, 'g')

  return {
    name: 'un19n',

    transformInclude: id => fileRE.test(id),

    transform: async (code, id) => {
      const matches = code.matchAll(re)
      if (!matches) { return { code } }

      const conf = await readUn19nConfig()

      for (const match of matches) {
        const [_, tag] = match
        const [language, message] = tag.split(':')

        if (language === conf.to) { continue }

        const translation = await translate(conf)(message, language, conf.to)
        console.log(`translation: ${translation}`)
      }

      return { code }
    }
  }
})
