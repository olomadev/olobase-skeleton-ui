export default {
  name: "Authentication",
  version: "1.0.0",
  install: async (app) => {

    // Install pinia stores
    // const { default: stores } = await import("./store.js");

    // Install routes
    const { default: routes } = await import("./routes.js");

    // Install plugins
    // const { default: routes } = await import("./plugins.js");

    // Install i18n messages
    // const { default: i18n } = await import("./i18n.js");

    // Install resources
    const { default: resources } = await import("./resources/index.js");

    // Install global components
    // const components = {
    //   ComponentName: () => import("./components/ComponentName.vue")
    // };

    const { default: navigation } = await import("./@nav.js");

    // Install resource components
    const resourceComponents = {
      "AuthenticationFailedLoginsList": () => import("./resources/FailedLogins/List.vue"),
    };

    return {
      // i18n,
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
