import { Configuration, OpenAIApi } from 'openai'
import { isArray } from '../../shared/common'

export const openaiTranslator = ({ apiKey }: Un19nConfig): Translator => async (messages, from, to) => {
  if (!apiKey) { return '' }

  const conf = new Configuration({ apiKey })
  const openai = new OpenAIApi(conf)

  const multi = isArray(messages)

  if (multi) {
    const batchRequests = messages.map((msg) => {
      return {
        prompt: `Translate '${msg}' to ${to}:`,
        temperature: 0,
        max_tokens: 60,
        n: 1,
        stop: null,
        frequency_penalty: 0,
        presence_penalty: 0
      }
    })

    openai.createCompletion(batchRequests[0])
  }

  return ''
}
