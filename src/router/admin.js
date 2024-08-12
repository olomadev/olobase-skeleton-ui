import AdminLayout from "@/layouts/Admin";
import Dashboard from "@/views/Dashboard";
import Account from "@/views/Account";
import Password from "@/views/Password";
import Error404 from "@/views/Error404";
import Swagger from "@/views/Swagger";
import i18n from "../i18n";

export default {
  path: "",
  component: AdminLayout,
  meta: {
    title: i18n.global.t("routes.home"),
  },
  children: [
    // {
    //   path: "/dashboard",
    //   name: "dashboard",
    //   component: Dashboard,
    //   meta: {
    //     title: i18n.global.t("routes.dashboard"),
    //   },
    // },
    {
      path: "/swagger",
      name: "swagger",
      component: Swagger,
      meta: {
        title: i18n.global.t("menu.api"),
      },
    },
    {
      path: "/account",
      name: "account",
      component: Account,
      meta: {
        title: i18n.global.t("routes.account"),
      },
    },
    {
      path: "/password",
      name: "password",
      component: Password,
      meta: {
        title: i18n.global.t("routes.password"),
      },
    },
    {
      path: "*",
      component: Error404,
      meta: {
        title: i18n.global.t("routes.notFound"),
      },
    }
  ],
};
