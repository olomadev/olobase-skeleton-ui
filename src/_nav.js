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
        icon: "circle",
        text: t("menu.roles"),
        link: "/roles",
      },
      {
        icon: "circle",
        text: t("menu.permissions"),
        link: "/permissions",
      },
      {
        icon: "circle",
        text: t("menu.users"),
        link: "/users?sortBy=firstname&sortDesc=false",
      },
      {
        icon: "circle",
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