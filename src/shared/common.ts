import fse from 'fs-extra'
import { join } from 'pathe'

export const defineUn19nConfig = (config: Un19nConfig) => config

export const readUn19nConfig = (): Promise<Un19nConfig> => {
  const path = join(process.cwd(), 'un19n.config.json')
  return fse.readJson(path)
}

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => resolve(), ms)
})

export const writeUn19nJSON = async (conf: Un19nConfig, message: Record<string, Record<string, string>>) => {
  const path = join(process.cwd(), 'locales')
  await fse.ensureDir(path)
  const file = join(path, '_un19n.json')
  await fse.writeJson(file, message)
}
