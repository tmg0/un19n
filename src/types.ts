export const Language = ['zh', 'en', 'de'] as const

export type Platform = 'baidu' | 'openai'

export type Translator = <T extends string | string[]>(message: T[], from: Language, to: Language) => Promise<T[]>

export interface BaiduOptions {
  appid: string
  secret: string
}

export interface Un19nOptions {
  /**
   * Translator based platform
   * @default 'baidu'
   */
  platform: Platform

  /**
   * Default source language
   * @default 'en'
   */
  from: Language

  /**
   * Translation target languages
   * @default []
   */
  to: Language[]

  /**
   * Baidu APIs access options
   * @default undefined
   */
  baidu?: BaiduOptions
}
