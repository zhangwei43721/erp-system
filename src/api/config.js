import axios from 'axios'

// 根据环境变量自动切换 baseURL
const isProd = process.env.NODE_ENV === 'production'
const baseURL = isProd ? 'https://erpapi.skyforever.top' : 'http://localhost:8080'

// 创建 axios 实例
const request = axios.create({
    baseURL,
    timeout: 5000,
    withCredentials: true //添加这一行，让所有通过此实例发出的请求都携带凭证（如Cookie）
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 在这里可以添加token等通用请求头
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
        return Promise.reject(error)
    }
)

export default request
