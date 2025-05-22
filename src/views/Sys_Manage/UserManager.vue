<template>
  <h2>用户列表</h2>
<!-- table组件 -->
  <el-table :data="userList" stripe style="width: 100%">
    <el-table-column prop="id" label="用户编号" width="180"/>
    <el-table-column prop="uname" label="用户名" width="180"/>
    <el-table-column prop="phone" label="电话"/>
    <el-table-column prop="edu" label="学历"/>
    <el-table-column prop="age" label="年龄"/>
    <el-table-column prop="title" label="部门"/>
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button link type="primary" size="small">删除
        </el-button>
        <el-button link type="primary" size="small">修改
        </el-button>
      </template>
    </el-table-column>

  </el-table>
  <hr/>
  <el-pagination
      small
      background
      :page-size="3"
      :pager-count="10"
      layout="prev, pager, next"
      :total="total"
      class="mt-4" @current-change="handlerPageChange"/>
<!-- page分页组件 -->
</template>

<script setup>


import {onMounted, ref} from "vue";
import {userApi} from "@/api/user";
  //声明user列表集合数据
  const userList=ref([]);
  //声明总记录数
  const total=ref(0);

  //定义函数发送请求加载用户列表
  function queryUserList(pageNum){
    userApi.getUserList(pageNum)
    .then((response)=>{
      userList.value=response.data.userList;
      total.value=response.data.total;
    })
    .catch((error)=>{
      console.log(error);
    })
  }
  //加载调用函数
  onMounted(function(){
    queryUserList(1);
  });
  //定义分页按钮回调函数
  function handlerPageChange(pageNum){
    //调用分页查询函数
    queryUserList(pageNum);
  }
</script>

<style scoped>

</style>