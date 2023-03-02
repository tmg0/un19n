import fse from 'fs-extra'

export const defineUn19nConfig = (config: Un19nConfig) => config

export const getUn19nConfig = (): Promise<Un19nConfig> => {
  return fse.readJson(process.cwd())
}
