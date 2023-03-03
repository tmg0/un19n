import fse from 'fs-extra'
import { join } from 'pathe'
import consola from 'consola'

export const defineUn19nConfig = (config: Un19nConfig) => config

export const readUn19nConfig = async (): Promise<Un19nConfig> => {
  const path = join(process.cwd(), 'un19n.config.json')
  consola.info('Reading un19n config file')
  const conf = await fse.readJson(path)
  consola.success('Un19n config file read complete')
  return conf
}

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => resolve(), ms)
})

export const readUn19nJSON = async (): Promise<any> => {
  try {
    consola.info('Reading exist locale file')
    const path = join(process.cwd(), 'src/locales', '_un19n.json')
    const { un19n } = await fse.readJson(path)
    consola.success('Locale messages read complete')
    return un19n
  } catch {
    consola.warn('Do not exist locale messages')
    return {}
  }
}

export const writeUn19nJSON = async (conf: Un19nConfig, message: Record<string, Record<string, string>>) => {
  const path = join(process.cwd(), 'src/locales')
  await fse.ensureDir(path)
  const file = join(path, '_un19n.json')
  consola.success('Writing locale messages')
  await fse.writeJson(file, { un19n: message })
  consola.success('Locale messages write complete')
}
