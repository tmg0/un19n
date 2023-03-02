import { ofetch } from 'ofetch'
import { BaseURL } from 'src/enums'

export const BAIDU_TRANSLATE = '/api/trans/vip/translate'

export interface BaiduTransResult {
  from: Language
  to: Language
  trans_result: {
    src: string
    dst: string
  }[]
}

export const baiduTranslator: Translator = async (q, from, to) => {
  const baseURL = BaseURL.BAIDU
  const salt = new Date().getTime()
  const query = { q, from, to, salt }
  const { trans_result } = await ofetch<BaiduTransResult>(BAIDU_TRANSLATE, { baseURL, query })

  if (!trans_result.length) { return '' }

  const [{ dst }] = trans_result
  return dst
}
