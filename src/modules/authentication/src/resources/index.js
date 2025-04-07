export default [
  {
    name: "failedLogins",
    permissions: [
      { name: "admin", actions: ["create", "list", "edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
  {
    name: "failedLoginIps",
  },
  {
    name: "failedLoginUsernames",
  },
];
