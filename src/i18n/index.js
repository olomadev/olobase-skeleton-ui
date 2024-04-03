import { createI18n } from "vue-i18n";
import pluralRules from "./rules/pluralization";
import numberFormats from "./rules/numbers.js";
import datetimeFormats from "./rules/datetime.js";
/**
 * app messages
 */
import _en from "./locales/en.json" assert { type: "json" };
import _tr from "./locales/tr.json" assert { type: "json" };

const i18n = createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  legacy: false,
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
export default i18n