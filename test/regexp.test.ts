import { describe, it, expect } from 'vitest'
import { matchRE } from '../src/regexp'
import vueTemplate from './cases/vue-template.vue?raw'

describe('regexp', () => {
  it('match re', () => {
    expect(matchRE.test(vueTemplate)).toBe(true)
  })
})
