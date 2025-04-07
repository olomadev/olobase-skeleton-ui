export default  {

  build: async function(t, admin) {

    const userRole = await admin.can(["user"]);
    const adminRole = await admin.can(["admin"]);

    let menuItems = [
      {
        icon: "mdi-view-dashboard-outline",
        text: "Dashboard", // t("menu.dashboard"),
        link: "/dashboard",
        order: 0,
      },
      // { divider: true },
      {
        icon: "mdi-api",
        text: "API", // t("menu.api"),
        link: "/swagger",
        order: 99,
       }
    ];

    return menuItems;

  } // end func

} // end class
