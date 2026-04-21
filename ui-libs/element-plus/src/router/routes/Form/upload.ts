import { RouteRecordRaw } from "vue-router";

const upload: RouteRecordRaw[] = [
  {
    path: "/form/upload/handle-start",
    component: () => import("@/views/Form/upload/handle-start.vue"),
  },
];

export default upload;
