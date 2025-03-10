// Composables
import { createRouter, createWebHistory } from "vue-router";
import i18n from "../i18n";

const routes = [
  {
    path: "",
    component: () => import('../modules/Users/layouts/Admin.vue'),
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: i18n.global.t("routes.dashboard"),
        },
      },
    ],
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
