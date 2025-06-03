<template>
  <h2>入库单列表</h2>
  <!-- 入库单列表table -->
  <el-table :data="inStoreList" style="width: 100%">
    <el-table-column prop="storeName" label="仓库名称" />
    <el-table-column prop="itemName" label="商品名称" />
    <el-table-column prop="inNum" label="入库数量" />
    <el-table-column prop="createBy" label="创建人ID" />
    <el-table-column prop="createTime" label="创建时间" width="200px" />
    <el-table-column prop="isIn" label="状态">
      <template #default="scope">
        <span v-if="scope.row.isIn == 0" style="color:green">未入库</span>
        <span v-else style="color:red">已入库</span>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="180">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="showInStoreDialog(scope.row)">修改</el-button>
        <el-button link type="primary" size="small" @click="delInStore(scope.row.insId)">删除</el-button>
        <el-button link type="primary" size="small" v-if="scope.row.isIn==1"
        @click="confirmIsIn(scope.row.insId)">确认入库</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <el-pagination small background :page-size="pageSize" :pager-count="10" layout="prev, pager, next" :total="total"
    class="mt-4" @current-change="handlerPageChange" />
  <!-- 入库信息回显对话框 -->
  <el-dialog v-model="inStoreDialog" width="60%">
    <h2>入库单信息</h2>
    <el-form :model="inStoreForm" label-width="120px">
      <el-form-item label="商品名称">
        {{ inStoreForm.itemName }}
      </el-form-item>
      <el-form-item label="仓库">
        {{ inStoreForm.storeName }}
      </el-form-item>
      <el-form-item label="入库数量">
        <el-input v-model="inStoreForm.inNum" style="width: 80%" />
      </el-form-item>
      <el-form-item label="创建人ID">
        <el-input v-model="inStoreForm.createBy" style="width: 80%" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="inStoreForm.createTime" style="width: 80%" disabled />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="inStoreForm.isIn" style="width: 80%">
          <el-option label="未入库" value="0" />
          <el-option label="已入库" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateInStore">保存</el-button>
        <el-button @click="inStoreDialog = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { InStoreApi } from '@/api/InStore';

// 入库单列表数据
const inStoreList = ref([]);
const total = ref(0);
const pageSize = 10;

// 查询入库单列表
function queryInStoreList(pageNum) {
  InStoreApi.queryInList(pageNum, pageSize)
    .then((response) => {
      // 正确映射后端 inStores 字段
      inStoreList.value = response.data.inStores || [];
      total.value = response.data.total;
    })
    .catch(error => {
      console.error('获取入库单列表失败:', error);
      ElMessage.error('获取入库单列表失败');
    });
}

onMounted(function () {
  queryInStoreList(1);
});

function handlerPageChange(pageNum) {
  queryInStoreList(pageNum);
}

// 入库单表单
const inStoreForm = reactive({
  insId: '',
  storeId: '',
  productId: '',
  inNum: '',
  createBy: '',
  createTime: '',
  isIn: '',
  storeName: '',
  itemName: ''
});
const inStoreDialog = ref(false);

// 打开入库单编辑对话框
function showInStoreDialog(row) {
  Object.assign(inStoreForm, row);
  inStoreDialog.value = true;
}

// 更新入库单
function updateInStore() {
  InStoreApi.updateInList(inStoreForm)
    .then((response) => {
      if (response.data.code == 200) {
        inStoreDialog.value = false;
        queryInStoreList(1);
      }
      ElMessage(response.data.message);
    })
    .catch((error) => {
      console.error('更新入库单失败:', error);
      ElMessage.error('更新入库单失败');
    });
}

// 删除入库单
function delInStore(id) {
  InStoreApi.deleteInList(id)
    .then((response) => {
      if (response.data.code == 200) {
        queryInStoreList(1);
      }
      ElMessage(response.data.message);
    })
    .catch((error) => {
      console.error('删除入库单失败:', error);
      ElMessage.error('删除入库单失败');
    });
}
//定义函数发生入库单确认请求
  function confirmIsIn(id){
    InStoreApi.updateInStore(id)
        .then((response)=>{
          if(response.data.code==200){
            queryInStoreList(1);//刷新
          }
        })
        .catch((error)=>{
          console.log(error);
        })
  }
</script>

<style scoped></style>