import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import Layout from "../layout";
// import Home from "../home";
// import About from "../about";
import TicTacToe from "../views/quick-start/tic-tac-toe/index";
import FilterableProductTable from "../views/quick-start/filterable-product-table/index";
import UpdatingArraysInState from "../views/adding-interactivity/updating-arrays-in-state/index";

// src/routes.js
import { defineRoutes } from "./router-utils.jsx";

export const routes = defineRoutes([
  {
    path: "/home",
    element: () => import("../Home"),
  },
  {
    path: "/about",
    element: () => import("../About"),
  },
  /**
   * 快速入门
   */
  {
    path: "/quick-start/tic-tac-toe",
    element: () => import("../views/quick-start/tic-tac-toe/index"),
  },
  {
    path: "/quick-start/filterable-product-table",
    element: () =>
      import("../views/quick-start/filterable-product-table/index"),
  },
  /**
   * 添加交互
   */
  {
    path: "/quick-start/tic-tac-toe",
    element: () => import("../views/quick-start/tic-tac-toe/index"),
  },
  {
    path: "/quick-start/filterable-product-table",
    element: () =>
      import("../views/quick-start/filterable-product-table/index"),
  },
  /**
   * 状态管理
   */
  // 用 State 响应输入
  {
    path: "/managing-state/reacting-to-input-with-state/index",
    element: () =>
      import("../views/managing-state/reacting-to-input-with-state/index"),
  },
  {
    path: "/quick-start/filterable-product-table",
    element: () =>
      import("../views/quick-start/filterable-product-table/index"),
  },
]);

const router = createBrowserRouter(routes);

export default router;
