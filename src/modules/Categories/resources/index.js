export default [
  {
    name: "categories_view",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create","list","edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
];
