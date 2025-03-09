export default {
  name: "Authorization",
  install: async (app) => {

    // Install pinia stores
    // const { default: stores } = await import("./store.js");

    // Install routes
    // const { default: routes } = await import("./routes.js");

    // Install plugins
    // const { default: plugins } = await import("./plugins.js");

    // Install i18n messages
    const { default: i18n } = await import("./i18n.js");

    // Install resources
    const { default: resources } = await import("./resources/index.js");

    // Install global components
    // const components = {
    //   ComponentName: () => import("./components/ComponentName.vue")
    // };

    // Install navigation menu object
    const { default: navigation } = await import("./_nav.js");

    // Install resource components
    const resourceComponents = {
      "AuthorizationRolesCreate": () => import("./resources/Roles/Create.vue"),
      "AuthorizationRolesEdit": () => import("./resources/Roles/Edit.vue"),
      "AuthorizationRolesForm": () => import("./resources/Roles/Form.vue"),
      "AuthorizationRolesList": () => import("./resources/Roles/List.vue"),
      "AuthorizationPermissionsList": () => import("./resources/Permissions/List.vue"),
    };

    return {
      i18n,
      // stores,
      // routes,
      // plugins,
      navigation,
      resources,
      // components,
      resourceComponents
    };
  }
};
