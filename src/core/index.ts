import { baiduTranslator } from './translators/baidu'

export const translators: Record<Platform, (conf: Un19nConfig) => Translator> = {
  baidu: baiduTranslator
}

export const translate = (conf: Un19nConfig) => translators[conf.platform](conf)
