<template> <!-- 1. 模板区域: 定义组件的HTML结构 -->
  <h2>客户列表</h2>

  <!-- 2. 客户信息展示表格 (饿了么Plus组件 el-table) -->
  <!-- :data绑定客户列表数据, stripe开启斑马纹, style设置宽度 -->
  <el-table :data="custList" stripe style="width: 100%">
    <!-- el-table-column: 定义表格列。prop指定数据源的字段名, label指定列头文本 -->
    <el-table-column prop="id" label="客户编号"  />
    <el-table-column prop="custName" label="客户姓名"  />
    <el-table-column prop="address" label="客户地址" />
    <el-table-column prop="phone" label="客户电话" />
    <el-table-column prop="custType" label="客户职业" />
    <el-table-column prop="grade" label="客户等级" />
    <el-table-column prop="hisTotal" label="消费总额（元）" />

    <!-- 操作列: fixed固定在右侧, width设置宽度, #default作用域插槽自定义内容 (row代表当前行数据) -->
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="{ row }">
        <!-- 饿了么按钮: link类型像链接, 小按钮样式，@click绑定点击事件 -->
        <el-button link type="primary" size="small" @click="deleteCustomer(row.id)">删除</el-button>
        <el-button link type="primary" size="small" @click="openCustDialog(row)">修改</el-button>
      </template>
    </el-table-column>
  </el-table>
  <hr />

  <!-- 3. 分页组件 (饿了么Plus组件 el-pagination) -->
  <!-- small小型分页, background带背景色, :page-size每页条数, :pager-count页码按钮数, layout组件布局, :total总条数, @current-change页码改变事件 -->
  <el-pagination size="small" background :page-size="10" :pager-count="5" layout="prev, pager, next" :total="total"
    class="mt-4" @current-change="handlerPageChange" />

  <!-- 4. 修改客户信息对话框 (饿了么Plus组件 el-dialog) -->
  <!-- v-model控制显示/隐藏, width宽度, title标题 -->
  <el-dialog v-model="dialogCustVisible" width="80%" title="修改客户信息">
    <!-- 客户信息表单 (饿了么Plus组件 el-form) -->
    <!-- :model绑定表单数据对象, label-width标签宽度, :rules绑定验证规则, ref用于访问表单实例 -->
    <el-form :model="custForm" label-width="120px" :rules="rules" ref="custFormRef">
      <!-- el-form-item: 表单项。label标签文本, prop关联数据和规则 -->
      <el-form-item label="客户名称" prop="custName">
        <!-- el-input: 输入框, v-model双向绑定数据 -->
        <el-input v-model="custForm.custName" style="width: 80%" />
      </el-form-item>
      <el-form-item label="联系地址" prop="address">
        <el-input v-model="custForm.address" style="width: 80%" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="custForm.phone" style="width: 80%" />
      </el-form-item>
      <el-form-item label="客户职业" prop="custType">
        <!-- el-select: 下拉选择框 -->
        <el-select v-model="custForm.custType" placeholder="请选择职业...." style="width: 80%">
          <!-- el-option: 下拉选项, label显示文本, value实际值 -->
          <el-option label="保密" value="保密" />
          <el-option label="金融" value="金融" />
          <el-option label="互联网" value="互联网" />
          <el-option label="IT" value="IT" />
          <el-option label="能源" value="能源" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户等级" prop="grade">
        <!-- .number修饰符, 输入值自动转为数字 -->
        <el-input v-model.number="custForm.grade" style="width: 80%" />
      </el-form-item>
    </el-form>

    <!-- 对话框底部操作区域 (el-dialog的#footer插槽) -->
    <template #footer>
      <el-button @click="cancelForm">取消</el-button>
      <el-button type="primary" @click="subCustForm">保存</el-button>
    </template>
  </el-dialog>
</template>

<!-- 5. Script区域 (Vue 3 Composition API setup语法糖) -->
<script setup>
// 导入Vue核心API  Element Plus组件
import { onMounted, ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { customerApi } from "@/api/customer";

// --- 响应式状态定义 ---
const custList = ref([]);          // 客户列表数据
const total = ref(0);              // 客户总记录数 (用于分页)
const dialogCustVisible = ref(false); // 控制修改对话框的显示/隐藏
const custFormRef = ref(null);     // 表单DOM引用 (用于调用表单方法如validate, resetFields)

// 客户表单数据模型 (响应式对象)
const custForm = reactive({
  id: null, custName: '', address: '', phone: '', custType: '', grade: 1, hisTotal: 0
});

// 表单验证规则
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

// --- 方法定义 ---
// 查询客户列表 (pageNum: 请求的页码)
function custListQeury(pageNum) {
  customerApi.getCustomerList(pageNum)
    .then((response) => { // 请求成功的回调
      custList.value = response.data.custlist; // 更新客户列表数据
      total.value = response.data.total;       // 更新总记录数
    })
    .catch((error) => { // 请求失败的回调
      ElMessage.error("查询失败"); // 使用 Element Plus 的 ElMessage 显示错误提示
      console.log(error); // 在控制台打印错误信息
    });
}

// 删除客户 (id: 客户ID)
function deleteCustomer(id) {
  ElMessageBox.confirm("确定删除该客户吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      customerApi.deleteCustomer(id)
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

// 打开修改对话框并填充数据 (row: 当前行数据)
function openCustDialog(row) {
  dialogCustVisible.value = true;
  // 使用Object.assign将行数据安全地复制到表单模型，提供默认值以防row中字段缺失
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
  custFormRef.value.validate(valid => { // 调用表单验证
    if (valid) {
      customerApi.updateCustomer(custForm) // 调用API更新客户信息
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

// 取消修改 (关闭对话框并重置表单)
function cancelForm() {
  dialogCustVisible.value = false;
  custFormRef.value.resetFields(); // 重置表单项到初始值并移除校验结果
}

// --- 生命周期钩子 ---
// 组件挂载后执行: 初始化加载第一页数据
onMounted(() => {
  custListQeury(1);
});

// 处理分页页码变化 (value: 新的页码)
function handlerPageChange(value) {
  custListQeury(value);
}
</script>

<!-- 6. Style区域 (scoped表示样式仅作用于当前组件) -->
<style scoped>
/* 此处可添加组件特定样式 */
</style>