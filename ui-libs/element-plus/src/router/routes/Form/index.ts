import { RouteRecordRaw } from "vue-router";

import upload from "./upload";

const Form: RouteRecordRaw[] = [
  {
    path: "/Form",
    name: "Form",
    component: () => import("@/views/Form/Index.vue"),
  },
  ...upload,
];

export default Form;
