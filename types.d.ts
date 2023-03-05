import { languages } from "./src/shared/consts"

export type Platform = 'baidu'
export type Language = typeof languages[number]

export type Translator = (message: string | string[], from: Language, to: Language) => Promise<string | string[]>

export interface Un19nConfig {
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