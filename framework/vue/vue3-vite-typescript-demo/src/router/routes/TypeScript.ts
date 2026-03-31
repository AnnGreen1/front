import { RouteRecordRaw } from "vue-router";

const typescript: RouteRecordRaw[] = [
  {
    path: "/typescript/OverView",
    name: "typescript-OverView",
    component: () => import("../../views/TypeScript/OverView.vue"),
  },
  {
    path: "/typescript/CompositionAPI",
    name: "typescript-CompositionAPI",
    component: () => import("../../views/TypeScript/CompositionAPI.vue"),
  },
  {
    path: "/typescript/OptionsAPI",
    name: "typescript-OptionsAPI",
    component: () => import("../../views/TypeScript/OptionsAPI/OptionsAPI.vue"),
  },
];

export default typescript;
