import { LANGUAGE_DEFAULT } from '@app/config/constants'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { readLanguageCode } from './persistence'

/**
 * Bootstrap JSON files
 * @returns JSON object
 */
const loadJsonFiles = () => {
  const files = require.context('./i18n', false, /\.json$/)
  const data: Record<string, any> = {}
  files.keys().forEach((key: string) => {
    const fileName = key.replace(/(\.\/|\.json)/g, '')
    data[fileName] = { translation: files(key) }
  })
  return data
}

/**
 * Setup i18n
 */
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: loadJsonFiles(),
    lng: readLanguageCode(),
    fallbackLng: [LANGUAGE_DEFAULT],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    compatibilityJSON: 'v3',
  })

export default i18n
