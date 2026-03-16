import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    {
      path: "/home",
      name: "home",
      component: HomeView,
    },
    {
      path: "/use-user-media/demo",
      component: () => import("../views/useUserMedia/Demo.vue"),
    },
    {
      path: "/use-web-socket",
      component: () => import("../views/use-web-socket/index.vue"),
    },
  ],
});

export default router;
