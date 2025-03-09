// modules/config.js
export default {
  Users: () => import("@/modules/Users/module"),
  // Authentication: () => import("@/modules/Authentication/module"),
  Authorization: () => import("@/modules/Authorization/module"),
  Categories: () => import("@/modules/Categories/module"),
};
