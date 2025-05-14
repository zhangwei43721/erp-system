<script setup>
import { reactive } from 'vue';
import axios from 'axios';

// 初始化响应式表单数据
const custForm = reactive({
  custName: '',
  address: '',
  phone: '',
  custType: '',
  grade: ''
});

// 声明提交表单的函数，发送异步请求
function subCustForm() {
  axios.post("http://localhost:8080/saveCust", custForm)
    .then((response) => {
      console.log(response.data);
      // 成功后清空表单
      Object.assign(custForm, {
        custName: '',
        address: '',
        phone: '',
        custType: '',
        grade: ''
      });
    })
    .catch((error) => {
      console.error('提交失败:', error);
    });
}

// 定义重置表单的函数
function resetForm() {
  Object.assign(custForm, {
    custName: '',
    address: '',
    phone: '',
    custType: '',
    grade: ''
  });
}
</script>

<template>
  <h2>添加客户信息</h2>
  <el-form :model="custForm" label-width="120px">
    <el-form-item label="客户名称">
      <el-input v-model="custForm.custName" style="width: 80%" />
    </el-form-item>
    <el-form-item label="联系地址">
      <el-input v-model="custForm.address" style="width: 80%" />
    </el-form-item>
    <el-form-item label="联系电话">
      <el-input v-model="custForm.phone" style="width: 80%" />
    </el-form-item>
    <el-form-item label="客户职业">
      <el-select v-model="custForm.custType" placeholder="请选择职业……" style="width: 80%">
        <el-option label="保密" value="保密" />
        <el-option label="金融" value="金融" />
        <el-option label="互联网" value="互联网" />
        <el-option label="IT" value="IT" />
        <el-option label="能源" value="能源" />
      </el-select>
    </el-form-item>
    <el-form-item label="客户等级">
      <el-input v-model="custForm.grade" style="width: 80%" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="subCustForm">保存</el-button>
      <el-button @click="resetForm">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.el-form {
  max-width: 600px;
  margin: 20px auto;
}
</style>