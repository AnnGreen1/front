import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from "vue-router";

import commonRoute from "@/router/routes/commonroute";
import typescriptaxios from "@/router/routes/typescriptaxios";

import Basic from "@/router/routes/Basic/index";
import Data from "@/router/routes/Data/index";
import Dev from "@/router/routes/Dev/index";
import Feedback from "@/router/routes/Feedback/index";
import Form from "@/router/routes/Form/index";
import Navigation from "@/router/routes/Navigation/index";


const router = createRouter({
  // createWebHashHistory:hash模式; createWebHistory:历史模式; createMemoryHistory:ssr
  history: createWebHashHistory(),
  routes: [
    ...commonRoute,
    ...typescriptaxios,
    ...Basic,
    ...Data,
    ...Dev,
    ...Feedback,
    ...Form,
    ...Navigation
  ] as unknown as RouteRecordRaw[]
});
export default router