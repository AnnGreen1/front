const BuiltInComponents = [
    {
        path: "/BuiltInComponents/KeepAlive",
        name: "BuiltInComponents-KeepAlive",
        component: () => import("@/views/BuiltInComponents/KeepAlive/Index.vue"),
        children: [
            {
                path: "CompA",
                name: "BuiltInComponents-KeepAlive-CompA",
                component: () => import("@/views/BuiltInComponents/KeepAlive/CompA.vue"),
            },
            {
                path: "CompB",
                name: "BuiltInComponents-KeepAlive-CompB",
                component: () => import("@/views/BuiltInComponents/KeepAlive/CompB.vue"),
            },
        ],
    },
];
export default BuiltInComponents;
