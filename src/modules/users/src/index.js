import { i18n, loadI18nMessages } from "@/helpers/i18n";

export default {
  name: "Users",
  version: "1.0.0",
  install: async (app) => {

    // Install pinia stores
    // const { default: stores } = await import("./store.js");

    // Install routes
    const { default: routes } = await import("./routes.js");

    // Install plugins
    // const { default: plugins } = await import("./plugins.js");

    // Install i18n messages
    i18n.messages = await loadI18nMessages("users", import.meta.glob('./i18n/*/index.js'));

    // Install resources
    const { default: resources } = await import("./resources/index.js");

    // Install global components
    // const components = {
    //   ComponentName: () => import("./components/ComponentName.vue")
    // };

    // Install navigation menu object
    const { default: navigation } = await import("./@nav.js");

    // Install resource components
    const resourceComponents = {
      "UsersCreate": () => import("./resources/Users/Create.vue"),
      "UsersEdit": () => import("./resources/Users/Edit.vue"),
      "UsersForm": () => import("./resources/Users/Form.vue"),
      "UsersList": () => import("./resources/Users/List.vue"),
      "UsersShow": () => import("./resources/Users/Show.vue"),
    };

    return {
      i18n,
      // stores,
      routes,
      // plugins,
      navigation,
      resources,
      // components,
      resourceComponents
    };
  }
};
