import axios from 'axios'

// 根据环境变量自动切换 baseURL
const isProd = process.env.NODE_ENV === 'production'
const baseURL = isProd ? 'https://erpapi.skyforever.top' : 'http://localhost:8080'

// 创建 axios 实例
const request = axios.create({
    baseURL,
    timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 从本地存储获取 token
        const token = localStorage.getItem('token')
        if (token) {
            // 统一加上 Authorization 头
            config.headers['Authorization'] = 'Bearer ' + token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        return response
    },
    error => {
        // 可统一处理 401 等错误
        if (error.response && error.response.status === 401) {
            // 例如跳转到登录页
            // window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default request