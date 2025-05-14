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

    <el-table-column fixed="right" label="操作" width="120">
      <template #default>
        <el-button link type="primary" size="small">删除</el-button>
        <el-button link type="primary" size="small">修改</el-button>
      </template>
    </el-table-column>

  </el-table>
  <hr />

  <el-pagination small background :page-size="3" :pager-count="10" layout="prev, pager, next" :total="total"
    class="mt-4" @current-change="handlerPageChange" />
</template>

<script setup>

import { onMounted, ref } from "vue";
import axios from "axios";
//定义客户列表集合数据
const custList = ref([]);
//定义客户列表总记录数
const total = ref();
//定义函数发送ajax请求加载列表数据
function custListQeury(pageNum) {
  axios.get("http://localhost:8080/listCust?pageNum=" + pageNum)
    .then((response) => {
      custList.value = response.data.custlist;
      total.value = response.data.total;
    })
    .catch((error) => {
      console.log(error);
    });
}
//页面挂在加载客户列表数据
onMounted(function () {
  custListQeury(1);
});
/*处理上一页，下一页按钮回调,value绑定需要提交的页码*/
function handlerPageChange(value) {
  custListQeury(value)
}
</script>

<style scoped></style>