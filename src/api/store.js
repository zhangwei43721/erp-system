import request from './config'

export const storeApi = {
  // 分页查询仓库列表
  queryStoreList(pageNum) {
    return request({
      url: `/storePageList`,
      method: 'get',
      params: { pageNum }
    })
  },

  // 新增仓库
  saveStore(data) {
    return request({
      url: '/saveStore',
      method: 'post',
      data
    })
  },

  // 更新仓库
  updateStore(data) {
    return request({
      url: '/updateStore',
      method: 'post',
      data
    })
  },

  // 删除仓库
  deleteStore(id) {
    return request({
      url: `/deleteStore/${id}`,
      method: 'post'
    })
  }
}
