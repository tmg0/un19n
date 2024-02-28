import { loadConfig } from 'c12'
import { defu } from 'defu'
import { DEFAULT_UN19N_OPTIONS, UN19N_CONFIG_FILE } from './constants'
import { Un19nOptions } from './types'
import { Un19nPluginOptions } from './_unplugin'

export const resolveConfig = async () => {
  const { config } = await loadConfig<Un19nOptions>({ name: UN19N_CONFIG_FILE, cwd: process.cwd(), defaults: DEFAULT_UN19N_OPTIONS })
  if (!config) { throw new Error('Can not find un19n config file.') }
  return config
}

export const resolvePluginConfig = async (options: Partial<Un19nPluginOptions>) => {
  const config = await resolveConfig()
  return defu(options as Un19nPluginOptions, config)
}
