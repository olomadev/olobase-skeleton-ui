const moduleNavs = import.meta.glob("../modules/**/_nav.js");

export default  {

  build: async function(t, admin) {

    const userRole = await admin.can(["user"]);
    const adminRole = await admin.can(["admin"]);

    let menuItems = [
      {
        icon: "mdi-view-dashboard-outline",
        text: t("menu.dashboard"),
        link: "/dashboard",
      },
      // { divider: true },
      {
        icon: "mdi-account-multiple",
        text: t("menu.roles"),
        link: "/roles",
      },
      {
        icon: "mdi-account-lock",
        text: t("menu.permissions"),
        link: "/permissions",
      },
      {
        icon: "mdi-file-tree-outline",
        text: t("menu.categories"),
        link: "/categories",
      },
      {
        icon: "mdi-account-alert",
        text: t("menu.failedlogins"),
        link: "/failedlogins?sortBy=attemptedAt&sortDesc=false",
      },
      {
        icon: "mdi-api",
        text: t("menu.api"),
        link: "/swagger",
      },
    ];

    // Load all modules _nav.js files
    for (const path in moduleNavs) {
      const module = await moduleNavs[path]();
      const items = await module.default.build(t, admin);
      menuItems = menuItems.concat(items);
    }

    return menuItems;

  } // end func

} // end class