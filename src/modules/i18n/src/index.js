import { i18n, loadI18nMessages } from "@/helpers/i18n";

export default {
  name: "i18n",
  version: "1.0.0",
  install: async (app) => {

    // Install i18n messages
    i18n.messages = await loadI18nMessages("i18n", import.meta.glob('./i18n/*/index.js'));

    return {
      i18n
    };
  }
};
