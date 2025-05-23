import request from './config'

// 用户管理相关接口
export const userApi = {
  // 获取用户列表（分页）
  getUserList(pageNum) {
    return request.get(`/userList?pageNum=${pageNum}`)
  },
  //获取用户列表（不分页）
  loadAllRoles() {
    return request.get('/loadAllRoles')
  },
  // 保存用户
  saveUser(data) {
    return request.post('/saveUser', data)
  },

  // 更新用户
  updateUser(data) {
    return request.put('/updateUser', data)
  },

  // 删除用户
  deleteUser(id) {
    return request.post('/deleteUser', { id })
  }
}
