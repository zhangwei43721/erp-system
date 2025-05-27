import request from './config'

// 商品管理相关接口
export const itemApi = {
  // 获取商品列表
  getItemList(pageNum, pageSize = 10) {
    return request.get(`/listItems?pageNum=${pageNum}&pageSize=${pageSize}`)
  },

  // 保存商品
  saveItem(data) {
    return request.post('/saveItem', data)
  },

  // 更新商品
  updateItem(data) {
    return request.put('/updateItem', data)
  },

  // 删除商品
  deleteItem(id) {
    return request.delete(`/deleteItem/${id}`)
  },

  // 获取供应商列表
  getSupplyList() {
    return request.get('/supplyList')
  },

  // 获取产地列表
  getPlaceList() {
    return request.get('/placeList')
  },

  // 获取单位列表
  getUnitList() {
    return request.get('/unitList')
  },

  // 获取品牌列表
  getBrandList() {
    return request.get('/brandList')
  },

  // 获取门店列表
  getStoreList() {
    return request.get('/storeList')
  }
}

// 上传图片 URL
export const uploadImageUrl = 'http://localhost:8080/uploadImg'
