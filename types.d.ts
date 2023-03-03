type Platform = 'baidu'
type Language = 'zh' | 'en'

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
}


declare module "~un19n" {
  export default any
}