// Composables
import i18n from "@/modules/i18n/src/plugin";
import { createRouter, createWebHistory } from "vue-router";
import useAuth from "olobase-admin/src/store/auth";

const routes = [
  {
    path: "",
    redirect: "/dashboard",
    meta: {
      auth: true,
    },
    component: () => import("@/modules/users/src/layouts/Admin.vue"),
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          auth: true,
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

// Kullanıcı girişi yapılmamışsa login sayfasına yönlendir
router.beforeEach(async (to, from, next) => {

  const auth = useAuth();
  const isAuthenticated = await auth.checkAuth();

  if (to.meta?.auth && !isAuthenticated) {
    return next({ name: "users_login" });
  }

  next();
});

export default router;
