import fse from 'fs-extra'
import { join } from 'pathe'
import merge from 'lodash.merge'
import { defaultUn19nConfig } from '../shared/consts'

const URL_PREFIXES = ['/~un19n/', '~un19n/', '~un19n', 'virtual:un19n/', 'virtual/un19n/', 'virtual/un19n']
const un19nPathRE = new RegExp(`${URL_PREFIXES.map(v => `^${v}`).join('|')}`)

export const defineUn19nConfig = (config: Un19nConfig) => config

export const readUn19nConfig = async (): Promise<Un19nConfig> => {
  const path = join(process.cwd(), 'un19n.config.json')
  try {
    const conf = await fse.readJson(path)
    const res: Un19nConfig = merge(defaultUn19nConfig, conf)

    if (!res.to.includes(res.from)) { res.to = [...res.to, res.from] }

    return res
  } catch {
    const err = new Error('Can not find un19n config file.')
    consola.error(err)
    throw err
  }
}

export const isArray = (value: any): value is any[] => Array.isArray(value)

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => resolve(), ms)
})

export const readUn19nJSON = async (conf: Un19nConfig): Promise<any> => {
  try {
    const path = join(process.cwd(), conf.output, conf.filename)
    const json = await fse.readJson(path)
    return json || {}
  } catch {
    return Promise.resolve({})
  }
}

export const writeUn19nJSON = async (conf: Un19nConfig, message: Record<string, Record<string, string>>) => {
  const path = join(process.cwd(), conf.output, conf.filename)
  await fse.ensureFile(path)
  await fse.writeJson(path, message)
}

export const isUn19nPath = (path: string): boolean => {
  return un19nPathRE.test(path)
}

export const normalizeUn19nPath = (path: string) => {
  return path.replace(un19nPathRE, URL_PREFIXES[0])
}

export const setSrcTranslation = (conf: Un19nConfig, messages: any, language: Language, message: string, key = message) => {
  if (!messages[language]?.[conf.prefix]) { messages[language] = { [conf.prefix]: {} } }
  messages[language][conf.prefix][key] = message
  return messages
}

export const skipTranslate = (conf: Un19nConfig, messages: any, language: Language, target: Language, message: string): boolean => {
  if (language && language === target) { return true }
  if (messages[target]?.[conf.prefix]?.[message]) { return true }
  return false
}

export const existTranslation = (conf: Un19nConfig, messages: any, language: Language, src: string) => {
  return !!messages?.[language]?.[conf.prefix]?.[src]
}

export const setUn19nLanguage = (conf: Un19nConfig, messages: any, language: Language, key: string, t: string) => {
  if (!messages[language]?.[conf.prefix]) { messages[language] = { [conf.prefix]: {} } }
  messages[language][conf.prefix][key] = t
}

export const parseTag = (conf: Un19nConfig, tag: string) => {
  const [language, message] = tag.split(':') as [Language, string]

  return {
    language: language || conf.from,
    message
  }
}

export const setExists = (exists: any, src: string, to: Language) => {
  if (!exists[src]) { exists[src] = new Set() }
  exists[src].add(to)
  return exists
}

export const isExist = (conf: Un19nConfig, exists: any, src: string) => {
  if (!exists[src]) { return false }

  const arr = [...exists[src]]

  if (arr.length !== conf.to.length) { return false }

  return conf.to.every(item => arr.includes(item))
}
