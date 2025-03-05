export default {
  build: async function (t, admin) {
    const adminRole = await admin.can(["admin"]);

    return adminRole
      ? [
          {
            icon: "mdi-account-multiple",
            text: t("modules.authentication.menu.label"),
            children: [
              {
                icon: "mdi-account-alert",
                text: t("modules.accounts.menu.failedlogins"),
                link: "/authentication/failedLogins?sortBy=attemptedAt&sortDesc=false",
              },
            ]
          }
        ]
      : [];
  },
};
