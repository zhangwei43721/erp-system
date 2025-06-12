import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import ListCustomer from '../views/Custom_Manage/ListCustomer.vue'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/',
        name: 'home',
        component: ListCustomer,
        meta: { requiresAuth: true } // 需要登录
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    // 需要登录但未登录
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            next('/login')
        } else {
            next()
        }
    } else {
        // 已登录用户访问登录/注册页面时重定向到首页
        if (token && (to.path === '/login' || to.path === '/register')) {
            next('/')
        } else {
            next()
        }
    }
})

export default router
