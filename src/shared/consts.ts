export const languages = ['zh', 'en', 'de'] as const

export const defaultUn19nConfig: Partial<Un19nConfig> = {
  platform: 'baidu',
  from: 'en',
  to: [],
  root: '.',
  output: 'locales',
  filename: '_un19n.json',
  prefix: '_un19n',
  qps: 1,
  splitting: false
}
