export const Language = ['zh', 'en', 'de'] as const

export type Platform = 'baidu' | 'openai'

export type Translator = <T extends string | string[]>(message: T[], from: Language, to: Language) => Promise<T[]>

export interface Un19nOptions {
  platform: Platform
  from: Language
  to: Language[]
}
