import type MagicString from 'magic-string'
import { LANGUAGES } from './constants'

export type Language = typeof LANGUAGES[number]

export type Platform = 'baidu' | 'openai' | undefined

export type Translator = <T extends string | string[]>(message: T, from: Language, to: Language) => Promise<T>

export interface BaiduOptions {
  appid: string
  secret: string
}

export interface Un19nOptions<T extends Platform = undefined> {
  /**
   * Translator based platform
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
   * @default "__un19n"
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

  /**
   * Custom translator
   * @param t - translator callback
   * @default undefined
   */
  translator?: (t: Translator) => void
}

export interface Translation {
  message: string
  from: Language
  to: Language[]
}

export interface Un19nContext<T extends Platform = undefined> {
  readonly version: string

  options: Partial<Un19nOptions<T>>
}

export interface Un19n {
  detectTranslations: (code: string | MagicString) => DetectTranslationResult
}

export interface DetectTranslationResult {
  s: MagicString
  matchedTranslations: Translation[]
}
