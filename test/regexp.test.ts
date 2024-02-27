/// <reference types="vite/client" />

import { describe, it, expect } from 'vitest'
import { matchRE } from '../src/regexp'
import vueTemplate from './cases/vue-template.vue?raw'

describe('regexp', () => {
  it('match re', () => {
    expect(matchRE.test(vueTemplate)).toBe(true)
  })

  it('match re metches', () => {
    expect(vueTemplate.match(matchRE)?.length).toBe(3)
  })

  it('match re translate from language', () => {
    const matches = vueTemplate.matchAll(matchRE)! ?? []
    for (const match of matches) {
      expect(match[1]).toBe('en')
    }
  })
})
