import { baiduTranslator } from './translators/baidu'
import { openaiTranslator } from './translators/openai'

export const translators: Record<Platform, (conf: Un19nConfig) => Translator> = {
  baidu: baiduTranslator,
  openai: openaiTranslator
}

export const translate = (conf: Un19nConfig) => translators[conf.platform](conf)
