import { RouteRecordRaw } from "vue-router";

const commonRoute: RouteRecordRaw[] = [
  // commonroute
  {
    path: "/commonroute",
    name: "commonroute",
    component: () => import("@/views/CommonRoute.vue")
  },
  {
    path: "/elementplusdemo",
    name: "elementplusdemo",
    component: () => import("@/views/ElementplusDemo.vue")
  },
];

export default commonRoute;