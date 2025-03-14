import i18n from "@/i18n";
import config from "@/_config";
import { nextTick } from "vue";
import useStore from "../store";
import cookies from "@/helpers/cookies";

const Trans = {
  get defaultLocale() {
    return config.i18n.defaultLocale;
  },

  get supportedLocales() {
    return config.i18n.locales;
  },

  get currentLocale() {
    return i18n.global.locale.value;
  },

  set currentLocale(newLocale) {
    i18n.global.locale.value = newLocale;
  },

  async switchLanguage(newLocale) {
    Trans.currentLocale = newLocale;
    useStore().setLocale(newLocale);
    cookies.set("lang", newLocale); // we user cookies
    document.querySelector("html").setAttribute("lang", newLocale);
  },

  isLocaleSupported(locale) {
    return Trans.supportedLocales.includes(locale);
  },

  getUserLocale() {
    const locale =
      window.navigator.language ||
      window.navigator.userLanguage ||
      Trans.defaultLocale;
    return {
      locale: locale,
      localeNoRegion: locale.split("-")[0],
    };
  },

  getPersistedLocale() {
    const urlSegments = window.location.href.split('/');
    const uriLocale = urlSegments[urlSegments.length - 1];
    if (Trans.isLocaleSupported(uriLocale)) {
      return uriLocale;
    }
    const persistedLocale = cookies.get("lang");
    if (Trans.isLocaleSupported(persistedLocale)) {
      return persistedLocale;
    } else {
      return null;
    }
  },

  guessDefaultLocale() {
    const userPersistedLocale = Trans.getPersistedLocale();
    if (userPersistedLocale) {
      return userPersistedLocale;
    }
    const userPreferredLocale = Trans.getUserLocale();
    if (Trans.isLocaleSupported(userPreferredLocale.locale)) {
      return userPreferredLocale.locale;
    }
    if (Trans.isLocaleSupported(userPreferredLocale.localeNoRegion)) {
      return userPreferredLocale.localeNoRegion;
    }
    return Trans.defaultLocale;
  },

  async routeMiddleware(to, _from, next) {
    const paramLocale = to.params.locale;
    if (!Trans.isLocaleSupported(paramLocale)) {
      return next(Trans.guessDefaultLocale());
    }
    await Trans.switchLanguage(paramLocale);
    return next();
  },

  i18nRoute(to) {
    return {
      ...to,
      params: {
        locale: Trans.currentLocale,
        ...to.params,
      },
    };
  },
};

export default Trans;
