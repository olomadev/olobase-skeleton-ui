import { createI18n } from "vue-i18n";
import pluralRules from "./rules/pluralization";
import numberFormats from "./rules/numbers.js";
import datetimeFormats from "./rules/datetime.js";
import config from "@/_config";
/**
 * app messages
 */
import _en from "./locales/en.json";
import _tr from "./locales/tr.json";

const i18n = createI18n({
  locale: config.i18n.defaultLocale,
  fallbackLocale: config.i18n.fallbackLocale,
  legacy: false, // If you want to use reactive i18n for Vue 3 you can do this right
  globalInjection: true,
  // forceStringify: false,
  messages: { tr: _tr, en: _en },
  runtimeOnly: false,
  pluralRules,
  numberFormats,
  datetimeFormats,
});
/**
 * import vuetify admin locales
 */
import { en, tr } from "olobase-admin/src/locales";
/**
 * build vuetify admin messages
 */
const vaMessages = { en, tr };
/**
 * load vuetify admin i18n locales
 */
Object.keys(vaMessages).forEach((locale) => {
  i18n.global.mergeLocaleMessage(locale, { va: vaMessages[locale] });
})

export default i18n;