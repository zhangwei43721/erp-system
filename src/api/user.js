import request from './config'

// 用户管理相关接口
export const userApi = {
    // 获取用户列表（分页）
    getUserList(pageNum, pageSize = 10) {
        return request.get(`/userList?pageNum=${pageNum}&pageSize=${pageSize}`)
    },

    //获取所有角色列表
    loadAllRoles() {
        return request.get('/loadAllRoles')
    },

    // 保存用户
    saveUser(data) {
        return request.post('/saveUser', data)
    },

    // 更新用户
    updateUser(data) {
        return request.post('/updateUser', data)
    },

    // 删除用户
    deleteUser(id) {
        return request.post('/deleteUser', { id })
    },

    // 查询用户角色
    queryUserRids(id) {
        return request.get(`/queryUserRids/${id}`)
    }
}
