import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import index from '../views/index.vue'

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
    path: '/index', // 定义路由路径为 /index
    name: 'index', // 给该路由起一个名字，便于在组件中引用
    component: index // 指定该路由对应的组件为 index
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
