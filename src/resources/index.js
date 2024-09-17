export default [
  {
    name: "users",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create","list","edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
  {
    name: "roles",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create","list","edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
  {
    name: "permissions",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create","list","edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
  {
    name: "failedlogins",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create","list","edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
  {
    name: "failedloginips",
    label: "name",
  },
  {
    name: "failedloginusernames",
    label: "name",
  },
  {
    name: "actions",
    label: "name",
  },
  {
    name: "methods",
    label: "name",
  },
  {
    name: "locales",
    label: "name",
  },
  {
    name: "years",
    label: "name",
  },
  {
    name: "months",
    label: "name",
  },
  {
    name: "currencies",
    label: "name",
  },
  {
    name: "countries",
    label: "name",
  },
];
