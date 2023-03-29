
import { Configuration, OpenAIApi } from 'openai'
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

export const openaiTranslator = ({ apiKey, organization }: Un19nConfig): Translator => async (messages, from, to) => {
  if (!apiKey) { return '' }
  if (!organization) { return '' }

  const configuration = new Configuration({ organization, apiKey })
  const openai = new OpenAIApi(configuration)

  const multi = isArray(messages)

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: 'Say this is a test',
    max_tokens: 7,
    temperature: 0,
    stop: null
  })

  console.log(response)

  return ''
}
