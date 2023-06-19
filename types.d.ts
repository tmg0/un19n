const languages = ['zh', 'en', 'de'] as const

type Platform = 'baidu' | 'openai'
type Language = typeof languages[number]
type Translator = (message: string | string[], from: Language, to: Language) => Promise<string | string[]>

interface Un19nConfig {
  platform: Platform
  from: Language
  to: Language[]
  appid?: string
  secret?: string
  root: string
  output: string
  filename: string
  includes: string[]
  prefix: string
  qps: number
  splitting: boolean
  apiKey?: string
  organization?: string
  proxy?: string
  options?: Un19nConfigOptions
}

interface Un19nConfigOptions {
  model: 'text-davinci-003'
  max_tokens: number
  temperature: number
  top_p: number
  n: number
}

interface Un19nOptions {
  includes?: string[]
}
declare module "~un19n/messages" {
  const messages: Record<Language, any>
  export default messages
}
