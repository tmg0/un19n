enum Language {
  ZH = 'zh',
  EN = 'en'
}

enum Platform {
  BAIDU = 'baidu'
}

type Translator = (message: string, from: Language, to: Language) => string

interface Un19nConfig {
  platform: Platform
  from: Language
  to: Language
}
