import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import commonroute from './routes/commonroute'
import Essentials from './routes/Essentials'
import ComponentsInDepth from './routes/ComponentsInDepth'
import Reusability from './routes/Reusability'
import BuiltInComponents from './routes/BuiltInComponents'
import Dev from './routes/Dev'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/JavascriptAxios',
      name: 'JavascriptAxios',
      component: () => import('../views/JavascriptAxios.vue')
    },
    ...commonroute,
    ...Essentials,
    ...ComponentsInDepth,
    ...Reusability,
    ...BuiltInComponents,
    ...Dev
  ]
})

export default router
