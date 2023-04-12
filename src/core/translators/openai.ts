
import { ofetch } from 'ofetch'
import proxyAgent from 'https-proxy-agent'
import consola from 'consola'
import { BaseURL } from '../../shared/enums'
import { isArray } from '../../shared/common'

const { HttpsProxyAgent } = proxyAgent

export const OPENAI_COMPLETIONS = '/v1/completions'
export const OPENAI_CHAT_COMPLETIONS = '/v1/chat/completions'

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

export interface OpenaiChatCompletion {
  model: string
  messages: string
  temperature: number
}

export interface OpenaiCompletionChoice {
  finish_reason: string
  index: string
  logprobs?: unknown
  text: string
  message: {
    role: string
    content: string
  }
}

export interface OpenaiCompletionResult {
  choices: OpenaiCompletionChoice[]
}

export const openaiTranslator = ({ apiKey, organization, proxy, options: opts }: Un19nConfig): Translator => async (messages, from, to) => {
  if (!apiKey) { return '' }
  if (!organization) { return '' }

  const multi = isArray(messages)
  const msgs = multi ? messages : [messages]
  const baseURL = BaseURL.OPENAI

  const params = {
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant that translates ${from} to ${to} split by \n.`
      },
      {
        role: 'user',
        content: msgs.join('\n')
      }
    ]
  }

  const options = {
    method: 'POST',
    baseURL,
    headers: { Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(params)
  } as any

  if (proxy) { options.agent = new HttpsProxyAgent(proxy) }

  const response = await ofetch<OpenaiCompletionResult>(OPENAI_CHAT_COMPLETIONS, options)

  if (!response.choices) { return multi ? [] : '' }

  const result = response.choices[0].message.content.split('\n').map(text => text.trim())
  result.forEach((dst, index) => { consola.info(`Translate from ${from}: ${msgs[index]} => ${to}: ${dst}`) })

  return multi ? result : result[0] || ''
}
