import fse from 'fs-extra'
import { join } from 'pathe'
import merge from 'lodash.merge'
import { defaultUn19nConfig } from '../shared/consts'

const URL_PREFIXES = ['/~un19n/', '~un19n/', '~un19n', 'virtual:un19n/', 'virtual/un19n/', 'virtual/un19n']
const un19nPathRE = new RegExp(`${URL_PREFIXES.map(v => `^${v}`).join('|')}`)

export const defineUn19nConfig = (config: Un19nConfig) => config

export const readUn19nConfig = async (): Promise<Un19nConfig> => {
  const path = join(process.cwd(), 'un19n.config.json')
  const conf = await fse.readJson(path)
  return merge(defaultUn19nConfig, conf)
}

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => resolve(), ms)
})

export const readUn19nJSON = async (conf: Un19nConfig): Promise<any> => {
  try {
    const path = join(process.cwd(), conf.output, conf.filename)
    const json = await fse.readJson(path)
    return json
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

export const ensureSrcTranslation = (conf: Un19nConfig, messages: any, language: Language, message: string) => {
  if (!messages[language]?.[conf.prefix]) { messages[language] = { [conf.prefix]: {} } }
  messages[language][conf.prefix][message] = message
}

export const skipTranslate = (conf: Un19nConfig, messages: any, language: Language, target: Language, message: string): boolean => {
  if (language && language === target) { return true }
  if (messages[target]?.[conf.prefix]?.[message]) { return true }
  return false
}

export const existTranslation = () => {

}
