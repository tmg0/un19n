import type MagicString from 'magic-string'
import { LANGUAGES } from './constants'

export type Language = typeof LANGUAGES[number]

export type Platform = 'baidu' | 'openai' | undefined

export interface BaiduOptions {
  baseURL: string
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
  prefix: string

  /**
   * Output messages file
   * @default "locale/__un19n.json"
   */
  output: string

  /**
   * Baidu APIs access options, required if used baidu as platform
   * @default undefined
   */
  baidu: T extends 'baidu' ? BaiduOptions : undefined | null | false

  /**
   * Queries per second
   * @default 100
   */
  qps: number

  /**
   * Custom translator
   * @param t - translator callback
   * @default undefined
   */
  translator?: <M extends string | string[], C extends Platform>(t: Translator<M, C>) => void
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

export interface Un19n<T extends Platform = undefined> {
  options: Un19nOptions<T>
  init: () => void | Promise<void>
  detectTranslations: (code: string | MagicString) => DetectTranslationResult
  injectTranslations: (code: string | MagicString, id: string) => Promise<void>
}

export interface DetectTranslationResult {
  s: MagicString
  matchedTranslations: Translation[]
}

export interface TranslatorOptions<M extends string | string[] = string, C extends Platform = undefined> {
  message: M
  from: Language
  to: Language
  ctx: Un19n<C>
}

export type Translator<M extends string | string[], C extends Platform> = (options: TranslatorOptions<M, C>) => Promise<string[]> | M

export type TranslationMap = Partial<Record<Language, Record<string, string>>>

export interface BaiduTranslateSuccess {
  from: Language
  to: Language
  trans_result: {
    src: string
    dst: string
  }[]
}

export interface BaiduTranslateError {
  error_msg: string
  data: Record<string, string>
}

export type BaiduTranslateResponse = BaiduTranslateSuccess | BaiduTranslateError
