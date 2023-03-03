
import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import flatten from 'lodash.flatten'
import { translate } from './core'
import { setSrcTranslation, isUn19nPath, readUn19nConfig, readUn19nJSON, writeUn19nJSON, sleep, parseTag } from './shared/common'
import { resolveUn19nMatch, resolveUn19nOutputPath } from './shared/resolve'

export const RE = /(?:\$)?t\(["']((?:zh|en):.+?)["']\)/g

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
      const matches = code.matchAll(RE)

      if (!matches) { return { code } }

      const s = new MagicString(code)

      const languages: {
        from: Language
        to: Language
      }[] = []

      const pendings = new Set<string>()

      const conf = await readUn19nConfig()

      const messages = await readUn19nJSON(conf)

      for (const match of matches) {
        if (!match) { break }

        const { start, end, language, message, tag } = resolveUn19nMatch(conf, match)

        s.update(start, end, `${conf.prefix}.${message}`)

        setSrcTranslation(conf, messages, language, message)

        for (const target of conf.to) {
          if (language === target) { continue }

          languages.push({ from: language, to: target })
          pendings.add(tag)
        }
      }

      for (const { from, to } of languages) {
        const src = [...pendings].map(p => parseTag(conf, p)).filter(({ language: l }) => l === from).map(({ message }) => message)
        const t = await translate(conf)(src, from, to)

        flatten([t]).forEach((item, i) => {
          if (!messages[to]?.[conf.prefix]) { messages[to] = { [conf.prefix]: {} } }
          messages[to][conf.prefix][src[i]] = item
        })

        await sleep(1000)
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
