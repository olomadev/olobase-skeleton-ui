const moduleNavs = import.meta.glob("./modules/**/_nav.js", { eager: true });

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
        icon: "mdi-file-tree-outline",
        text: t("menu.categories"),
        link: "/categories/tree",
      },
    ];

    // Load all modules _nav.js files and merge menuItems
    for (const path in moduleNavs) {
      const module = moduleNavs[path];
      if (module && module.default && typeof module.default.build === "function") {
        const items = await module.default.build(t, admin);
        if (Array.isArray(items)) {
          menuItems = [...menuItems, ...items];
        }
      }
    }
    
    menuItems.push({
      icon: "mdi-api",
      text: t("menu.api"),
      link: "/swagger",
    });

    return menuItems;

  } // end func

} // end class
