export default {
  build: async function (t, admin) {
    const adminRole = await admin.can(["admin"]);

    return adminRole
      ? [
          {
            icon: "mdi-account-multiple",
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
