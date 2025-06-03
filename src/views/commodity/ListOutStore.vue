<template>
  <h2>出租单列表</h2>
<!-- table -->
  <el-table :data="outStoreList" style="width: 100%">
    <el-table-column  prop="storeName" label="仓库名称"/>
    <el-table-column prop="itemName" label="商品名称" />
    <el-table-column prop="outNum" label="出库数量" />
    <el-table-column prop="createBy" label="出库人"  />
    <el-table-column prop="createTime" label="采购时间"  width="200px"/>
    <el-table-column prop="isOut" label="状态" >
      <template #default="scope">
        <span v-if="scope.row.isOut==0" style="color:green">未确认</span>
        <span v-else style="color:red">已确认</span>
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="操作" width="240">
      <template #default="scope">
        <el-button link type="primary" size="small" v-if="scope.row.isOut==0"
                   @click="confirmIsIn(scope.row.insId)">确认出库</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页组件 -->
  <el-pagination
      small
      background
      :page-size="3"
      :pager-count="10"
      layout="prev, pager, next"
      :total="total"
      class="mt-4" @current-change="handlerOutStorePageChange"/>
</template>

<script setup>

import {onMounted, ref} from "vue";

import axios from 'axios';

//声明出库单集合
const outStoreList=ref([]);
const total=ref(0);
//定义汉法发生分页查询的请求
function queryItmOutServiceList(pageNum){
  axios.get("http://localhost:8080/outStoreList?pageNum="+pageNum)
  .then((response)=>{
    outStoreList.value=response.data.outStoreList;
    total.value=response.data.total;
  })
  .catch((error)=>{
    console.log(error);
  })
}
//加载调用函数/* 16 */ null,
onMounted(function(){
  queryItmOutServiceList(1);
})

//定义分页按钮的回调函数
function handlerOutStorePageChange(pageNum){
  queryItmOutServiceList(pageNum);
}
</script>

<style scoped>

</style>