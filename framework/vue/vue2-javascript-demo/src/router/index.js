import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

import commonroute from './routes/commonroute'
import ComponentsInDepth from './routes/ComponentsInDepth'
import ReusabilityAndComposition from './routes/ReusabilityAndComposition'
import API from './routes/API'
import Examples from './routes/Examples'
import CookBook from './routes/CookBook'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/JavascriptAxios',
    name: 'JavascriptAxios',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/JavascriptAxios.vue')
  },
  ...commonroute,
  ...ComponentsInDepth,
  ...ReusabilityAndComposition,
  ...API,
  ...Examples,
  ...CookBook
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
