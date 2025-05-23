<template>
  <h2>用户列表</h2>
  <!-- 添加按钮 -->
  <div style="text-align: left">
    <el-button type="danger" @click="openUserDialog">添加用户</el-button>

  </div>
  <!-- table组件 -->
  <el-table :data="userList" stripe style="width: 100%">
    <el-table-column prop="id" label="用户编号" width="180" />
    <el-table-column prop="uname" label="用户名" width="180" />
    <el-table-column prop="phone" label="电话" />
    <el-table-column prop="edu" label="学历" />
    <el-table-column prop="age" label="年龄" />
    <el-table-column prop="title" label="部门" />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="deleteUser(scope.row)">删除
        </el-button>
        <el-button link type="primary" size="small" @click="showUserDialog(scope.row)">修改
        </el-button>
      </template>
    </el-table-column>

  </el-table>
  <hr />
  <!-- page分页组件 -->
  <el-pagination small background :page-size="3" :pager-count="10" layout="prev, pager, next" :total="total"
    class="mt-4" @current-change="handlerPageChange" />
  <!-- 添加用户信息对话框 -->
  <el-dialog v-model="dialogUserVisible" width="80%">
    <h2>修改客户信息</h2>

    <!-- 对话框中添加form -->
    <el-form :model="userForm" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="userForm.uname" style="width: 80%" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="userForm.phone" style="width: 80%" />
      </el-form-item>
      <el-form-item label="学历">
        <el-input v-model="userForm.edu" style="width: 80%" />
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="userForm.age" style="width: 80%" />
      </el-form-item>
      <el-form-item label="部门">
        <el-input v-model="userForm.title" style="width: 80%" />
      </el-form-item>

      <el-form-item label="角色">
        <el-select v-model="userForm.rids" placeholder="请选择角色...." style="width: 80%" multiple>
          <el-option v-for="opt in optRoles" :label="opt.rname" :value="opt.id" :key="opt.id" />

        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="subUserForm">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>

</template>

<script setup>


import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { userApi } from "@/api/user";
import { roleApi } from "@/api/role";
//声明user列表集合数据
const userList = ref([]);
//声明总记录数
const total = ref(0);

//定义函数发送请求加载用户列表
function queryUserList(pageNum) {
  userApi.getUserList(pageNum)
    .then((response) => {
      userList.value = response.data.userList;
      total.value = response.data.total;
    })
    .catch((error) => {
      console.log(error);
    })
}
//加载调用函数
onMounted(function () {
  queryUserList(1);
});
//定义分页按钮回调函数
function handlerPageChange(pageNum) {
  //调用分页查询函数
  queryUserList(pageNum);
}

//定义添加用户信息对话框状态
const dialogUserVisible = ref(false);
//声明表单数据
const userForm = reactive({
  uname: '',
  phone: '',
  age: '',
  edu: '',
  title: '',
  rids: []
});

//声明变量保存添加用户信息和更新用户信息的url
var url = ""
//声明角色的集合
const optRoles = ref([]);
function openUserDialog() {
  dialogUserVisible.value = true;
  //发送ajax请求加载所有角色信息
  userApi.loadAllRoles()
    .then((response) => {
      optRoles.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    })
}

function subUserForm() {
  userApi.saveUser(userForm)
    .then((response) => {
      if (response.data.code == 200) {
        //关闭对话框
        dialogUserVisible.value = false;
      }
      ElMessage(response.data.message);
    })
    .catch((error) => {
      console.log(error);
    });
}

//打开对话框实现用户信息狐仙
function showUserDialog(row) {
  dialogUserVisible.value = true;
  //将row赋值给userForm表单
  userForm.age = row.age;
  userForm.edu = row.edu;
  userForm.id = row.id;
  userForm.uname = row.uname;
  userForm.phone = row.phone;
  userForm.title = row.title;
  //加载下拉列表框所有角色信息
  userApi.loadAllRoles()
    .then((response) => {
      optRoles.value = response.data;
      //根据用户id查询用户的角色id集合
      //将查询到的角色id集合赋值给表单的rids属性
      userApi.queryUserRids(row.id)
        .then((response => {
          //将响应的角色id的集合赋值给表单的数组
          userForm.rids = response.data;
        }));
    })
    .catch((error) => {
      console.log(error);
    })
}
//删除用户信息
function deleteUser(row) {
  ElMessageBox.confirm('是否删除该用户?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userApi.deleteUser(row.id)
      .then((response) => {
        if (response.data.code == 200) {
          queryUserList(1);//刷新列表
        }
        ElMessage(response.data.message);
      }).catch((error) => {
        console.log(error);
      });
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    });
  });
}
</script>

<style scoped></style>