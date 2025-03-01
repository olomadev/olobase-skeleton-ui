// Composables
import { createRouter, createWebHistory } from "vue-router";
import i18n from "../i18n";

// loading modules dynamically
const modules = import.meta.glob("../modules/**/routes.js");

const routes = [
  {
    path: "",
    component: import('@/layouts/Admin.vue'),
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: import('@/views/Dashboard.vue'),
        meta: {
          title: i18n.global.t("routes.dashboard"),
        },
      },
    ],
  },
  {
    path: "/",
    redirect: "/login/:locale?",
    component: import('@/layouts/Member.bue'),
    children: [
      {
        path: "/login/:locale?",
        name: "login",
        component: import('@/views/Login.vue'),
        meta: {
          title: i18n.global.t("routes.login"),
        },
      },
      {
        path: "/forgotPassword",
        name: "forgotPassword",
        component: import('@/views/ForgotPassword.vue'),
        meta: {
          title: i18n.global.t("routes.forgotPassword"),
        },
      },
      {
        path: "/resetPassword",
        name: "resetPassword",
        component: import('@/views/ResetPassword.vue'),
        meta: {
          title: i18n.global.t("routes.resetPassword"),
        },
      },
    ],
  }
];

for (const path in modules) {
  const module = await modules[path]();
  routes.push(...module.default);
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
