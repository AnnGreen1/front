import { RouteRecordRaw } from "vue-router";

import Button from "@/router/routes/Basic/Button"
const Basic: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Basic",
    component: () => import("@/views/Basic/BasicIndex.vue")
  },
  ...Button
];

export default Basic;