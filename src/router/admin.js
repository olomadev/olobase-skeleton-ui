import i18n from "../i18n";

export default {
  path: "",
  component: import('@/layouts/Admin.vue'),
  meta: {
    title: i18n.global.t("routes.home"),
  },
  children: [
    {
      path: "/swagger",
      name: "swagger",
      component: import('@/views/Swagger'),
      meta: {
        title: i18n.global.t("menu.api"),
      },
    },
    {
      path: "/account",
      name: "account",
      component: import('@/views/Account'),
      meta: {
        title: i18n.global.t("routes.account"),
      },
    },
    {
      path: "/password",
      name: "password",
      component: import('@/views/Password'),
      meta: {
        title: i18n.global.t("routes.password"),
      },
    },
    {
      path: "*",
      component: import('@/views/Error404'),
      meta: {
        title: i18n.global.t("routes.notFound"),
      },
    }
  ],
};
