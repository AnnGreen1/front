const Dev = [
  {
    path: "/Dev/lifecycle",
    name: "Dev-lifecycle",
    component: () => import("@/views/Dev/lifecycle.vue"),
  },
  {
    path: "/Dev/lifecycleWithoutSetup",
    name: "Dev-lifecycleWithoutSetup",
    component: () => import("@/views/Dev/lifecycleWithoutSetup.vue"),
  },
];
export default Dev;
