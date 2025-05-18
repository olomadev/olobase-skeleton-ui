import i18n from "@/modules/i18n/src/plugin";

export default {
  path: "",
  component:() => import("@/modules/users/src/layouts/Admin.vue"),
  meta: {
    auth: true,
    title: () => "Home" // i18n.global.t("routes.home"),
  }
};
