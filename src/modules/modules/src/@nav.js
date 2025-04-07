import module from "./index.js";

export default {
  name: module.name,
  build: async function (t, admin) {
    const adminRole = await admin.can(["admin"]);

    return adminRole
      ? [
          {
            icon: "mdi-cog",
            text: t("modules.menu.label"),
            link: "/modules",
            order: 98,
          }
        ]
      : [];
  },
};
