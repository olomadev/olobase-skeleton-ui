import i18n from "@/i18n";

export default [
  {
    path: "",
    component: () => import('./layouts/Admin.vue'),  // authenticated members
    meta: {
      title: () => i18n.global.t("routes.home"),
    },
    children: [
      {
        path: "/users/myAccount",
        name: "users_myAccount", // requires for translation support
        component: () => import('./views/MyAccount.vue'), // add .vue extension for lazy loading.
        meta: {
          title: () => i18n.global.t("users.myAccount.title"), // requires for document title and breadcrumbs
        },
      },
      {
        path: "/users/changePassword",
        name: "users_changePassword",
        component: () => import('./views/ChangePassword.vue'),
        meta: {
          title: () => i18n.global.t("users.myPassword.title"),
        },
      }
    ]
  },
  {
    path: "/",
    redirect: "/users/login/:locale?",
    component: () => import('./layouts/Member.vue'),  // guest members
    children: [
      {
        path: "/users/login/:locale?",
        name: "users_login",
        component: () => import('./views/Login.vue'),
        meta: {
          title: () => i18n.global.t("routes.login"),
        },
      },
      {
        path: "/users/forgotPassword",
        name: "users_forgotPassword",
        component: () => import('./views/ForgotPassword.vue'),
        meta: {
          title: () => i18n.global.t("routes.forgotPassword"),
        },
      },
      {
        path: "/users/resetPassword",
        name: "users_resetPassword",
        component: () => import('./views/ResetPassword.vue'),
        meta: {
          title: () => i18n.global.t("routes.resetPassword"),
        },
      },
    ],
  }
];
