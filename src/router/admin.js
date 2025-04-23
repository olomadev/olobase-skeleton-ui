import i18n from "@/modules/i18n/src/plugin";

export default {
  path: "",
  component:() => import("@/modules/users/src/layouts/Admin.vue"),
  meta: {
    title: () => "Home" // i18n.global.t("routes.home"),
  },
  children: [
    {
      path: "/swagger",
      name: "swagger",
      component:() => import("@/views/Swagger.vue"),
      meta: {
        title: () => "API" // i18n.global.t("menu.api"),
      },
    }
  ],
};
