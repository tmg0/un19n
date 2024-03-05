import md5 from 'md5'
import { nanoid } from 'nanoid'
import { ofetch } from 'ofetch'
import consola from 'consola'
import { defineTranslator } from '../utils'
import { BAIDU_TRANSLATE_API } from '../constants'
import type { BaiduTranslateError, BaiduTranslateResponse } from '../types'

const isError = (response: any): response is BaiduTranslateError => !!response.error_msg

const tanslator = defineTranslator<string[], 'baidu'>(async (options) => {
  const { appid, secret } = options.ctx.options.baidu!

  if (!appid) { return [] }
  if (!secret) { return [] }
  if (!options.message.length) { return [] }

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

  consola.info(`using Un19n(Baidu) to translate message from ${query.from} to ${query.to} \n`)

  const response = await ofetch<BaiduTranslateResponse>(BAIDU_TRANSLATE_API, { query })

  if (isError(response)) {
    consola.warn(response.error_msg)
    return []
  }

  const translations = response.trans_result

  const result = translations.map(({ dst }) => dst)

  translations.forEach(({ src, dst }) => {
    process.stdout.write(`${src} → ${dst}\n`)
  })

  return result
})

export default tanslator
