// Composables
import i18n from "@/modules/i18n/src/plugin";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "",
    component: () => import("@/modules/users/src/layouts/Admin.vue"),
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
