const commonroute = [
    {
        path: "/commonroute",
        name: "commonroute",
        component: () => import("@/views/CommonRoute/CommonRoute.vue"),
    },
    /**
     * @description:编程式的导航 - Programmatic Navigation
     */
];
export default commonroute;
