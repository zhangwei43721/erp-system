import request from './config'

// 菜单管理相关接口
export const menuApi = {
  // 获取菜单树
  getMenuTree() {
    return request.get('/listMenus')
  },

  // 保存菜单
  saveMenu(data) {
    return request.post('/saveMenus', data)
  },

  // 更新菜单
  updateMenu(data) {
    return request.put('/updateMenus', data)
  },

  // 删除菜单
  deleteMenu(id) {
    return request.delete(`/deleteMenus?id=${id}`)
  },

  // 更新菜单顺序
  updateMenuOrder(data) {
    return request.post('/updateMenusOrder', data)
  }
}
