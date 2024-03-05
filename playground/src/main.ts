import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import __un19n from './locales/__un19n.json'

const i18n = createI18n({
  messages: __un19n
})

createApp(App).use(i18n).mount('#app')
