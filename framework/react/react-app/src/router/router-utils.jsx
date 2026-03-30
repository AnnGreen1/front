// src/router-utils.js
import { lazy } from "react";

export function defineRoutes(routes) {
  return routes.map((route) => ({
    ...route,
    element: route.element ? createLazyElement(route.element) : null,
  }));
}

function createLazyElement(dynamicImport) {
  const LazyComponent = lazy(dynamicImport);
  return <LazyComponent />;
}
