import { RouteRecordRaw } from "vue-router";

const Dev: RouteRecordRaw[] = [
  {
    path: "/Dev",
    name: "Dev",
    component: () => import("@/views/Dev/DevIndex.vue"),
  },
  /**
   * @description:可以通过直接给非组件库内部组件的 dom 添加组件库内部的类名直接实现组件库组件的样式
   */
  {
    path: "/dev/UseElementCSS",
    name: "dev-UseElementCSS",
    component: () => import("@/views/Dev/UseElementCSS.vue"),
  },
  {
    path: "/dev/WatchForm",
    name: "dev-WatchForm",
    component: () => import("@/views/Dev/WatchForm.vue"),
  },
];

export default Dev;
