import request from './config'

// 获取商品列表
export function getItemList(pageNum, pageSize) {
  return request({
    url: `/listItems?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get'
  })
}

// 添加商品
export function saveItem(data) {
  return request({
    url: '/saveItem',
    method: 'post',
    data
  })
}

// 更新商品
export function updateItem(data) {
  return request({
    url: '/updateItem',
    method: 'put',
    data
  })
}

// 删除商品
export function deleteItem(id) {
  return request({
    url: `/deleteItem/${id}`,
    method: 'delete'
  })
}

// 获取供应商列表
export function getSupplyList() {
  return request({
    url: '/supplyList',
    method: 'get'
  })
}

// 获取产地列表
export function getPlaceList() {
  return request({
    url: '/placeList',
    method: 'get'
  })
}

// 获取单位列表
export function getUnitList() {
  return request({
    url: '/unitList',
    method: 'get'
  })
}

// 获取品牌列表
export function getBrandList() {
  return request({
    url: '/brandList',
    method: 'get'
  })
}

// 获取门店列表
export function getStoreList() {
  return request({
    url: '/storeList',
    method: 'get'
  })
}

// 上传图片
export const uploadImageUrl = 'http://localhost:8080/uploadImg'
