export const Language = ['zh', 'en', 'jp', 'kor', 'fra', 'spa', 'th', 'ara', 'ru', 'pt', 'de', 'it', 'el', 'nl', 'pl'] as const

export type Platform = 'baidu' | 'openai'

export type Translator = <T extends string | string[]>(message: T[], from: Language, to: Language) => Promise<T[]>

export interface BaiduOptions {
  appid: string
  secret: string
}

export interface Un19nOptions<T extends Platform = 'baidu'> {
  /**
   * Translator based platform
   * @default "baidu"
   */
  platform: T

  /**
   * Default source language
   * @default "auto"
   */
  from: Language | 'auto'

  /**
   * Translation target languages
   * @default []
   */
  to: Language[]

  /**
   * Custom tanslation prefix
   * @default "_un19n"
   */
  prefix?: string

  /**
   * Baidu APIs access options, required if used baidu as platform
   * @default undefined
   */
  baidu: T extends 'baidu' ? BaiduOptions : undefined | null | false

  /**
   * Queries per second
   * @default 100
   */
  qps?: number
}

export interface Un19n {

}
