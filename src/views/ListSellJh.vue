<template>
  <h2>销售计划列表</h2>

  <el-table :data="sellJHList" stripe style="width: 100%">
    <el-table-column prop="id" label="计划编号" width="180" />
    <el-table-column prop="custName" label="客户" width="180" />
    <el-table-column prop="channelId" label="销售渠道">
      <template #default="scope">
        {{ getChannelName(scope.row.channelId) }}
      </template>
    </el-table-column>
    <el-table-column prop="money" label="销售金额" />
    <el-table-column prop="nowStep" label="销售阶段" />
    <el-table-column prop="empId" label="业务员" />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="deleteSellJh(scope.row.id)">删除</el-button>
        <el-button link type="primary" size="small" @click="openSellJhDialog(scope.row)">修改</el-button>
      </template>
    </el-table-column>
  </el-table>

  <hr />

  <el-pagination
    small
    background
    :page-size="10"
    :pager-count="5"
    layout="prev, pager, next"
    :total="total"
    class="mt-4"
    @current-change="handlerPageChange"
  />

  <el-dialog v-model="dialogSellJhVisible" width="80%">
    <h2>修改销售计划</h2>
    <el-form :model="sellJhForm" label-width="120px" :rules="rules" ref="sellJhFormRef">
      <el-form-item label="客户名称">
        <el-select
          v-model="sellJhForm.custid"
          class="m-2"
          placeholder="请选择客户"
          size="large"
          style="width: 80%"
        >
          <el-option
            v-for="item in custList"
            :key="item.id"
            :label="item.custName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="销售渠道" prop="channelId">
        <el-select v-model="sellJhForm.channelId" placeholder="请选择渠道...." style="width: 80%">
          <el-option
            v-for="opt in channelList"
            :key="opt.id"
            :label="opt.label"
            :value="opt.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="销售金额" prop="money">
        <el-input v-model.number="sellJhForm.money" style="width: 80%" />
      </el-form-item>
      <el-form-item label="开发阶段" prop="nowStep">
        <el-select v-model="sellJhForm.nowStep" placeholder="请选择...." style="width: 80%">
          <el-option label="接触" value="接触" />
          <el-option label="报价" value="报价" />
          <el-option label="签约" value="签约" />
        </el-select>
      </el-form-item>
      <el-form-item label="业务员" prop="empId">
        <el-input v-model.number="sellJhForm.empId" style="width: 80%" readonly="readonly" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="subSellJhForm">保存</el-button>
        <el-button @click="cancelForm">取消</el-button>
      </el-form-item>
    </el-form>
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
const custList = ref([]);

const channelList = ref([
  { id: 0, label: "自媒体" },
  { id: 1, label: "网络推广" },
  { id: 2, label: "老客户介绍" },
  { id: 3, label: "陌拜" },
  { id: 4, label: "二次客户" },
]);

const sellJhForm = reactive({
  id: null,
  custid: null,
  channelId: null,
  money: 0,
  nowStep: "",
  empId: null,
  custName: "",
});

const rules = {
  custid: [{ required: false, message: "请选择客户", trigger: "change" }],
  channelId: [{ required: true, message: "请选择渠道", trigger: "change" }],
  money: [
    { required: true, message: "请输入金额", trigger: "blur" },
    { type: "number", message: "金额必须为数字", trigger: "blur" },
  ],
  nowStep: [{ required: true, message: "请选择开发阶段", trigger: "change" }],
  empId: [
    { required: true, message: "请输入业务员ID", trigger: "blur" },
    { type: "number", message: "业务员ID必须为数字", trigger: "blur" },
  ],
};

function getChannelName(channelId) {
  switch (channelId) {
    case 0:
      return "自媒体";
    case 1:
      return "网络推广";
    case 2:
      return "老客户介绍";
    case 3:
      return "陌拜";
    case 4:
      return "二次客户";
    default:
      return "未知";
  }
}

function sellJhListQuery(pageNum) {
  axios
    .get(`http://localhost:8080/sellJhList?pageNum=${pageNum}`)
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
      axios
        .delete(`http://localhost:8080/deleteSellJh/${id}`)
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
  axios
    .get("http://localhost:8080/listAllCust")
    .then((response) => {
      custList.value = response.data;
      Object.assign(sellJhForm, {
        id: row.id,
        custid: row.custid ?? null,
        channelId: row.channelId ?? null,
        money: row.money || 0,
        nowStep: row.nowStep || "",
        empId: row.empId || null,
        custName: row.custName || "",
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function subSellJhForm() {
  sellJhFormRef.value.validate((valid) => {
    if (valid) {
      axios
        .put("http://localhost:8080/updateSellJh", sellJhForm)
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

function handlerPageChange(pageNum) {
  sellJhListQuery(pageNum);
}
</script>

<style scoped></style>