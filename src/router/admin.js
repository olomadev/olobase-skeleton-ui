import i18n from "../i18n";

export default {
  path: "",
  component:() => import("@/modules/Users/src/layouts/Admin.vue"),
  meta: {
    title: () => i18n.global.t("routes.home"),
  },
  children: [
    {
      path: "/swagger",
      name: "swagger",
      component:() => import("@/views/Swagger.vue"),
      meta: {
        title: () => i18n.global.t("menu.api"),
      },
    },
    {
      path: "*",
      component:() => import("@/views/Error404.vue"),
      meta: {
        title: () => i18n.global.t("routes.notFound"),
      },
    }
  ],
};
