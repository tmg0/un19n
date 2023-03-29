
import { ofetch } from 'ofetch'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { BaseURL } from '../../shared/enums'
import { isArray } from '../../shared/common'

export const OPENAI_COMPLETIONS = '/v1/completions'

export interface OpenaiCompletion {
  model: string
  prompt:string
  max_tokens:number
  temperature: number
  top_p:number
  n: number
  stream: boolean
  stop: string | null
}

export const openaiTranslator = ({ apiKey, organization, proxy }: Un19nConfig): Translator => async (messages, from, to) => {
  if (!apiKey) { return '' }
  if (!organization) { return '' }

  const multi = isArray(messages)
  const baseURL = BaseURL.OPENAI

  const options = {
    method: 'POST',
    baseURL,
    agent: HTTP_PROXY_AGENT,
    headers: { Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'text-davinci-002',
      prompt: 'Say this is a test',
      max_tokens: 7,
      temperature: 0,
      top_p: 1,
      n: 1,
      stream: false,
      logprobs: null,
      stop: null
    })
  } as any

  if (proxy) { options.agent = new HttpsProxyAgent(proxy) }

  const response = await ofetch(OPENAI_COMPLETIONS, options)

  console.log(response)

  // const response = await openai.createCompletion({
  //   model: 'text-davinci-003',
  //   prompt: 'Say this is a test',
  //   max_tokens: 7,
  //   temperature: 0,
  //   stop: null
  // })

  // console.log(response)

  return ''
}
