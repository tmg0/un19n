import { describe, expect, it } from 'vitest'
import { baiduTranslator, readUn19nConfig } from '../index'

describe('baidu translator', () => {
  it('should translate message by baidu open api', async () => {
    const conf = await readUn19nConfig()
    expect(await baiduTranslator(conf)('apple', 'en', 'zh')).toBe('苹果')
  })
})
