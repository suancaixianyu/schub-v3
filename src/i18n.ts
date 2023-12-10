import { createI18n } from 'vue3-i18n'
// @ts-ignore
import en from './lang/en-US.json'
// @ts-ignore
import zh from './lang/zh-CN.json'

const messages = {
  en,
  zh,
}

const i18n = createI18n({
  locale: 'zh',
  messages: messages,
})

export default i18n
