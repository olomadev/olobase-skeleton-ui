import module from "./index.js";

export default {
  name: module.name,
  build: async function (t, admin) {
    const adminRole = await admin.can(["admin"]);

    return adminRole
      ? [
          {
            icon: "mdi-account-key-outline",
            text: t("authorization.menu.label"),
            order: 2,
            children: [
              {
                icon: "mdi-account-group-outline",
                text: t("authorization.roles.menu.label"),
                link: "/authorization/roles",
              },
              {
                icon: "mdi-key-star",
                text: t("authorization.permissions.menu.label"),
                link: "/authorization/permissions",
              }
            ]
          }
        ]
      : [];
  },
};
