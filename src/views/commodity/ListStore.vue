<template>
  <h2>仓库列表</h2>
  <!-- table组件 -->
  <el-table :data="storeList" style="width: 100%">
    <el-table-column prop="storeName" label="仓库名称" />
    <el-table-column prop="storeNum" label="仓库编号" />
    <el-table-column prop="storeAddress" label="仓库地址" />
    <el-table-column prop="concat" label="联系人" />
    <el-table-column prop="phone" label="联系电话" />

    <el-table-column fixed="right" label="操作" width="240">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="openEditStore(scope.row)">修改</el-button>
        <el-button link type="primary" size="small" @click="deleteStore(scope.row.outsId)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <el-pagination small background :page-size="3" :pager-count="10" layout="prev, pager, next" :total="total"
    class="mt-4" @current-change="handlerStorePageChange" />
</template>

<script setup>

import { onMounted, ref } from "vue";
import axios from "axios";
//声明列表集合数据
const storeList = ref([]);
//声明total总记录数
const total = ref(0);
//定义函数发生请求，加载列表
function queryStoreList(pageNum) {
  axios.get("http://localhost:8080/storePageList?pageNum=" + pageNum)
    .then((response) => {
      storeList.value = response.data.storeList;
      total.value = response.data.total;
    })
    .catch((err) => {
      console.log(err);
    })
}
//加载调用
onMounted(function () {
  queryStoreList(1);
});
//定义分页按钮回调函数
function handlerStorePageChange(pageNum) {
  queryStoreList(pageNum);
}
</script>

<style scoped></style>