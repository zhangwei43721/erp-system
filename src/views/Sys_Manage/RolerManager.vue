<template>
  <h2>角色管理</h2>
  <div style="text-align: left">
    <el-button type="primary" @click="openRoleDialog">添加角色</el-button>
  </div>
  <el-table :data="rolerList" stripe style="width: 100%">
    <el-table-column prop="id" label="编号" width="180" />
    <el-table-column label="角色" width="260">
      <template #default="scope">
        <el-input v-if="scope.row.edit" v-model="scope.row.rname"></el-input>
        <span v-else>{{ scope.row.rname }}</span>
      </template>

    </el-table-column>
    <el-table-column label="描述">
      <template #default="scope">
        <el-input v-if="scope.row.edit" v-model="scope.row.rdesc"></el-input>
        <span v-else>{{ scope.row.rdesc }}</span>
      </template>
    </el-table-column>
    <el-table-column align="right">
      <template #header>
        <span>操作</span>
      </template>
      <template #default="scope">
        <el-button v-if="!scope.row.edit" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button v-else size="mini" type="success" @click="handleSave(scope.row)">保存</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <hr />
  <el-pagination small background :page-size="10" :pager-count="10" layout="prev, pager, next" :total="total"
    class="mt-4" @current-change="rolerPageChange" />
  <!-- 角色信息对话框 -->
  <!-- 回显客户信息的对话框 -->
  <el-dialog v-model="dialogRoleVisible" width="80%">
    <h2>角色信息</h2>

    <!-- 对话框中添加form -->
    <el-form :model="rolerForm" label-width="120px">
      <el-form-item label="角色名称">
        <el-input v-model="rolerForm.rname" style="width: 80%" />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="rolerForm.rdesc" style="width: 80%" />
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="saveRoleForm">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>

</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
//定义角色集合列表数据
const rolerList = ref([]);
const total = ref(0);
//发送请求加载角色列表
function queryRoleList(pageNum) {
  axios.get("http://localhost:8080/rolerList?pageNum=" + pageNum)
    .then((response) => {
      rolerList.value = response.data.rolerList;
      total.value = response.data.total;
    })
    .catch((error) => {
      console.log(error);
    });
}
//加载页码调用函数
onMounted(function () {
  queryRoleList(1);
})

//定义分页按钮函数
function rolerPageChange(pageNum) {
  queryRoleList(pageNum);
}
//定义函数实现表格编辑效果
function handleEdit(row) {
  row.edit = true;
}
//定义函数实现编辑后保存
function handleSave(row) {
  //row.edit=false;
  //console.log(row);
  //发送ajax请求进行数据更新
  axios.post("http://localhost:8080/updateRoler", row)
    .then((response) => {
      if (response.data.code == 200) {
        row.edit = false;
      }
      ElMessage(response.data.msg);
    })
    .catch((error) => {
      console.log(error);
    });
}

//定义函数实现删除角色
function handleDelete(row) {
  ElMessageBox.confirm('确认要删除该角色吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    axios.post("http://localhost:8080/deleteRoler", row)
      .then((response) => {
        if (response.data.code == 200) {
          queryRoleList(1);
        }
        ElMessage(response.data.msg);
      })
      .catch((error) => {
        console.log(error);
        ElMessage("删除失败，请稍后重试");
      });
  }).catch(() => {
    ElMessage("已取消删除");
  });
}

//定义对话框状态
const dialogRoleVisible = ref(false);
//定义form表单
const rolerForm = reactive({
  rname: '',
  rdesc: ''
});
//定义打开添加角色信息的对话框
function openRoleDialog() {
  dialogRoleVisible.value = true;
}
//定义函数提交角色信息保存的ajax请求
function saveRoleForm() {
  axios.post("http://localhost:8080/saveRoler", rolerForm)
    .then((response) => {
      if (response.data.code == 200) {
        dialogRoleVisible.value = false;
        rolerForm.rname = '';
        rolerForm.rdesc = '';
        queryRoleList(1);
      }
      ElMessage(response.data.msg);
    })
    .catch((error) => {
      console.log(error);
    })
}
</script>

<style scoped></style>