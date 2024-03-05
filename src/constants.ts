import type { Un19nOptions } from './types'

export const UN19N_CONFIG_FILE = 'un19n'

export const LANGUAGES = ['zh', 'en', 'jp', 'kor', 'fra', 'spa', 'th', 'ara', 'ru', 'pt', 'de', 'it', 'el', 'nl', 'pl'] as const

export const BaseURL = {
  BAIDU: 'http://api.fanyi.baidu.com'
}

export const BAIDU_TRANSLATE_API = BaseURL.BAIDU + '/api/trans/vip/translate'

export const DEFAULT_UN19N_OPTIONS: Un19nOptions = {
  platform: undefined,
  from: 'auto',
  to: [],
  output: 'src/locales/__un19n.json',
  prefix: '__un19n',
  qps: 100,
  baidu: undefined
}
