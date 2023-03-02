import { baiduTranslator } from './translators/baidu'
import { readUn19nConfig } from 'src/shared/common'

const conf = readUn19nConfig()

export const translators: Record<Platform, Translator> = {
  baidu: baiduTranslator(await conf)
}
