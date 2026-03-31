import { RouteRecordRaw } from "vue-router";

const typescriptaxios: RouteRecordRaw[] = [
  // typescriptaxios
  {
    path: "/typescriptaxios",
    name: "typescriptaxios",
    component: () => import("../../views/TypescriptAxios.vue")
  },
];

export default typescriptaxios;