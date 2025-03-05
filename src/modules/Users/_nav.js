export default {
  build: async function (t, admin) {
    const adminRole = await admin.can(["admin"]);

    return adminRole
      ? [
          {
            icon: "mdi-account-edit",
            text: t("modules.users.menu.users"),
            link: "/users?sortBy=firstname&sortDesc=false",
          }
        ]
      : [];
  },
};
