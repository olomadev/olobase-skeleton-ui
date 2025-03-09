export default [
  {
    name: "users",
    standalone: true, // single resource
    permissions: [
      { name: "admin", actions: ["create", "list", "edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  }
];
