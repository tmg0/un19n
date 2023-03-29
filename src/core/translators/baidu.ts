import md5 from 'md5'
import { nanoid } from 'nanoid'
import { ofetch } from 'ofetch'
import consola from 'consola'
import { BaseURL } from '../../shared/enums'
import { isArray } from '../../shared/common'

export const BAIDU_TRANSLATE = '/api/trans/vip/translate'

export interface BaiduTransError {
  error_msg: string
  data: Record<string, string>
}

export interface BaiduTransResult {
  from: Language
  to: Language
  trans_result: {
    src: string
    dst: string
  }[]
}

export const isError = (response: any): response is BaiduTransError => !!response.error_msg

export const generateBaiduSign = (appid: string, q: string, salt: string | number, secret: string) => {
  return md5(`${appid}${q}${salt}${secret}`)
}

export const baiduTranslator = ({ appid, secret }: Un19nConfig): Translator => async (messages, from, to) => {
  if (!appid) { return '' }
  if (!secret) { return '' }

  const multi = isArray(messages)
  const q = (multi ? messages.join('\n') : messages) as string

  const baseURL = BaseURL.BAIDU
  const salt = nanoid()

  const sign = generateBaiduSign(appid, q, salt, secret)

  const query = { q, from, to, salt, appid, sign }

  const response = await ofetch<BaiduTransResult | BaiduTransError>(BAIDU_TRANSLATE, { baseURL, query })

  if (isError(response)) {
    consola.error(response)
    throw response
  }

  const translations = response.trans_result

  const result = translations.map(({ dst }) => dst)

  translations.forEach(({ src, dst }) => { consola.info(`Translate from ${from}: ${src} => ${to}: ${dst}`) })

  return multi ? result : result[0]
}
