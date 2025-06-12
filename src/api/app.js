import request from './config'

// 应用级别的 API 服务
export const appApi = {
    // 获取组件索引
    getComponentIndex(id) {
        return request.get('/compIndex', {
            params: { id }
        })
    },

    // 获取个人菜单列表
    getMenus() {
        return request.get('/queryUserMenus')
    }
}
