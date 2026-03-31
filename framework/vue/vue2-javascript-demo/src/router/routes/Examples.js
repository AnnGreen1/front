const Examples = [
    // {
    //   path: "/Examples",
    //   name: "Examples",
    //   component: () => import("@/views/Examples/CommonRoute.vue"),
    // },
    {
        path: "/Examples/Markdown",
        name: "Examples-Markdown",
        component: () => import("@/views/Examples/Markdown/Index.vue"),
    },
    {
        path: "/Examples/Commits",
        name: "Examples-Commits",
        component: () => import("@/views/Examples/Commits/Index.vue"),
    },
    {
        path: "/Examples/GridComponent",
        name: "Examples-GridComponent",
        component: () => import("@/views/Examples/GridComponent/Index.vue"),
    },
    {
        path: "/Examples/TreeView",
        name: "Examples-TreeView",
        component: () => import("@/views/Examples/TreeView/Index.vue"),
    },
];
export default Examples;
