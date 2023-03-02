
import { createUnplugin } from 'unplugin'
import { translate } from './src/core'
import { readUn19nConfig, sleep, writeUn19nJSON } from './src/shared/common'

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

      const messages: Record<string, Record<string, string>> = {}

      const conf = await readUn19nConfig()

      for (const match of matches) {
        const [_, tag] = match

        if (!tag) { break }
        if (!tag.includes(':')) { break }

        const [language, message] = tag.split(':')

        if (language && language === conf.to) { continue }

        const t = await translate(conf)(message, language, conf.to)

        if (!messages[conf.to]) { messages[conf.to] = {} }

        messages[conf.to][message] = t

        console.log(messages[conf.to][message])
        console.log(`tanslation: ${t}`)

        await sleep(1000)
      }

      if (Object.keys(messages).length) {
        writeUn19nJSON(conf, messages)
      }

      return { code }
    }
  }
})
