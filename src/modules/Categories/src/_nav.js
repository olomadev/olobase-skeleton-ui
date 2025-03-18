import module from "./index.js";

export default {
  name: module.name,
  build: async function (t, admin) {
    const adminRole = await admin.can(["admin"]);

    return adminRole
      ? [
          {
            icon: "mdi-file-tree-outline",
            text: t("categories.menu.label"),
            link: "/categories",
            order: 3,
          },
        ]
      : [];
  },
};
