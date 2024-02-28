import type { Un19nOptions } from './types'

export const UN19N_CONFIG_FILE = 'un19n'

export const LANGUAGES = ['zh', 'en', 'jp', 'kor', 'fra', 'spa', 'th', 'ara', 'ru', 'pt', 'de', 'it', 'el', 'nl', 'pl'] as const

export const DEFAULT_UN19N_OPTIONS: Partial<Un19nOptions> = {
  from: 'auto',
  to: [],
  prefix: '__un19n',
  qps: 100
}
