/// <reference types="vite/client" />

import { describe, it, expect } from 'vitest'
import { matchRE } from '../src/regexp'
import vueTemplate from './cases/vue-template.vue?raw'

describe('regexp', () => {
  const re = matchRE({ options: { prefix: '__un19n' } } as any)
  it('match re', () => {
    expect(re.test(vueTemplate)).toBe(true)
  })

  it('match re metches', () => {
    expect(vueTemplate.match(re)?.length).toBe(3)
  })

  it('match re translate from language', () => {
    const matches = vueTemplate.matchAll(re)! ?? []
    for (const match of matches) {
      expect(match[1]).toBe('en')
    }
  })
})
