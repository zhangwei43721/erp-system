import request from './config'

// 客户管理相关接口
export const customerApi = {
    // 获取客户列表（分页）
    getCustomerList(pageNum) {
        return request.get(`/listCust?pageNum=${pageNum}`)
    },

    // 获取所有客户列表（不分页）
    getAllCustomers() {
        return request.get('/listAllCust')
    },

    // 保存客户
    saveCustomer(data) {
        return request.post('/saveCust', data)
    },

    // 更新客户
    updateCustomer(data) {
        return request.put('/updateCust', data)
    },

    // 删除客户
    deleteCustomer(id) {
        return request.delete(`/deleteCust/${id}`)
    },

    // 获取售后服务列表
    getAfterSaleList(data) {
        return request.post('/listAfterSale', data)
    },

    // 保存售后回复
    saveReply(data) {
        return request.post('/saveReplay', data)
    },

    // 获取回复列表
    getReplyList(id, pageNum) {
        return request.get(`/listReplay?id=${id}${pageNum ? `&pageNum=${pageNum}` : ''}`)
    }
}
