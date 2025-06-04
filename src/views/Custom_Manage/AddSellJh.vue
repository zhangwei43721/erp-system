<template>
  <h2>销售开发</h2>
  <el-form :model="sellForm" label-width="120px">
    <el-form-item label="客户名称">
      <!-- 客户选择下拉框: 选项动态从后端获取 -->
      <!-- v-model绑定的是选中客户的ID -->
      <el-select v-model="sellForm.custid" class="m-2" placeholder="请选择客户" size="large" style="width: 80%">
        <!-- v-for遍历custList (从后端获取的客户列表) 来动态生成选项 -->
        <!-- :key为每个选项提供唯一标识, :label显示客户名称, :value是客户的ID -->
        <el-option v-for="item in custList" :key="item.id" :label="item.custName" :value="item.id" />
      </el-select>

    </el-form-item>
    <el-form-item label="销售渠道">
      <el-select v-model="sellForm.channelId" placeholder="请选择渠道...." style="width: 80%">
        <el-option label="自媒体" value="0" />
        <el-option label="网络推广" value="1" />
        <el-option label="老客户介绍" value="2" />
        <el-option label="陌拜" value="3" />
        <el-option label="二次客户" value="4" />
      </el-select>
    </el-form-item>
    <el-form-item label="销售金额">
      <el-input v-model="sellForm.money" style="width: 80%" />
    </el-form-item>
    <el-form-item label="开发阶段">
      <el-select v-model="sellForm.nowStep" placeholder="请选择...." style="width: 80%">
        <el-option label="接触" value="接触" />
        <el-option label="报价" value="报价" />
        <el-option label="签约" value="签约" />
      </el-select>
    </el-form-item>
    <el-form-item label="业务员">
      <el-input v-model="sellForm.empId" readonly="readonly" style="width: 80%" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="subSellForm">保存</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>

</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { sellPlanApi } from '@/api/sellPlan';
import { customerApi } from '@/api/customer';
//定义销售过程表单
const sellForm = reactive({
  custid: '',      // 存储选中的客户ID
  channelId: '',
  money: 0.0,
  nowStep: '',
  empId: 100     // 业务员ID，默认为100
});
//创建数组，用于封装从后端获取的所有客户信息 (用于客户名称下拉列表)
const custList = ref([]);

//页面挂载时执行: 发送ajax请求，查询所有客户信息，用于填充客户名称的下拉列表框
onMounted(function () {
  customerApi.getAllCustomers() // API端点，获取所有客户列表
    .then((response) => {
      custList.value = response.data; // 将获取的客户数据赋值给custList
    })
    .catch((error) => {
      console.log(error);
    });
});

function subSellForm() {
  sellPlanApi.saveSellPlan(sellForm)
    .then((response) => {
      // 检查后端返回的业务状态码，确保操作成功
      if (response.data.code === 200) {
        console.log(response.data);
        ElMessage.success('添加成功');
        // 成功后清空表单, custid设为null，empId恢复默认值
        Object.assign(sellForm, {
          custid: null,
          channelId: '',
          money: 0.0,
          nowStep: '',
          empId: 100
        });
      } else {
        ElMessage.error('添加失败');
        console.error('提交失败:', error);
      }
    })
    .catch((error) => {
      ElMessage.error('添加失败');
      console.error(error);
    });
}
</script>

<style scoped></style>