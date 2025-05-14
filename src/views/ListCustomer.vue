<template>
  <h2>客户列表</h2>

  <el-table :data="custList" stripe style="width: 100%">
    <el-table-column prop="id" label="客户编号" width="180" />
    <el-table-column prop="custName" label="客户姓名" width="180" />
    <el-table-column prop="address" label="客户地址" />
    <el-table-column prop="phone" label="客户电话" />
    <el-table-column prop="custType" label="客户职业" />
    <el-table-column prop="grade" label="客户等级" />
    <el-table-column prop="hisTotal" label="消费总额" />

  </el-table>
  <hr />

  <el-pagination small background :page-size="3" :pager-count="10" layout="prev, pager, next" :total="total"
    class="mt-4" />
</template>

<script setup>

import { onMounted, ref } from "vue";
import axios from "axios";
//定义客户列表集合数据
const custList = ref([]);
//定义客户列表总记录数
const total = ref();
//定义函数发送ajax请求加载列表数据
function custListQeury() {
  axios.get("http://localhost:8080/listCust")
    .then((response) => {
      custList.value = response.data.custList;
      total.value = response.data.total;
    })
    .catch((error) => {
      console.log(error);
    });
}
//页面挂在加载客户列表数据
onMounted(function () {
  custListQeury();
});
</script>

<style scoped></style>