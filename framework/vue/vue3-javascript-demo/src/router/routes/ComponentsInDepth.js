const ComponentsInDepth = [
  {
    path: "/ComponentsInDepth",
    name: "ComponentsInDepth",
    component: () => import("@/views/ComponentsInDepth/ComponentsInDepth.vue"),
  },
  /**
   * Registration
   */
  {
    path: "/ComponentsInDepth/Registration/Registration",
    name: "ComponentsInDepth-Registration-Registration",
    component: () => import("@/views/ComponentsInDepth/Registration/Registration.vue"),
  },
  {
    path: "/ComponentsInDepth/Registration/RegistrationWithoutSetup",
    name: "ComponentsInDepth-Registration-RegistrationWithoutSetup",
    component: () => import("@/views/ComponentsInDepth/Registration/RegistrationWithoutSetup.vue"),
  },
  /**
   * Props
   */
  {
    path: "/ComponentsInDepth/Props/Props",
    name: "ComponentsInDepth-Props-Props",
    component: () => import("@/views/ComponentsInDepth/Props/Props.vue"),
  },
  /**
   * Events
   */
  {
    path: "/ComponentsInDepth/Events/Parent",
    name: "ComponentsInDepth-Events-Parent",
    component: () => import("@/views/ComponentsInDepth/Events/Parent.vue"),
  },
  /**
   * Fallthrough Attributes
   */
  {
    path: "/ComponentsInDepth/FallthroughAttributes/ClassStyleMerge",
    name: "ComponentsInDepth-FallthroughAttributes-ClassStyleMerge",
    component: () => import("@/views/ComponentsInDepth/FallthroughAttributes/ClassStyleMerge.vue"),
  },
  {
    path: "/ComponentsInDepth/FallthroughAttributes/ListenerInheritance",
    name: "ComponentsInDepth-FallthroughAttributes-ListenerInheritance",
    component: () => import("@/views/ComponentsInDepth/FallthroughAttributes/ListenerInheritance.vue"),
  },
  {
    path: "/ComponentsInDepth/FallthroughAttributes/NestedComponentInheritance",
    name: "ComponentsInDepth-FallthroughAttributes-NestedComponentInheritance",
    component: () => import("@/views/ComponentsInDepth/FallthroughAttributes/NestedComponentInheritance.vue"),
  },
  {
    path: "/ComponentsInDepth/FallthroughAttributes/DisablingAttributeInheritance",
    name: "ComponentsInDepth-FallthroughAttributes-DisablingAttributeInheritance",
    component: () => import("@/views/ComponentsInDepth/FallthroughAttributes/DisablingAttributeInheritance.vue"),
  },
  /**
   * Slots
   */
  {
    path: "/ComponentsInDepth/Slots/Slots",
    name: "ComponentsInDepth-Slots-Slots",
    component: () => import("@/views/ComponentsInDepth/Slots/Slots.vue"),
  },
  /**
   * Provide Inject
   */
  {
    path: "/ComponentsInDepth/ProvideInject/RootView",
    name: "ComponentsInDepth-ProvideInject-RootView",
    component: () => import("@/views/ComponentsInDepth/ProvideInject/RootView.vue"),
  },
  /**
   * Async Components
   */
  {
    path: "/ComponentsInDepth/AsyncComponents/RouteView",
    name: "ComponentsInDepth-AsyncComponents-RouteView",
    component: () => import("@/views/ComponentsInDepth/AsyncComponents/RouteView.vue"),
  },
];
export default ComponentsInDepth;
