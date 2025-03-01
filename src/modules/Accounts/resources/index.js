export default [
  {
    name: "accounts_users",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create","list","edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
  {
    name: "accounts_roles",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create","list","edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
  {
    name: "accounts_permissions",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create","list","edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
  {
    name: "accounts_failedlogins",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create","list","edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
  {
    name: "accounts_failedloginips",
    label: "name",
  },
  {
    name: "accounts_failedloginusernames",
    label: "name",
  },
];
