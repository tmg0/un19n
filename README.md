# un19n

Quick i18n translation generator

## Setup

Make sure to install the dependencies:

```ts
pnpm add un19n -D
```

## Usage

### Add types to your tsconfig file

```json
{
  "compilerOptions": {
    "types": ["un19n/types"]
  }
}
```

### Add `un19n` to your builder plugin.

#### Vite

```ts vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import un19n from "un19n";

export default defineConfig({
  plugins: [vue(), un19n.vite()],
});
```

#### Webpack

```ts webpack.config.js
module.exports = {
  plugins: [
    require('un19n').webpack({ /* options */ })
  ]
}
```

### Use `un19n` with internationalization plugins

#### vue-i18n

```ts main.ts
import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import messages from "~un19n";

const i18n = createI18n({
  locale: "zh",
  messages,
});

createApp(App).use(i18n).mount("#app");
```

## Config

Add `un19n.config.json` file to your project root dir

```ts un19n.config.json
{
  {
  "platform": "openai",
  "appid": YOUR_BAIDU_APP_ID,
  "secret": YOUR_BAIDU_SECRET,
  "from": "en",
  "to": ["zh", "de"],
  "output": "src/locales",
  "apiKey": YOUR_OPENAI_API_KEY,
  "organization": YOUR_OPENAI_ORGINATION,
  "proxy": YOUR_LOCAL_PROXY_AGENT
}
}
```

## Apis

### Un19nConfig

```ts
interface Un19nConfig {
  platform: Platform
  from: Language
  to: Language[]
  appid?: string
  secret?: string
  root: string
  output: string
  filename: string
  includes: string[]
  prefix: string
  qps: number
  splitting: boolean
  apiKey?: string
  organization?: string
  proxy?: string
}
```

### Platform

```ts
type Platform = 'baidu' | 'openai'
```

### Language

```ts
type Language = 'zh' | 'en' | 'de'
```

## Features

- Nuxt module
- More platform
- Support ChatGPT

## License
[MIT](./LICENSE)
