import module from "./index.js";

export default {
  name: module.name,
  build: async function (t, admin) {
    const adminRole = await admin.can(["admin"]);

    return adminRole
      ? [
          {
            icon: "mdi-shield-key-outline",
            text: t("authentication.menu.label"),
            order: 98,
            children: [
              {
                icon: "mdi-account-alert",
                text: t("authentication.failedLogins.menu.label"),
                link: "/authentication/failedLogins?sortBy=attemptedAt&sortDesc=false",
              },
            ]
          }
        ]
      : [];
  },
};
