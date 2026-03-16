import { RouteRecordRaw } from "vue-router";

const Tips: RouteRecordRaw[] = [
  // commonroute
  {
    path: "/Tips/demo",
    name: "Tips-demo",
    component: () => import("../../views/Tips/demo.vue")
  },
];

export default Tips;