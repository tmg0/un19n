enum Language {
  ZH = 'zh',
  EN = 'en'
}

enum Platform {
  BAIDU = 'baidu'
}

type Translator = (message: string, from: Language, to: Language) => Promise<string>

interface Un19nConfig {
  platform: Platform
  from: Language
  to: Language
  appid?: string
  secret?: string
}
