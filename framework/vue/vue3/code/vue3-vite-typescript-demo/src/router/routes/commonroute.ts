import { RouteRecordRaw } from "vue-router";

const commonRoute: RouteRecordRaw[] = [
  // commonroute
  {
    path: "/commonroute",
    name: "commonroute",
    component: () => import("../../views/CommonRoute.vue")
  },
];

export default commonRoute;