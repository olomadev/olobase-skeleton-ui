import useStore from "@/store";
import i18n from "./plugin";
import i18nConfig from "./@config";
import cookies from "@/helpers/cookies";

/**
 * Translation class
 * Object literal singleton 
 */
const Translation = {

  get defaultLocale() {
    return i18n.global.locale.value;
  },

  get supportedLocales() {
    return i18nConfig.supportedLocales;
  },

  get currentLocale() {
    return i18n.global.locale.value;
  },

  set currentLocale(newLocale) {
    i18n.global.locale.value = newLocale;
  },

  async switchLanguage(newLocale) {
    Translation.currentLocale = newLocale;
    useStore().setLocale(newLocale);
    cookies.set("lang", newLocale); // we user cookies
    document.querySelector("html").setAttribute("lang", newLocale);
  },

  isLocaleSupported(locale) {
    return Translation.supportedLocales.includes(locale);
  },

  getUserLocale() {
    const locale =
      window.navigator.language ||
      window.navigator.userLanguage ||
      Translation.defaultLocale;
    return {
      locale: locale,
      localeNoRegion: locale.split("-")[0],
    };
  },

  getPersistedLocale() {
    const urlSegments = window.location.href.split('/');
    const uriLocale = urlSegments[urlSegments.length - 1];
    if (Translation.isLocaleSupported(uriLocale)) {
      return uriLocale;
    }
    const persistedLocale = cookies.get("lang");
    if (Translation.isLocaleSupported(persistedLocale)) {
      return persistedLocale;
    } else {
      return null;
    }
  },

  guessDefaultLocale() {
    const userPersistedLocale = Translation.getPersistedLocale();
    if (userPersistedLocale) {
      return userPersistedLocale;
    }
    const userPreferredLocale = Translation.getUserLocale();
    if (Translation.isLocaleSupported(userPreferredLocale.locale)) {
      return userPreferredLocale.locale;
    }
    if (Translation.isLocaleSupported(userPreferredLocale.localeNoRegion)) {
      return userPreferredLocale.localeNoRegion;
    }
    return Translation.defaultLocale;
  },

  async routeMiddleware(to, _from, next) {
    const paramLocale = to.params.locale;
    if (!Translation.isLocaleSupported(paramLocale)) {
      return next(Translation.guessDefaultLocale());
    }
    await Translation.switchLanguage(paramLocale);
    return next();
  },

  i18nRoute(to) {
    return {
      ...to,
      params: {
        locale: Translation.currentLocale,
        ...to.params,
      },
    };
  },
}

export default Translation;