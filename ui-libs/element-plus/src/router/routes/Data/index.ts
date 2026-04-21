import { RouteRecordRaw } from "vue-router";

const Data: RouteRecordRaw[] = [
  {
    path: "/Data",
    name: "Data",
    component: () => import("@/views/Data/DataIndex.vue")
  }
];

export default Data;