import { RouteRecordRaw } from "vue-router";

const Navigation: RouteRecordRaw[] = [
  {
    path: "/Navigation",
    name: "Navigation",
    component: () => import("@/views/Navigation/NavigationIndex.vue")
  }
];

export default Navigation;