import request from './config'

// 订单管理相关接口
export const orderApi = {
    // 获取订单列表
    getOrderList(data) {
        return request.post('/listOrder', data)
    },

    // 更新订单
    updateOrder(data) {
        return request.put('/updateOrder', data)
    },

    // 删除订单
    deleteOrder(id) {
        return request.delete(`/deleteOrder/${id}`)
    }
}
