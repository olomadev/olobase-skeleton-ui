export default {
  build: function (t) {
    return [
      {
        path: "",
        component: () => import('./layouts/Admin.vue'),  // authenticated members
        meta: {
          title: () => t("users.views.home.title"),
        },
        children: [
          {
            path: "/users/myAccount",
            name: "users_myAccount", // requires for translation support
            component: () => import('./views/MyAccount.vue'), // add .vue extension for lazy loading.
            meta: {
              title: () => t("users.views.myAccount.title"), // requires for document title and breadcrumbs
            },
          },
          {
            path: "/users/changePassword",
            name: "users_changePassword",
            component: () => import('./views/ChangePassword.vue'),
            meta: {
              title: () => t("users.views.myPassword.title"),
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
              title: () => t("users.views.login.title"),
            },
          },
          {
            path: "/users/forgotPassword",
            name: "users_forgotPassword",
            component: () => import('./views/ForgotPassword.vue'),
            meta: {
              title: () => t("users.views.forgotPassword.title"),
            },
          },
          {
            path: "/users/resetPassword",
            name: "users_resetPassword",
            component: () => import('./views/ResetPassword.vue'),
            meta: {
              title: () => t("users.views.resetPassword.title"),
            },
          },
        ],
      }
    ]
  },
};
