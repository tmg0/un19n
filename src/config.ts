import { loadConfig } from 'c12'
import { DEFAULT_UN19N_OPTIONS, UN19N_CONFIG_FILE } from './constants'
import { Un19nOptions } from './types'

export const defineConfig = (options: Un19nOptions) => options

export const resolveConfig = async () => {
  const { config } = await loadConfig<Un19nOptions>({ name: UN19N_CONFIG_FILE, cwd: process.cwd(), defaults: DEFAULT_UN19N_OPTIONS })
  if (!config) { throw new Error('Can not find un19n config file.') }
  return config
}
