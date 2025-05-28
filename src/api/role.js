import request from './config'

// 角色管理相关接口
export const roleApi = {
    // 获取角色列表
    getRoleList(pageNum) {
        return request.get(`/rolerList?pageNum=${pageNum}`)
    },

    // 获取角色列表
    getAllRoles() {
        return request.get('/loadAllRoles')
    },

    // 更新角色
    updateRole(data) {
        return request.post('/updateRoler', data)
    },

    // 添加角色
    saveRole(data) {
        return request.post('/saveRoler', data)
    },

    // 删除角色
    deleteRole(data) {
        return request.post('/deleteRoler', data)
    },

    // 获取菜单树
    getMenuTree() {
        return request.get('/listMenus')
    },

    // 获取角色菜单权限
    getRoleMenus(roleId) {
        return request.get(`/listRoleMenus?roleId=${roleId}`)
    },

    // 保存角色菜单权限
    grantRoleMenus(data) {
        return request.post('/grantRoleMenus', data)
    }
}
