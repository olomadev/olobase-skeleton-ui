// modules/config.js
export default {
  Authentication: () => import("@/modules/Authentication/module"),
  Users: () => import("@/modules/Users/module"),
  // Dashboard: () => import("@/modules/Authorization/module"),
};
