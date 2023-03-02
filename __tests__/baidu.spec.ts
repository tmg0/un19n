import { describe, expect, it } from 'vitest'
import { readUn19nConfig } from '../src/shared/common'
import { translate } from '../src/core'

describe('baidu translator', () => {
  it('should translate message by baidu open api', async () => {
    const conf = await readUn19nConfig()
    expect(await translate(conf)('apple', conf.from, conf.to)).toBe('苹果')
  })
})
