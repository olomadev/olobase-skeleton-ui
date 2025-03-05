export default [
  {
    name: "list",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create","list","edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
];
