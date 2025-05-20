import { createRouter, createWebHashHistory } from 'vue-router'
import ListCustomer from '../views/Custom_Manage/ListCustomer.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: ListCustomer
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
