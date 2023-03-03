
import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import { translate } from './core'
import { ensureSrcTranslation, isUn19nPath, readUn19nConfig, readUn19nJSON, skipTranslate, sleep, writeUn19nJSON } from './shared/common'
import { resolveUn19nMatch, resolveUn19nOutputPath } from './shared/resolve'

export const re = /(?:\$)?t\(["']((?:zh|en):.+?)["']\)/g

export interface Un19nOptions {
  includes?: string[]
}

const un19n = createUnplugin((options?: Un19nOptions) => {
  const [src] = options?.includes || ['src']

  const fileRE = new RegExp(`.*${src}.*.(ts|js|tsx|jsx|vue)`, 'g')

  return {
    name: 'un19n',

    enforce: 'pre',

    async resolveId (id) {
      if (!isUn19nPath(id)) { return null }
      const conf = await readUn19nConfig()
      return resolveUn19nOutputPath(conf)
    },

    loadInclude (id) {
      return isUn19nPath(id)
    },

    transformInclude: id => fileRE.test(id),

    async transform (code) {
      const matches = code.matchAll(re)
      if (!matches) { return { code } }

      const s = new MagicString(code)
      const conf = await readUn19nConfig()
      const messages = await readUn19nJSON(conf)

      for (const match of matches) {
        if (!match) { break }

        const { start, end, language, message } = resolveUn19nMatch(match)

        s.update(start, end, `${conf.prefix}.${message}`)

        ensureSrcTranslation(conf, messages, language, message)

        for (const target of conf.to) {
          if (skipTranslate(conf, messages, language, target, message)) { continue }

          const t = await translate(conf)(message, language, target)

          if (!messages[target]?.[conf.prefix]) { messages[target] = { [conf.prefix]: {} } }

          messages[target][conf.prefix][message] = t

          await sleep(1000)
        }
      }

      writeUn19nJSON(conf, messages)

      return {
        code: s.toString(),
        map: s.generateMap()
      }
    }
  }
})

export default un19n
