const languages = ['zh', 'en', 'de'] as const

type Platform = 'baidu'
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
}


declare module "~un19n" {
  export default any
}
