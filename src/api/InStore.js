import request from './config'

export const InStoreApi = {
  // 查询入库单列表
  queryInList(pageNum, pageSize = 10) {
    return request({
      url: `/queryInList`,
      method: 'get',
      params: { pageNum, pageSize }
    })
  },

  // 更新入库单
  updateInList(data) {
    return request({
      url: '/updateInList',
      method: 'post',
      data
    })
  },
  // 入库请求
  updateInStore(id) {
    return request({
      url: `/updateInStore/${id}`,
      method: 'post'
    })
  },

  // 删除入库单
  deleteInList(id) {
    return request({
      url: `/deleteInList/${id}`,
      method: 'post'
    })
  }
}
