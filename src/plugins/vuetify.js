/**
 * @oloma.dev (c) 2023-2024
 *
 * - plugins/vuetify.js
 * 
 * Framework documentation: https://vuetifyjs.com`
 */
// Styles
import "vuetify/styles";

// Translations provided by Vuetify
import { en, tr } from "vuetify/locale";
import Trans from "@/i18n/translation";
const defaultLang = Trans.guessDefaultLocale();

// Composables
import { createVuetify } from "vuetify";

const defaultTheme = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    primary: localStorage.getItem("themeColor")
      ? localStorage.getItem("themeColor")
      : "#0a7248",
    secondary: "#eeeeee",
    error: "#ed0505",
    info: "#00CAE3",
    // success: '#4CAF50',
    // warning: '#FB8C00',
  },
};

// Vuetify 
export default createVuetify({
  locale: {
    locale: Trans.supportedLocales.includes(defaultLang) ? defaultLang : import.meta.env.VITE_DEFAULT_LOCALE,
    fallback: "en",
    messages: { tr, en },
  },
  theme: {
    defaultTheme: "defaultTheme",
    themes: {
      defaultTheme,
    },
  },
});
