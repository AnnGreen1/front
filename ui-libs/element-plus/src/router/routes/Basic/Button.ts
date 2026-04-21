import { RouteRecordRaw } from "vue-router";

const Button: RouteRecordRaw[] = [
  {
    path: "/Basic/Button/index",
    name: "Basic-Button-index",
    component: () => import("@/views/Basic/Button/index.vue")
  },
  {
    path: "/Basic/Button/size",
    name: "Basic-Button-size",
    component: () => import("@/views/Basic/Button/size.vue")
  }
];

export default Button;