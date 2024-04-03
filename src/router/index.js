// Composables
import { createRouter, createWebHistory } from "vue-router";

import i18n from "../i18n";
import Member from "@/layouts/Member.vue";
import Login from "@/views/Login.vue";
import ForgotPassword from "@/views/ForgotPassword";
import ResetPassword from "@/views/ResetPassword";

// import Dashboard from "@/views/Dashboard"
// import AdminLayout from "@/layouts/Admin"

const routes = [
  // {
  //   path: '/',
  //   component: () => import('@/layouts/default/Default.vue'),
  //   children: [
  //     {
  //       path: '',
  //       name: 'Home',
  //       // route level code-splitting
  //       // this generates a separate chunk (about.[hash].js) for this route
  //       // which is lazy-loaded when the route is visited.
  //       component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
  //     },
  //   ],
  // },
  {
    path: "/",
    redirect: "/login/:locale?",
    component: Member,
    children: [
      {
        path: "/login/:locale?",
        name: "login",
        component: Login,
        meta: {
          title: i18n.global.t("routes.login"),
        },
      },
      {
        path: "/forgotPassword",
        name: "forgotPassword",
        component: ForgotPassword,
        meta: {
          title: i18n.global.t("routes.forgotPassword"),
        },
      },
      {
        path: "/resetPassword",
        name: "resetPassword",
        component: ResetPassword,
        meta: {
          title: i18n.global.t("routes.resetPassword"),
        },
      },
    ],
  },
  // {
  //   path: "/admin",
  //   component: AdminLayout,
  //   meta: {
  //       title: i18n.global.t("routes.home")
  //   },
  //   children: [
  //       {
  //         path: "/dashboard",
  //         name: "dashboard",
  //         component: Dashboard,
  //         meta: {
  //           title: i18n.global.t("routes.dashboard"),
  //         },
  //       },
  //   ]
  // }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
