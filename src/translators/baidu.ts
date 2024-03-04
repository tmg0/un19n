import md5 from 'md5'
import { nanoid } from 'nanoid'
import { ofetch } from 'ofetch'
import { defineTranslator } from '../utils'
import { BAIDU_TRANSLATE_API } from '../constants'
import type { BaiduTranslateError, BaiduTranslateResponse } from '../types'

const isError = (response: any): response is BaiduTranslateError => !!response.error_msg

export default defineTranslator<string[], 'baidu'>(async (options) => {
  const { appid, secret } = options.ctx.options.baidu!

  if (!appid) { return [] }
  if (!secret) { return [] }

  const q = options.message.join('\n')
  const salt = nanoid()

  const query = {
    q,
    from: options.from,
    to: options.to,
    salt,
    appid,
    sign: md5(`${appid}${q}${salt}${secret}`)
  }

  const response = await ofetch<BaiduTranslateResponse>(BAIDU_TRANSLATE_API, { query })

  if (isError(response)) {
    throw response
  }

  const translations = response.trans_result

  const result = translations.map(({ dst }) => dst)

  translations.forEach(({ dst }) => {
    process.stdout.write(`${options.from} → ${dst}\n`)
  })

  return result
})
