
import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import flatten from 'lodash.flatten'
import { translate } from './core'
import { setSrcTranslation, isUn19nPath, readUn19nConfig, readUn19nJSON, writeUn19nJSON, sleep, parseTag, existTranslation, setExists, isExist } from './shared/common'
import { resolveUn19nMatch, resolveUn19nOutputPath } from './shared/resolve'
import { languages } from './shared/consts'

const conf = await readUn19nConfig()

let messages = await readUn19nJSON(conf)

const exists: Partial<Record<string, Set<Language>>> = {}

export const RE = new RegExp(`(?:\\$)?t\\(["']((?:${languages.join('|')})?:.+?)["']\\)`, 'g')

export interface Un19nOptions {
  includes?: string[]
}

const un19n = createUnplugin((options?: Un19nOptions) => {
  let includes = ['.']

  if (options?.includes) { includes = options.includes }

  const fileRE = new RegExp(`.*${includes[0]}.*.(ts|js|tsx|jsx|vue)`, 'g')

  return {
    name: 'un19n',

    enforce: 'pre',

    resolveId (id) {
      if (!isUn19nPath(id)) { return null }
      return resolveUn19nOutputPath(conf)
    },

    loadInclude (id) {
      return isUn19nPath(id)
    },

    transformInclude: id => fileRE.test(id),

    async transform (code) {
      const matches = code.matchAll(RE)

      if (!matches) { return { code } }

      let hasTranslate = false

      const s = new MagicString(code)

      const languages: {
        from: Language
        to: Language
      }[] = []

      const pendings = new Set<string>()

      for (const match of matches) {
        if (!match) { continue }

        const { start, end, language, message, tag } = resolveUn19nMatch(conf, match)

        s.update(start, end, `${conf.prefix}.${message}`)

        if (isExist(conf, exists, message)) { continue }

        setExists(exists, message, language)

        messages = setSrcTranslation(conf, messages, language, message)
        hasTranslate = true

        for (const target of conf.to) {
          if (language === target) { continue }

          languages.push({ from: language, to: target })
          pendings.add(tag)
        }
      }

      for (const { from, to } of languages) {
        const src = [...pendings].map((p) => {
          return parseTag(conf, p)
        }).filter(({ language: l, message: m }) => {
          return l === from && !existTranslation(conf, messages, to, m)
        })?.map(({ message }) => {
          return message
        })

        if (!(src && src.length)) { continue }

        const t = await translate(conf)(src, from, to)

        hasTranslate = true

        flatten([t]).forEach((item, i) => {
          if (!messages[to]?.[conf.prefix]) { messages[to] = { [conf.prefix]: {} } }
          messages[to][conf.prefix][src[i]] = item

          setExists(exists, src[i], to)
        })

        await sleep(1000 / conf.qps)
      }

      if (hasTranslate) { await writeUn19nJSON(conf, messages) }

      return {
        code: s.toString(),
        map: s.generateMap()
      }
    }
  }
})

export default un19n
