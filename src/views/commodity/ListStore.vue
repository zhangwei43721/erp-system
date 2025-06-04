<template>
  <h2>仓库列表</h2>
  <div style="text-align: left">
    <el-button type="primary" @click="openStoreDialog">添加仓库</el-button>
  </div>
  <!-- table组件 -->
  <el-table :data="storeList" style="width: 100%">
    <el-table-column prop="storeName" label="仓库名称" />
    <el-table-column prop="storeNum" label="仓库编号" />
    <el-table-column prop="storeAddress" label="仓库地址" />
    <el-table-column prop="concat" label="联系人" />
    <el-table-column prop="phone" label="联系电话" />

    <el-table-column fixed="right" label="操作" width="240">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="openEditStore(scope.row)">修改</el-button>
        <el-button link type="primary" size="small" @click="deleteStore(scope.row.storeId)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <el-pagination background :page-size="3" :total="total" size="small" :pager-count="5" layout="prev, pager, next"
    class="mt-4" @current-change="handlerStorePageChange" />

  <!--  添加仓库信息对话框 -->
  <el-dialog v-model="dialogStoreVisible" width="80%">
    <h2>{{ operationType === 'add' ? '添加仓库信息' : '修改仓库信息' }}</h2>

    <!-- 对话框中添加form -->
    <el-form :model="storeForm" label-width="120px">
      <el-form-item label="仓库名称">
        <el-input v-model="storeForm.storeName" style="width: 80%" />
      </el-form-item>
      <el-form-item label="仓库编号">
        <el-input v-model="storeForm.storeNum" style="width: 80%" />
      </el-form-item>
      <el-form-item label="仓库地址">
        <el-input v-model="storeForm.storeAddress" style="width: 80%" />
      </el-form-item>

      <el-form-item label="联系人">
        <el-input v-model="storeForm.concat" style="width: 80%" />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="storeForm.phone" style="width: 80%" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="subStoreForm">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script setup>

import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { storeApi } from '@/api/store'
//声明列表集合数据
const storeList = ref([]);
//声明total总记录数
const total = ref(0);
//定义函数发生请求，加载列表
function queryStoreList(pageNum) {
  storeApi.queryStoreList(pageNum)
    .then((response) => {
      storeList.value = response.data.storeList;
      total.value = response.data.total;
    })
    .catch((err) => {
      console.log(err);
    })
}
//加载调用
onMounted(function () {
  queryStoreList(1);
});
//定义分页按钮回调函数
function handlerStorePageChange(pageNum) {
  queryStoreList(pageNum);
}
/////////////////////////添加仓库信息//////////////////////////////////
//声明对话框状态
const dialogStoreVisible = ref(false);
// 当前操作类型：add 或 edit
const operationType = ref('add');
//声明表单数据
const storeForm = reactive({
  storeId: '',  // 添加 storeId 字段
  storeName: '',
  storeNum: '',
  storeAddress: '',
  concat: '',
  phone: ''
});

// 重置表单数据
function resetForm() {
  storeForm.storeId = '';
  storeForm.storeName = '';
  storeForm.storeNum = '';
  storeForm.storeAddress = '';
  storeForm.concat = '';
  storeForm.phone = '';
}

//声明函数打开添加仓库信息对话
function openStoreDialog() {
  dialogStoreVisible.value = true;
  operationType.value = 'add';
  // 清空表单
  resetForm();
}

//定义函数提交仓库信息保存的请求
function subStoreForm() {
  const submitData = { ...storeForm };

  // 添加时删除 storeId
  if (operationType.value === 'add') {
    delete submitData.storeId;
    storeApi.saveStore(submitData)
      .then((response) => {
        if (response.data.code == 200) {
          //刷新列表
          queryStoreList(1);
          //关闭对话框
          dialogStoreVisible.value = false;
          //清空表单
          resetForm();
        }
        ElMessage(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    storeApi.updateStore(submitData)
      .then((response) => {
        if (response.data.code == 200) {
          //刷新列表
          queryStoreList(1);
          //关闭对话框
          dialogStoreVisible.value = false;
          //清空表单
          resetForm();
        }
        ElMessage(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

//实现仓库信息的回显
function openEditStore(row) {
  operationType.value = 'edit';
  dialogStoreVisible.value = true;
  //将当前行数据赋值给表单进行回显
  Object.assign(storeForm, row);
}

//定义函数发生删除的ajax请求
function deleteStore(id) {
  storeApi.deleteStore(id)
    .then((response) => {
      if (response.data.code == 200) {
        //刷新
        queryStoreList(1);
      }
      ElMessage(response.data.message);
    })
    .catch((error) => {
      console.log(error);
    })
}

</script>

<style scoped></style>