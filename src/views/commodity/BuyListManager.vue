<template>
  <h2>采购单列表</h2>
  <!--导出数据按钮-->
  <el-button type="primary" class="mb-4" @click="exportData">导出数据为表格</el-button>
  <!-- 采购单列表table -->
  <el-table :data="buyList" style="width: 100%">
    <el-table-column prop="storeName" label="仓库名称" />
    <el-table-column prop="itemName" label="商品名称" />
    <el-table-column prop="buyNum" label="预计采购数量" />
    <el-table-column prop="factBuyNum" label="实际采购数量" />
    <el-table-column prop="buyUser" label="采购人" />
    <el-table-column prop="buyTime" label="采购时间" width="200px" />
    <el-table-column prop="phone" label="采购人电话" />
    <el-table-column prop="isIn" label="状态">
      <template #default="scope">
        <span v-if="scope.row.isIn == 0" style="color:green">未入库</span>
        <span v-else style="color:red">已入库</span>
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="操作" width="240">
      <template #default="scope">
        <el-button link type="primary" v-if="scope.row.factBuyNum == 0" size="small"
          @click="showBuyListDialog(scope.row)">修改</el-button>
        <el-button link type="primary" v-if="scope.row.factBuyNum == 0" size="small"
          @click="delBuyList(scope.row.id)">删除</el-button>
        <el-button link type="primary" size="small" v-if="scope.row.isIn == 0"
          @click="doInStore(scope.row)">生成入库单</el-button>

      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <el-pagination small background :page-size="3" :pager-count="10" layout="prev, pager, next" :total="total"
    class="mt-4" @current-change="handlerPageChange" />
  <!-- 采购信息回显对话框 -->
  <el-dialog v-model="buyListDialog" width="60%">
    <h2>商品采购</h2>

    <el-form :model="buyForm" label-width="120px">
      <el-form-item label="商品名称">
        {{ buyForm.itemName }}
      </el-form-item>
      <el-form-item label="仓库">
        {{ buyForm.storeName }}
      </el-form-item>
      <el-form-item label="供应商">
        {{ buyForm.supplyName }}
      </el-form-item>
      <el-form-item label="产地">
        {{ buyForm.placeName }}
      </el-form-item>
      <el-form-item label="预计采购量">
        <el-input v-model="buyForm.buyNum" style="width: 80%" />
      </el-form-item>
      <el-form-item label="采购人">
        <el-input v-model="buyForm.buyUser" style="width: 80%" />
      </el-form-item>

      <el-form-item label="采购人电话">
        <el-input v-model="buyForm.phone" style="width: 80%" />
      </el-form-item>
      <el-form-item label="实际采购数">
        <el-input v-model="buyForm.factBuyNum" style="width: 80%" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateBuyOrder">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import axios from 'axios';
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
//声明列表集合数据
const buyList = ref([]);
//声明total
const total = ref(0);
//定义函数发送请求，加载采购单列表
function queryBuyList(pageNum) {
  axios.get("http://localhost:8080/queryBuyList?pageNum=" + pageNum)
    .then((response) => {
      buyList.value = response.data.buyLists;
      total.value = response.data.total;
    })
}
//加载页面调用函数
onMounted(function () {
  queryBuyList(1);
});
//分页按钮的回调函数
function handlerPageChange(pageNum) {
  queryBuyList(pageNum);
}
//////////////////////////////采购单信息回显///////////////////////////////
//定义采购单form表单
//声明商品采购表单
const buyForm = reactive({
  productId: '',
  storeId: '',
  supplyId: '',
  placeId: '',
  itemName: '',
  storeName: '',
  supplyName: '',
  placeName: '',
  buyNum: '',
  buyUser: '',
  phone: '',
  factBuyNum: ''
})
//声明变量表示采购单回显对话框状态
const buyListDialog = ref(false);
//声明函数打开采购数据回显对话框,row参数表示采购单对象。
function showBuyListDialog(row) {
  var productId = row.productId;
  buyListDialog.value = true;
  axios.get("http://localhost:8080/buyAutoInfo/" + productId)
    .then((response) => {
      //获得响应数据对象
      var item = response.data;
      //将响应数据赋值给buyForm表单
      buyForm.productId = item.id;
      buyForm.itemName = item.itemName;
      buyForm.storeId = item.storeId;
      buyForm.storeName = item.storeName;
      buyForm.supplyId = item.supplyId;
      buyForm.supplyName = item.supplyName;
      buyForm.placeId = item.placeId;
      buyForm.placeName = item.placeName;
      buyForm.buyUser = row.buyUser;
      buyForm.buyNum = row.buyNum;
      buyForm.factBuyNum = row.factBuyNum;
      buyForm.phone = row.phone;
      //表单中封装采购单id
      buyForm.buyId = row.buyId;

    })
    .catch((error) => {
      console.log(error);
    });
}
/*发送采购单更新的ajax请求*/
function updateBuyOrder() {
  axios.post("http://localhost:8080/updateBuyList", buyForm)
    .then((response) => {
      if (response.data.code == 200) {
        buyListDialog.value = false;
        //刷新列表
        queryBuyList(1);
      }
      ElMessage(response.data.message);
    })
    .catch((error) => {
      console.log(error);
    })
}
//定义函数发生采购单删除的请求
function delBuyList(id) {
  axios.get("http://localhost:8080/deleteBuyList/" + id)
    .then((response) => {
      if (response.data.code == 200) {
        //刷新列表
        queryBuyList(1);
      }
      ElMessage(response.data.message);

    })
    .catch((ex) => {
      console.log(ex);
    });
}

//定义入库按钮函数
function doInStore(row){
  axios.post("http://localhost:8080/buyInStore",row)
  .then((response)=>{
    if(response.data.code==200){
      //刷新列表
      queryBuyList(1);
    }
    ElMessage(response.data.message);
  })
      .catch((ex)=>{
        console.log(ex);
      });
}
//发送请求进行数据导出
function exportData(){
  location.href="http://localhost:8080/exportExcel";
}
</script>

<style scoped></style>