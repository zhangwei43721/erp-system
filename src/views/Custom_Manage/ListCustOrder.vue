<template>
  <h2>客户订单列表</h2>
<!-- 添加条件查询表单 -->
  <el-form :inline="true" :model="condForm"
    >
    <el-form-item label="订单号">
      <el-input v-model="condForm.id" />
    </el-form-item>
    <el-form-item label="订单状态" style="width: 22%">
      <el-select
          v-model="condForm.state"
          placeholder="请选择订单状态....">
        <el-option label="未出库" value="未出库" />
        <el-option label="已出库" value="已出库" />
        <el-option label="配送中" value="配送中" />
        <el-option label="已收货" value="已收货" />

      </el-select>
    </el-form-item>
    <br/>
    <el-form-item label="客户姓名">
      <el-input v-model="condForm.custName" />
    </el-form-item>
    <el-form-item label="商品名称">
      <el-input v-model="condForm.itemName" />
    </el-form-item>
    <br/>

    <el-form-item>
      <el-button type="primary" @click="subQueryCond">查询</el-button>
    </el-form-item>
  </el-form>

  <hr/>
  <el-table :data="orderList" stripe style="width: 100%">
    <el-table-column prop="id" label="订单编号" />
    <el-table-column prop="custName" label="客户姓名" />
    <el-table-column prop="itemName" label="商品名称" />
    <el-table-column prop="orderDate" label="订单日期" width="180" />
    <el-table-column prop="state" label="订单状态" />
    <el-table-column prop="num" label="数量" />
    <el-table-column prop="pay" label="支付方式" />
    <el-table-column prop="payMoney" label="支付金额" />

    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="deleteOrder(scope.row.id)">删除</el-button>
        <el-button link type="primary" size="small" @click="openOrderDialog(scope.row)">修改</el-button>
      </template>
    </el-table-column>
  </el-table>
  <hr />

  <el-pagination
    small
    background
    :page-size="3"
    :pager-count="10"
    layout="prev, pager, next"
    :total="total"
    class="mt-4"
    @current-change="handlerOrderPageChange"
  />

  <el-dialog v-model="dialogOrderVisible" width="80%" title="修改订单信息">
    <el-form :model="orderForm" label-width="120px">
      <el-form-item label="客户姓名">
        <el-input v-model="orderForm.custName" style="width: 80%" />
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input v-model="orderForm.itemName" style="width: 80%" />
      </el-form-item>
      <el-form-item label="订单日期">
        <el-input v-model="orderForm.orderDate" style="width: 80%" />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-input v-model="orderForm.state" style="width: 80%" />
      </el-form-item>
      <el-form-item label="数量">
        <el-input v-model.number="orderForm.num" style="width: 80%" />
      </el-form-item>
      <el-form-item label="支付方式">
        <el-input v-model="orderForm.pay" style="width: 80%" />
      </el-form-item>
      <el-form-item label="支付金额">
        <el-input v-model.number="orderForm.payMoney" style="width: 80%" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrder">保存</el-button>
        <el-button @click="cancelOrder">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

// 定义订单列表
const orderList = ref([]);
const total = ref(0);
const dialogOrderVisible = ref(false);

// 表单数据
const orderForm = reactive({
  id: null,
  custName: "",
  itemName: "",
  orderDate: "",
  state: "",
  num: 0,
  pay: "",
  payMoney: 0,
});

// 加载订单列表
function loadOrderList(pageNum) {
  condForm.pageNum=pageNum;
  axios
    // .get(`http://localhost:8080/listOrder?pageNum=${pageNum}`)
    .post("http://localhost:8080/listOrder", condForm)
    .then((response) => {
      orderList.value = response.data.orderList;
      total.value = response.data.total;
    })
    .catch((error) => {
      console.log(error);
    });
}
//声明保存查询条件的表单数据
const condForm=reactive({
  id:'',
  state:'',
  custName:'',
  itemName:''
})

//定义函数提交动态查询条件
function subQueryCond(){
  condForm.pageNum=1; //将原来页码重置为1
  axios.post("http://localhost:8080/listOrder",condForm)
      .then((response)=>{
        orderList.value=response.data.orderList;
        total.value=response.data.total;
      })
      .catch((error)=>{
        console.log(error);
      });
}
// 删除订单
function deleteOrder(id) {
  ElMessageBox.confirm("确定删除该订单吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      axios
        .delete(`http://localhost:8080/deleteOrder/${id}`)
        .then(() => {
          ElMessage.success("删除成功");
          loadOrderList(1);
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
function openOrderDialog(row) {
  dialogOrderVisible.value = true;
  Object.assign(orderForm, {
    id: row.id,
    custName: row.custName,
    itemName: row.itemName,
    orderDate: row.orderDate,
    state: row.state,
    num: row.num,
    pay: row.pay,
    payMoney: row.payMoney,
  });
}

// 保存修改
function saveOrder() {
  axios
    .put("http://localhost:8080/updateOrder", orderForm)
    .then(() => {
      ElMessage.success("修改成功");
      dialogOrderVisible.value = false;
      loadOrderList(1);
    })
    .catch((error) => {
      ElMessage.error("修改失败");
      console.log(error);
    });
}

// 取消修改
function cancelOrder() {
  dialogOrderVisible.value = false;
}

// 页面加载
onMounted(() => {
  loadOrderList(1);
});

// 分页处理
function handlerOrderPageChange(pageNum) {
  loadOrderList(pageNum);
}
</script>

<style scoped>
</style>