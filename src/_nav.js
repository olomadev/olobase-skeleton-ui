export default  {

  build: async function(t, admin) {

    const userRole = await admin.can(["user"]);
    const adminRole = await admin.can(["admin"]);

    return [
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
        icon: "mdi-account-edit",
        text: t("menu.users"),
        link: "/users?sortBy=firstname&sortDesc=false",
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
    ]; // end array

  } // end func

} // end class