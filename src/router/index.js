// Composables
// import i18n from "../i18n";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "",
    component: () => import("@/modules/Users/src/layouts/Admin.vue"),
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: "Dashboard",
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
