export default {
  name: "Authentication",
  install: async (app) => {

    // Install pinia stores
    // const { default: stores } = await import("./store.js");

    // Install routes
    const { default: routes } = await import("./routes.js");

    // Install resources
    const { default: resources } = await import("./resources/index.js");

    // Install global components
    // const components = {
    //   ComponentName: () => import("./components/ComponentName.vue")
    // };

    const { default: navigation } = await import("./_nav.js");

    // Install resource components
    const resourceComponents = {
      "AuthenticationFailedLoginsList": () => import("./resources/FailedLogins/List.vue"),
    };

    return {
      // stores,
      routes,
      navigation,
      resources,
      // components,
      resourceComponents
    };
  }
};
