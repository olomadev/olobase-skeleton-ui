export default [
  {
    name: "failedLogins",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create", "list", "edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
  {
    name: "failedLoginIps",
    label: "name",
  },
  {
    name: "failedLoginUsernames",
    label: "name",
  },
];
