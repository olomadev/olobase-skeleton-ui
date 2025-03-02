export default [
  {
    name: "users",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create", "list", "edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
  {
    name: "roles",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create", "list", "edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
  {
    name: "permissions",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create", "list", "edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
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
