import request from './config'

export const BuyListApi = {
  // 查询采购单列表
  queryBuyList(pageNum) {
    return request({
      url: `/queryBuyList`,
      method: 'get',
      params: { pageNum }
    })
  },

  // 获取采购数据自动填充信息
  getBuyAutoInfo(productId) {
    return request({
      url: `/buyAutoInfo/${productId}`,
      method: 'get'
    })
  },

  // 更新采购单
  updateBuyList(data) {
    return request({
      url: '/updateBuyList',
      method: 'post',
      data
    })
  },

  // 删除采购单
  deleteBuyList(id) {
    return request({
      url: `/deleteBuyList/${id}`,
      method: 'get'
    })
  },

  // 生成入库单
  buyInStore(data) {
    return request({
      url: '/buyInStore',
      method: 'post',
      data
    })
  },

  // 导出数据
  exportData() {
    return request({
      url: '/exportExcel',
      method: 'get',
      responseType: 'blob'
    })
  }
}