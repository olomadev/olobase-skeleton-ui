// plugins/i18n.js
import { createI18n } from "vue-i18n";
import pluralRules from "../rules/pluralization";
import numberFormats from "../rules/numbers.js";
import datetimeFormats from "../rules/datetime.js";
import i18Config from "../@config";

const i18n = createI18n({
  locale: i18Config.defaultLocale,
  fallbackLocale: i18Config.fallbackLocale,
  legacy: false,
  globalInjection: true,
  // forceStringify: false,
  messages: { },
  runtimeOnly: false,
  pluralRules,
  numberFormats,
  datetimeFormats,
});
// /**
//  * import vuetify admin locales
//  */
// import { en, tr } from "olobase-admin/src/locales";
// /**
//  * build vuetify admin messages
//  */
// const vaMessages = { en, tr };
// /**
//  * load vuetify admin i18n locales
//  */
// Object.keys(vaMessages).forEach((locale) => {
//   i18n.global.mergeLocaleMessage(locale, { va: vaMessages[locale] });
// })

export default i18n;