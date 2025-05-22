<script setup>
// --- 模块导入 ---
import { reactive } from 'vue'; // reactive: 用于创建响应式对象
import { customerApi } from '@/api/customer';
import { ElMessage } from 'element-plus';
// --- 响应式状态定义 ---
// 初始化响应式表单数据对象 (custForm)
const custForm = reactive({
  custName: '',   // 客户名称
  address: '',    // 联系地址
  phone: '',      // 联系电话
  custType: '',   // 客户职业
  grade: ''       // 客户等级
});

// --- 方法定义 ---
// 声明提交表单的函数 (subCustForm)
function subCustForm() {
  // 使用customerApi发送保存客户请求
  customerApi.saveCustomer(custForm)
    .then((response) => { // 请求成功的回调
      ElMessage.success("添加成功");
      console.log(response.data); // 打印后端返回的数据
      // 提交成功后，清空表单各项数据
      Object.assign(custForm, {
        custName: '',
        address: '',
        phone: '',
        custType: '',
        grade: ''
      });
    })
    .catch((error) => { // 请求失败的回调
      ElMessage.error("添加失败");
      console.error('提交失败:', error); // 在控制台打印错误信息
      // 实际项目中，这里通常会显示错误提示给用户
    });
}

// 定义重置表单的函数 (resetForm)
function resetForm() {
  // 将表单各项数据重置为空字符串 (或初始默认值)
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
  <!-- 页面主标题 -->
  <h2 class="page-title">添加客户信息</h2>
  <!-- Element Plus 表单组件 (el-form) -->
  <!-- :model="custForm" 将表单数据模型绑定到script部分的custForm响应式对象 -->
  <!-- label-width="120px" 设置表单项标签的统一宽度 -->
  <el-form :model="custForm" label-width="120px">
    <!-- 表单项 (el-form-item): 每个表单项包含一个标签(label)和一个输入控件 -->
    <el-form-item label="客户名称">
      <!-- Element Plus 输入框 (el-input) -->
      <!-- v-model="custForm.custName" 双向绑定输入框的值到custForm对象的custName属性 -->
      <el-input v-model="custForm.custName" style="width: 80%" />
    </el-form-item>
    <el-form-item label="联系地址">
      <el-input v-model="custForm.address" style="width: 80%" />
    </el-form-item>
    <el-form-item label="联系电话">
      <el-input v-model="custForm.phone" style="width: 80%" />
    </el-form-item>
    <el-form-item label="客户职业">
      <!-- Element Plus 选择器 (el-select) -->
      <!-- v-model="custForm.custType" 双向绑定选择器的值到custForm对象的custType属性 -->
      <!-- placeholder 设置未选择时的提示文本 -->
      <el-select v-model="custForm.custType" placeholder="请选择职业……" style="width: 80%">
        <!-- 下拉选项 (el-option): label为显示文本, value为实际选中值 -->
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
    <!-- 表单操作按钮区域 -->
    <el-form-item>
      <!-- Element Plus 按钮 (el-button) -->
      <!-- type="primary" 设置按钮主题色为主色调 -->
      <!-- @click="subCustForm" 点击时调用subCustForm方法 -->
      <el-button type="primary" @click="subCustForm">保存</el-button>
      <!-- @click="resetForm" 点击时调用resetForm方法 -->
      <el-button @click="resetForm">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped> /* scoped样式: CSS只作用于当前组件 */
/* 设置表单的最大宽度并使其居中显示 */
.page-title {
  margin: 0 0 0 0,auto;
}
</style>