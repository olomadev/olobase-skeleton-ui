export default {
  build: async function (t, admin) {
    const adminRole = await admin.can(["admin"]);

    return adminRole
      ? [
          {
            icon: "mdi-account-multiple",
            text: t("modules.accounts.menu.label"),
            children: [
              {
                icon: "mdi-account-edit",
                text: t("modules.accounts.menu.users"),
                link: "/accounts/users?sortBy=firstname&sortDesc=false",
              },
              {
                icon: "",
                text: t("modules.accounts.menu.roles"),
                link: "/accounts/roles",
              },
              {
                icon: "mdi-account-lock",
                text: t("modules.accounts.menu.permissions"),
                link: "/accounts/permissions",
              },
              {
                icon: "mdi-account-alert",
                text: t("modules.accounts.menu.failedlogins"),
                link: "/accounts/failedlogins?sortBy=attemptedAt&sortDesc=false",
              },
            ]
          }
        ]
      : [];
  },
};
