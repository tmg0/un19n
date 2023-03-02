
import { createUnplugin } from 'unplugin'
import { translate } from './src/core'
import { readUn19nConfig, readUn19nJSON, sleep, writeUn19nJSON } from './src/shared/common'

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

      const messages = await readUn19nJSON()

      const conf = await readUn19nConfig()

      for (const match of matches) {
        const [_, tag] = match

        if (!tag) { break }
        if (!tag.includes(':')) { break }

        const [language, message] = tag.split(':')

        if (!messages[language]) { messages[language] = {} }
        messages[language][message] = message

        if (language && language === conf.to) { continue }
        if (messages[conf.to][message]) { continue }

        const t = await translate(conf)(message, language as Language, conf.to)

        if (!messages[conf.to]) { messages[conf.to] = {} }

        messages[conf.to][message] = t

        await sleep(1000)
      }

      if (Object.keys(messages).length) {
        writeUn19nJSON(conf, messages)
      }

      return { code }
    }
  }
})
