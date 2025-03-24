/**
 * i18n default configurations
 */
export default  {
  defaultLocale: "en",
  fallbackLocale: "en",
  supportedLocales: ['en', 'tr'],
  en: {
    dateFormat: "Y-m-d", // Y.m.d, Y\m\d or Y/m/d
    dateTimeFormat: "Y-m-d H:i:s",
  },
  tr: {
    dateFormat: "d-m-Y",
    dateTimeFormat: "d-m-Y H:i:s",
  }
}