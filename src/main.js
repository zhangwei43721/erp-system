import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

// 引入 ElementPlus 组件库
import ElementPlus from 'element-plus';
// 引入 ElementPlus 的默认样式文件
import 'element-plus/dist/index.css';
// 创建 Vue 应用实例，注册 ElementPlus 和路由，并挂载到 #app 元素
createApp(App).use(ElementPlus).use(router).mount('#app');
// app.vue写在script里面  main.js写在app挂在完之后
const debounce = (fn, delay) => {
    let timer
    return (...args) => {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback) {
        callback = debounce(callback, 200);
        super(callback);
    }
}
