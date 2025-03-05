export default {
  build: async function (t, admin) {
    const adminRole = await admin.can(["admin"]);

    return adminRole
      ? [
          {
            icon: "mdi-file-tree-outline",
            text: t("menu.categories"),
            link: "/categories",
            order: 1,
          },
        ]
      : [];
  },
};
