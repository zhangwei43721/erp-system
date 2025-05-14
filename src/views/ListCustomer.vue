<template>
  <h2>客户列表</h2>

  <el-table :data="custList" stripe style="width: 100%">
    <el-table-column prop="id" label="客户编号"  />
    <el-table-column prop="custName" label="客户姓名"  />
    <el-table-column prop="address" label="客户地址" />
    <el-table-column prop="phone" label="客户电话" />
    <el-table-column prop="custType" label="客户职业" />
    <el-table-column prop="grade" label="客户等级" />
    <el-table-column prop="hisTotal" label="消费总额" />

    <el-table-column fixed="right" label="操作" width="120">
      <template #default="{ row }">
        <el-button link type="primary" size="small" @click="deleteCustomer(row.id)">删除</el-button>
        <el-button link type="primary" size="small" @click="openCustDialog(row)">修改</el-button>
      </template>
    </el-table-column>
  </el-table>
  <hr />

  <el-pagination small background :page-size="10" :pager-count="10" layout="prev, pager, next" :total="total"
    class="mt-4" @current-change="handlerPageChange" />

  <!-- 回显客户信息的对话框 -->
  <el-dialog v-model="dialogCustVisible" width="80%" title="修改客户信息">
    <el-form :model="custForm" label-width="120px" :rules="rules" ref="custFormRef">
      <el-form-item label="客户名称" prop="custName">
        <el-input v-model="custForm.custName" style="width: 80%" />
      </el-form-item>
      <el-form-item label="联系地址" prop="address">
        <el-input v-model="custForm.address" style="width: 80%" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="custForm.phone" style="width: 80%" />
      </el-form-item>
      <el-form-item label="客户职业" prop="custType">
        <el-select v-model="custForm.custType" placeholder="请选择职业...." style="width: 80%">
          <el-option label="保密" value="保密" />
          <el-option label="金融" value="金融" />
          <el-option label="互联网" value="互联网" />
          <el-option label="IT" value="IT" />
          <el-option label="能源" value="能源" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户等级" prop="grade">
        <el-input v-model.number="custForm.grade" style="width: 80%" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="cancelForm">取消</el-button>
      <el-button type="primary" @click="subCustForm">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

// 定义客户列表集合数据
const custList = ref([]);
// 定义客户列表总记录数
const total = ref(0);
// 控制对话框显示
const dialogCustVisible = ref(false);
// 表单引用
const custFormRef = ref(null);
// 客户表单数据
const custForm = reactive({
  id: null,
  custName: '',
  address: '',
  phone: '',
  custType: '',
  grade: 1,
  hisTotal: 0
});

// 表单校验规则
const rules = {
  custName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  address: [{ required: true, message: '请输入联系地址', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^\d{11}$/, message: '请输入11位数字电话', trigger: 'blur' }
  ],
  custType: [{ required: true, message: '请选择客户职业', trigger: 'change' }],
  grade: [
    { required: true, message: '请输入客户等级', trigger: 'blur' },
    { type: 'number', message: '等级必须为数字', trigger: 'blur' }
  ]
};

// 查询客户列表
function custListQeury(pageNum) {
  axios.get(`http://localhost:8080/listCust?pageNum=${pageNum}`)
    .then((response) => {
      custList.value = response.data.custlist;
      total.value = response.data.total;
    })
    .catch((error) => {
      ElMessage.error("查询失败");
      console.log(error);
    });
}

// 删除客户
function deleteCustomer(id) {
  ElMessageBox.confirm("确定删除该客户吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      axios.delete(`http://localhost:8080/deleteCust/${id}`)
        .then(() => {
          ElMessage.success("删除成功");
          custListQeury(1); // 刷新列表
        })
        .catch((error) => {
          ElMessage.error("删除失败");
          console.log(error);
        });
    })
    .catch(() => {
      ElMessage.info("取消删除");
    });
}

// 打开修改对话框
function openCustDialog(row) {
  dialogCustVisible.value = true;
  Object.assign(custForm, {
    id: row.id,
    custName: row.custName || '',
    address: row.address || '',
    phone: row.phone || '',
    custType: row.custType || '',
    grade: row.grade || 1,
    hisTotal: row.hisTotal || 0
  });
}

// 提交修改表单
function subCustForm() {
  custFormRef.value.validate((valid) => {
    if (valid) {
      axios.put("http://localhost:8080/updateCust", custForm)
        .then(() => {
          ElMessage.success("修改成功");
          dialogCustVisible.value = false;//关闭弹窗
          custListQeury(1); // 刷新列表
        })
        .catch((error) => {
          ElMessage.error("修改失败");
          console.log(error);
        });
    } else {
      ElMessage.error("请填写完整信息");
    }
  });
}

// 取消修改
function cancelForm() {
  dialogCustVisible.value = false;
  custFormRef.value.resetFields();
}

// 页面加载时查询列表
onMounted(() => {
  custListQeury(1);
});

// 处理分页
function handlerPageChange(value) {
  custListQeury(value)
}
</script>

<style scoped></style>