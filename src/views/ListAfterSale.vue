<template>
  <h2>客户投诉列表</h2>
  <el-form :inline="true" :model="condForm">
    <el-form-item label="投诉单号">
      <el-input v-model="condForm.id" />
    </el-form-item>
    <el-form-item label="问题描述">
      <el-input v-model="condForm.question" />
    </el-form-item>

    <br/>
    <el-form-item label="紧急程度" style="width: 22%">
      <el-select
          v-model="condForm.grade"
          placeholder="请选择....">
        <el-option label="普通" value="普通" />
        <el-option label="加急" value="加急" />


      </el-select>
    </el-form-item>
    <el-form-item label="处理状态" style="width: 22%">
      <el-select
          v-model="condForm.state"
          placeholder="请选择....">
        <el-option label="未处理" value="未处理" />
        <el-option label="已处理" value="已处理" />
        <el-option label="未回访" value="未回访" />
        <el-option label="已回访" value="已回访" />

      </el-select>
    </el-form-item>
    <br/>
    <el-form-item>
      <el-button type="primary" @click="subQueryAfter">查询</el-button>

    </el-form-item>
  </el-form>

  <hr/>

  <el-table :data="afterSaleList" stripe style="width: 100%">
    <el-table-column prop="id" label="投诉编号"/>
    <el-table-column prop="custName" label="客户姓名"/>
    <el-table-column prop="question" label="问题类型"/>
    <el-table-column prop="state" label="处理状态"/>
    <el-table-column prop="grade" label="紧急程度"/>
    <el-table-column prop="level" label="投诉满意度"/>

    <el-table-column fixed="right" label="操作" width="200">
      <template #default="scope">
        <el-button link type="primary" size="small">处理
        </el-button>
        <el-button link type="primary" size="small">查看处理详情
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
      class="mt-4" @current-change="handlerSalePageChange"/>


</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
  //数据库总记录数
  const total=ref(0)
  //声明投诉列表集合
  const afterSaleList=ref([]);
  //定义封装查询条件的表单对象
  const condForm=reactive({
    id:'',
    question:'',
    grade:'',
    level:''
  });
  //定义函数发生ajax请求
  function queryAfterSaleList(pageNum){
    condForm.pageNum=pageNum;
    axios.post("http://localhost:8080/listAfterSale", condForm)
    .then((response)=>{
      afterSaleList.value=response.data.afterSalesList;
      total.value=response.data.total;
    })
    .catch((error)=>{
      console.log(error);

    });
  }
  //加载视图进行调用
  onMounted(function(){
    queryAfterSaleList(1);
  });
  //定义函数提交分页请求
  function handlerSalePageChange(pageNum){
    queryAfterSaleList(pageNum);
  }
  //定义函数提交查询条件
  function subQueryAfter(){
    queryAfterSaleList(1);
  }

</script>

<style scoped>

</style>