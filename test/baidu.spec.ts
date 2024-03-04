import { describe, it, expect } from 'vitest'
import type { Un19nOptions } from '../src/types'
import translator from '../src/translators/baidu'

import 'dotenv/config'

const OPTIONS: Partial<Un19nOptions<'baidu'>> = {
  platform: 'baidu',
  from: 'en',
  to: ['de'],
  baidu: {
    appid: process.env.BAIDU_APP_ID!,
    secret: process.env.BAIDU_SECRET!
  }
}

describe('baidu', () => {
  it('tranlate apple', async () => {
    const ctx = { options: OPTIONS } as any
    expect(await translator({ message: ['apple'], from: 'en', to: 'de', ctx })).toEqual(['Apfel'])
  })
})
