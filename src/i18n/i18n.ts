import i18n, { use } from 'i18next'
import { initReactI18next } from 'react-i18next'
import HOME_VI from 'src/locales/vi/home.json'
import HOME_EN from 'src/locales/en/home.json'
import PRODUCT_VI from 'src/locales/vi/product.json'
import PRODUCT_EN from 'src/locales/en/product.json'

export const localLang = {
  vi: 'Tiếng việt',
  en: 'English'
} as const
export const resources = {
  en: {
    home: HOME_EN,
    product: PRODUCT_EN
  },
  vi: {
    home: HOME_VI,
    product: PRODUCT_VI
  }
} as const
export const defaultNS = 'home'
use(initReactI18next).init({
  resources,
  lng: 'en',
  ns: ['home', 'product'],
  defaultNS,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // react already safes from xss
  }
})

export default i18n
