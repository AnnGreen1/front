import { RouteRecordRaw } from "vue-router";

const Input: RouteRecordRaw[] = [
  {
    path: "/Form",
    name: "Form",
    component: () => import("@/views/Form/FormIndex.vue")
  }
];

export default Input;