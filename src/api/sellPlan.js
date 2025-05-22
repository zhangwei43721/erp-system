import request from './config'

// 销售计划相关接口
export const sellPlanApi = {
  // 获取销售计划列表
  getSellPlanList(pageNum) {
    return request.get(`/sellJhList?pageNum=${pageNum}`)
  },

  // 保存销售计划
  saveSellPlan(data) {
    return request.post('/saveSellJh', data)
  },

  // 更新销售计划
  updateSellPlan(data) {
    return request.put('/updateSellJh', data)
  },

  // 删除销售计划
  deleteSellPlan(id) {
    return request.delete(`/deleteSellJh/${id}`)
  }
}
