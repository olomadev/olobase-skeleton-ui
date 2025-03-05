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
                icon: "",
                text: t("modules.accounts.menu.roles"),
                link: "/accounts/roles",
              },
              {
                icon: "mdi-account-lock",
                text: t("modules.accounts.menu.permissions"),
                link: "/accounts/permissions",
              }
            ]
          }
        ]
      : [];
  },
};
