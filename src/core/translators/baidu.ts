import md5 from 'md5'
import { ofetch } from 'ofetch'
import { BaseURL } from 'src/enums'
import { sleep } from 'src/shared/common'

export const BAIDU_TRANSLATE = '/api/trans/vip/translate'

export interface BaiduTransResult {
  from: Language
  to: Language
  trans_result: {
    src: string
    dst: string
  }[]
}

export const generateBaiduSign = (appid: string, q: string, salt: string | number, secret: string) => {
  return md5(`${appid}${q}${salt}${secret}`)
}

export const baiduTranslator = ({ appid, secret }: Un19nConfig): Translator => async (q, from, to) => {
  if (!appid) { return '' }
  if (!secret) { return '' }

  const baseURL = BaseURL.BAIDU
  const salt = new Date().getTime()

  const sign = generateBaiduSign(appid, q, salt, secret)

  const query = { q, from, to, salt, appid, sign }
  const data = await ofetch<BaiduTransResult>(BAIDU_TRANSLATE, { baseURL, query })

  if (!data.trans_result.length) { return '' }

  const [{ dst }] = data.trans_result

  await sleep(500)

  return dst
}
