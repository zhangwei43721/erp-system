import request from './config'

// 商品管理相关接口
export const itemApi = {
    getItemList(itemCond) {
        return request.post('/itemList', itemCond)
    },

    // 获取商品编号
    getItemCode() {
        return request.get('/getCode')
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

    // 商品下架
    downItem(id) {
        return request.get(`/downItem/${id}`)
    },

    // 商品上架
    upItem(id) {
        return request.get(`/upItem/${id}`)
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
    },

    // 获取采购自动填充信息
    getBuyAutoInfo(id) {
        return request.get(`/buyAutoInfo/${id}`)
    },

    // 保存采购信息
    saveBuy(data) {
        return request.post('/saveBuy', data)
    },
    doItemOutStore(data) {
        return request.post('/doItemOutStore', data)
    },
}

// 上传图片 URL
export const uploadImageUrl = process.env.NODE_ENV === 'production'
  ? 'https://erpapi.skyforever.top/uploadImg'
  : 'http://localhost:8080/uploadImg'
