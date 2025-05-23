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
  <el-pagination 
    small 
    background 
    :page-size="pageSize" 
    :pager-count="10" 
    layout="prev, pager, next" 
    :total="total"
    class="mt-4" 
    @current-change="handlerPageChange" 
  />
  <!-- 添加用户信息对话框 -->
  <el-dialog 
    v-model="dialogUserVisible" 
    width="80%" 
    :title="userForm.id ? '修改用户信息' : '添加用户信息'"
    @close="resetUserForm"
  >
    <!-- 对话框中添加form -->
    <el-form 
      ref="userFormRef"
      :model="userForm" 
      :rules="rules" 
      label-width="120px"
    >
      <el-form-item label="用户名" prop="uname">
        <el-input v-model="userForm.uname" style="width: 80%" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="userForm.phone" style="width: 80%" />
      </el-form-item>
      <el-form-item label="学历" prop="edu">
        <el-input v-model="userForm.edu" style="width: 80%" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="userForm.age" style="width: 80%" />
      </el-form-item>
      <el-form-item label="部门" prop="title">
        <el-input v-model="userForm.title" style="width: 80%" />
      </el-form-item>

      <el-form-item label="角色" prop="rids">
        <el-select v-model="userForm.rids" placeholder="请选择角色...." style="width: 80%" multiple>
          <el-option v-for="opt in optRoles" :label="opt.rname" :value="opt.id" :key="opt.id" />

        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="subUserForm">保存</el-button>
        <el-button @click="cancelUserForm">取消</el-button>
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

//声明分页大小
const pageSize = ref(10);

//定义函数发送请求加载用户列表
function queryUserList(pageNum) {
  userApi.getUserList(pageNum, pageSize.value)
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
// 表单引用
const userFormRef = ref(null);
//声明表单数据
const userForm = reactive({
  uname: '',
  phone: '',
  age: '',
  edu: '',
  title: '',
  rids: []
});

// 表单验证规则
const rules = {
  uname: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度应在 2 到 20 个字符之间', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', message: '年龄必须为数字', trigger: 'blur' },
    { type: 'number', min: 18, max: 70, message: '年龄必须在18到70之间', trigger: 'blur' }
  ],
  edu: [
    { required: true, message: '请输入学历', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入部门', trigger: 'blur' }
  ],
  rids: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 定义重置表单的函数
const resetUserForm = () => {
  // 重置表单的验证状态
  if (userFormRef.value) {
    userFormRef.value.resetFields();
  }
  // 重置表单数据
  Object.assign(userForm, {
    id: undefined,
    uname: '',
    phone: '',
    age: '',
    edu: '',
    title: '',
    rids: []
  });
}

//声明角色的集合
const optRoles = ref([])

const openUserDialog = () => {
  // 先重置表单数据
  resetUserForm();
  // 再打开对话框
  dialogUserVisible.value = true;
  //发送ajax请求加载所有角色信息
  userApi.loadAllRoles()
    .then((response) => {
      optRoles.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error('加载角色信息失败');
    });
}

const subUserForm = () => {
  if (!userFormRef.value) {
    ElMessage.error('表单未正确加载，请重试');
    return;
  }
  
  userFormRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    const operation = userForm.id ? userApi.updateUser(userForm) : userApi.saveUser(userForm);
    operation.then((response) => {
      if (response.data.code == 200) {
        //关闭对话框
        dialogUserVisible.value = false;
        // 重置表单数据
        resetUserForm();
        // 刷新用户列表
        queryUserList(1);
      }
      ElMessage(response.data.message);
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error('操作失败，请重试');
    });
  });
}

// 取消按钮处理函数
const cancelUserForm = () => {
  dialogUserVisible.value = false;
  resetUserForm();
}

//打开对话框实现用户信息修改
const showUserDialog = (row) => {
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
    });
}

//删除用户信息
const deleteUser = (row) => {
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