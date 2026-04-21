import { RouteRecordRaw } from "vue-router";

const Feedback: RouteRecordRaw[] = [
  {
    path: "/Feedback/dialog/append-to",
    name: "Feedback",
    component: () => import("@/views/Feedback/dialog/append-to.vue"),
  },
];

export default Feedback;
