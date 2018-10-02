import Expo from 'expo'
import i18n from 'i18next'
import { reactI18nextModule } from 'react-i18next'

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    const lng = await Expo.DangerZone.Localization.getCurrentLocaleAsync()
    return callback(lng.replace('_', '-'))
  },
  init: () => {},
  cacheUserLanguage: () => {}
}

i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'kr',

    resources: {
      kr: require('./i18n-resources/kr.json'),
      en: require('./i18n-resources/en.json'),
    },

    debug: true,

    interpolation: {
      escapeValue: false,
    }
  })

export default i18n
