<template>
  <h2>销售计划列表</h2>

  <el-table :data="sellJHList" stripe style="width: 100%">
    <el-table-column prop="id" label="计划编号" />
    <el-table-column prop="custid" label="客户ID" />
    <el-table-column prop="channelId" label="渠道ID" />
    <el-table-column prop="money" label="金额" />
    <el-table-column prop="nowStep" label="当前步骤" />
    <el-table-column prop="empId" label="员工ID" />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="{ row }">
        <el-button link type="primary" size="small" @click="deleteSellJh(row.id)">删除</el-button>
        <el-button link type="primary" size="small" @click="openSellJhDialog(row)">修改</el-button>
      </template>
    </el-table-column>
  </el-table>
  <hr />

  <el-pagination size="small" background :page-size="10" :pager-count="5" layout="prev, pager, next" :total="total"
    class="mt-4" @current-change="handlerPageChange" />

  <el-dialog v-model="dialogSellJhVisible" width="80%" title="修改销售计划">
    <el-form :model="sellJhForm" label-width="120px" :rules="rules" ref="sellJhFormRef">
      <el-form-item label="客户ID" prop="custid">
        <el-input v-model.number="sellJhForm.custid" style="width: 80%" />
      </el-form-item>
      <el-form-item label="渠道ID" prop="channelId">
        <el-input v-model.number="sellJhForm.channelId" style="width: 80%" />
      </el-form-item>
      <el-form-item label="金额" prop="money">
        <el-input v-model.number="sellJhForm.money" style="width: 80%" />
      </el-form-item>
      <el-form-item label="当前步骤" prop="nowStep">
        <el-input v-model="sellJhForm.nowStep" style="width: 80%" />
      </el-form-item>
      <el-form-item label="员工ID" prop="empId">
        <el-input v-model.number="sellJhForm.empId" style="width: 80%" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelForm">取消</el-button>
      <el-button type="primary" @click="subSellJhForm">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

const sellJHList = ref([]);
const total = ref(0);
const dialogSellJhVisible = ref(false);
const sellJhFormRef = ref(null);

const sellJhForm = reactive({
  id: null,
  custid: null,
  channelId: null,
  money: 0.0,
  nowStep: '',
  empId: null
});

const rules = {
  custid: [{ required: false, message: '请输入客户ID', trigger: 'blur' }],
  channelId: [{ required: false, message: '请输入渠道ID', trigger: 'blur' }],
  money: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { type: 'number', message: '金额必须为数字', trigger: 'blur' }
  ],
  nowStep: [{ required: true, message: '请输入当前步骤', trigger: 'blur' }],
  empId: [
    { required: true, message: '请输入员工ID', trigger: 'blur' },
    { type: 'number', message: '员工ID必须为数字', trigger: 'blur' }
  ]
};

function sellJhListQuery(pageNum) {
  axios.get(`http://localhost:8080/sellJhList?pageNum=${pageNum}`)
    .then((response) => {
      sellJHList.value = response.data.sellJhList;
      total.value = response.data.total;
    })
    .catch((error) => {
      ElMessage.error("查询失败");
      console.log(error);
    });
}

function deleteSellJh(id) {
  ElMessageBox.confirm("确定删除该销售计划吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      axios.delete(`http://localhost:8080/deleteSellJh/${id}`)
        .then(() => {
          ElMessage.success("删除成功");
          sellJhListQuery(1);
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

function openSellJhDialog(row) {
  dialogSellJhVisible.value = true;
  Object.assign(sellJhForm, {
    id: row.id,
    custid: row.custid ?? null,
    channelId: row.channelId ?? null,
    money: row.money || 0.0,
    nowStep: row.nowStep || '',
    empId: row.empId || null
  });
}

function subSellJhForm() {
  sellJhFormRef.value.validate(valid => {
    if (valid) {
      axios.put("http://localhost:8080/updateSellJh", sellJhForm)
        .then(() => {
          ElMessage.success("修改成功");
          dialogSellJhVisible.value = false;
          sellJhListQuery(1);
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

function cancelForm() {
  dialogSellJhVisible.value = false;
  sellJhFormRef.value.resetFields();
}

onMounted(() => {
  sellJhListQuery(1);
});

function handlerPageChange(value) {
  sellJhListQuery(value);
}
</script>

<style scoped>
</style>