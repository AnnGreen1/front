const ComponentsInDepth = [
    {
        path: "/ComponentsInDepth/Slots",
        name: "ComponentsInDepth-Slots",
        component: () => import("@/views/ComponentsInDepth/Slots/Index.vue"),
    },
    {
        path: "/ComponentsInDepth/HandlingEdgeCases",
        name: "ComponentsInDepth-HandlingEdgeCases",
        component: () => import("@/views/ComponentsInDepth/HandlingEdgeCases/RootView.vue"),
    },
];
export default ComponentsInDepth;
