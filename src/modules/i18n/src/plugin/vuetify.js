/**
 * @oloma.dev (c) 2023-2025
 *
 * - plugin/vuetify.js
 * 
 * Documentation: https://vuetifyjs.com`
 */
// Styles
import "vuetify/styles";

// Translations provided by Vuetify
import i18Config from "../_config";
import Translation from "../translation";
import { en, tr } from "vuetify/locale";
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { VTreeview } from 'vuetify/labs/VTreeview';

// Composables
import { createVuetify } from "vuetify";

// Vuetify 
export default createVuetify({
  components: {
    VTreeview,
  },
  locale: {
    locale: Translation.supportedLocales.includes(i18Config.defaultLocale) 
        ? Translation.guessDefaultLocale() 
        : i18Config.defaultLocale,
    fallback: "en",
    messages: { en, tr },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: "#f0f0f1",
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
      },
      dark: {
        dark: true,
        colors: {
          background: '#121212',  // background
          surface: '#1E1E1E',      // cards vb.
          primary: '#121212',      // main color in gray tone
          secondary: '#494b4d',    // lighter gray
          accent: '#7a7c7d',       // accent gray
          error: '#CF6679',
          info: '#607D8B',         // blue-gray
          success: '#4CAF50',
          warning: '#FB8C00'
        }
      }
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  }
});