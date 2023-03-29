
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

export interface OpenaiCompletionChoice {
  finish_reason: string
  index: string
  logprobs?: unknown
  text: string
}

export interface OpenaiCompletionResult {
  choices: OpenaiCompletionChoice[]
}

export const openaiTranslator = ({ apiKey, organization, proxy }: Un19nConfig): Translator => async (messages, from, to) => {
  if (!apiKey) { return '' }
  if (!organization) { return '' }

  const multi = isArray(messages)
  const msgs = multi ? messages : [messages]
  const baseURL = BaseURL.OPENAI

  const params = {
    model: 'text-davinci-003',
    prompt: msgs.map(msg => `Translate ${msg} to ${to}`),
    max_tokens: 60,
    temperature: 0,
    top_p: 1,
    n: 1,
    stream: false,
    logprobs: null,
    stop: null
  }

  const options = {
    method: 'POST',
    baseURL,
    headers: { Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(params)
  } as any

  if (proxy) { options.agent = new HttpsProxyAgent(proxy) }

  const response = await ofetch<OpenaiCompletionResult>(OPENAI_COMPLETIONS, options)

  const result = response.choices.map(({ text }) => text.trim())

  return multi ? result : result[0] || ''
}
