import request from './config'

// 商品分类管理相关接口
export const categoryApi = {
    // 获取分类树
    getCategoryTree() {
        return request.get('/categoryList')
    },

    // 获取单个分类信息
    getCategoryById(id) {
        return request.get(`/loadCategory/${id}`)
    },

    // 保存分类
    saveCategory(data) {
        return request.post('/saveCategory', data)
    },

    // 更新分类
    updateCategory(data) {
        return request.post('/updateCategory', data)
    },

    // 删除分类
    deleteCategory(id) {
        return request.get(`/deleteCategory/${id}`)
    }
}