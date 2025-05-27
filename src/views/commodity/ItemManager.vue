<template>
  <h2>商品信息</h2>
  <div style="text-align: left; margin-bottom: 20px;">
    <el-button type="primary" @click="openItemDialog">添加商品</el-button>
  </div>
  <!-- 添加商品信息的对话框 -->
  <el-dialog v-model="dialogItemVisible" title="添加商品" :width="dialogWidth">
    <div style="margin-bottom: 20px;">
      <span>商品图片:</span>
      <el-upload
        action="http://localhost:8080/uploadImg"
        list-type="picture-card"
        :auto-upload="true"
        method="post"
        :on-success="handleAvatarSuccess"
      >
        <el-icon><Plus /></el-icon>
        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <el-icon><ZoomIn /></el-icon>
              </span>
            </span>
          </div>
        </template>
      </el-upload>
    </div>
    <el-form :model="itemForm" :rules="itemRules" label-width="120px" ref="itemFormRef">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="商品编号" prop="itemNum">
            <el-input v-model="itemForm.itemNum" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="商品名称" prop="itemName">
            <el-input v-model="itemForm.itemName" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="商品类型" prop="typeId">
            <el-input v-model="selectedTypeName" disabled placeholder="点击选择商品类型" />
            <el-button type="primary" size="small" style="margin-left: 10px;" @click="openTypeDialog">
              选择
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="库存数量" prop="store">
            <el-input v-model.number="itemForm.store" type="number" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="品牌" prop="brandId">
            <el-select v-model="itemForm.brandId" placeholder="请选择品牌" style="width: 100%;">
              <el-option v-for="item in brandList" :key="item.brandId" :label="item.brandName" :value="item.brandId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="门店" prop="storeId">
            <el-select v-model="itemForm.storeId" placeholder="请选择门店" style="width: 100%;">
              <el-option v-for="item in storeList" :key="item.storeId" :label="item.storeName" :value="item.storeId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="供应商" prop="supplyId">
            <el-select v-model="itemForm.supplyId" placeholder="请选择供应商" style="width: 100%;">
              <el-option v-for="item in supplyList" :key="item.supplyId" :label="item.supplyName" :value="item.supplyId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="产地" prop="placeId">
            <el-select v-model="itemForm.placeId" placeholder="请选择产地" style="width: 100%;">
              <el-option v-for="item in placeList" :key="item.placeId" :label="item.placeName" :value="item.placeId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="单位" prop="unitId">
            <el-select v-model="itemForm.unitId" placeholder="请选择单位" style="width: 100%;">
              <el-option v-for="item in unitList" :key="item.unitId" :label="item.unitName" :value="item.unitId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="进货价格" prop="price">
            <el-input v-model.number="itemForm.price" type="number" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="销售价格" prop="sellPrice">
            <el-input v-model.number="itemForm.sellPrice" type="number" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="会员价格" prop="vipPrice">
            <el-input v-model.number="itemForm.vipPrice" type="number" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="商品描述" prop="itemDesc">
            <el-input v-model="itemForm.itemDesc" type="textarea" :rows="3" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="生产日期" prop="itemDate">
            <el-date-picker v-model="itemForm.itemDate" type="date" placeholder="选择生产日期" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="到期日期" prop="endDate">
            <el-date-picker v-model="itemForm.endDate" type="date" placeholder="选择到期日期" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="促销标题" prop="hotTitle">
            <el-input v-model="itemForm.hotTitle" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="制造商" prop="facturer">
            <el-input v-model="itemForm.facturer" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="商品状态" prop="statue">
            <el-select v-model="itemForm.statue" placeholder="请选择状态" style="width: 100%;">
              <el-option label="上架" :value="1" />
              <el-option label="下架" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="创建者" prop="createBy">
            <el-input v-model="itemForm.createBy" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="dialogItemVisible = false">取消</el-button>
      <el-button type="primary" @click="submitItem">保存</el-button>
    </template>
  </el-dialog>
  <!-- 商品类型选择对话框 -->
  <el-dialog v-model="dialogTypeVisible" title="选择商品类型" :width="dialogWidth">
    <el-tree
      :props="typeTreeConfig"
      :data="typeList"
      default-expand-all
      node-key="id"
      ref="typeTreeRef"
      :highlight-current="true"
      :expand-on-click-node="false"
      @node-click="handleTypeNodeClick"
    >
      <template #default="{ node }">
        <span>{{ node.label }}</span>
      </template>
    </el-tree>
    <template #footer>
      <el-button @click="dialogTypeVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmTypeSelection">确认</el-button>
    </template>
  </el-dialog>
  <!-- 图片预览的对话框 -->
  <el-dialog v-model="dialogVisible" title="图片预览" :width="dialogWidth">
    <img style="width: 100%;" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { Plus, ZoomIn } from '@element-plus/icons-vue';
import axios from "axios";
import { ElMessage } from "element-plus";
import { categoryApi } from "@/api/category";

// 对话框状态
const dialogItemVisible = ref(false);
const dialogTypeVisible = ref(false);
const dialogVisible = ref(false);
const dialogImageUrl = ref(null);
const itemFormRef = ref(null);
const typeTreeRef = ref(null);

// 响应式对话框宽度
const dialogWidth = computed(() => {
  return window.innerWidth < 768 ? '90%' : window.innerWidth < 1024 ? '70%' : '60%';
});

// 树形结构配置
const typeTreeConfig = {
  id: 'id',
  label: 'label',
  children: 'children'
};

// 表单数据
const itemForm = reactive({
  itemNum: '',
  itemName: '',
  typeId: null,
  store: 0,
  brandId: null,
  storeId: null,
  supplyId: null,
  placeId: null,
  unitId: null,
  price: 0,
  sellPrice: 0,
  vipPrice: 0,
  itemDesc: '',
  itemDate: null,
  endDate: null,
  hotTitle: '',
  facturer: '',
  statue: 1,
  imgs: [], // 改为数组存储多张图片
  createBy: ''
});

// 显示选中的类型名称
const selectedTypeName = ref('');

// 表单验证规则
const itemRules = {
  itemNum: [{ required: true, message: '请输入商品编号', trigger: 'blur' }],
  itemName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  typeId: [{ required: true, message: '请选择商品类型', trigger: 'change' }],
  store: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
  brandId: [{ required: true, message: '请选择品牌', trigger: 'change' }],
  storeId: [{ required: true, message: '请选择门店', trigger: 'change' }],
  supplyId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  placeId: [{ required: true, message: '请选择产地', trigger: 'change' }],
  unitId: [{ required: true, message: '请选择单位', trigger: 'change' }],
  price: [{ required: true, message: '请输入进货价格', trigger: 'blur' }],
  sellPrice: [{ required: true, message: '请输入销售价格', trigger: 'blur' }],
  vipPrice: [{ required: true, message: '请输入会员价格', trigger: 'blur' }],
  itemDate: [{ required: true, message: '请选择生产日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择到期日期', trigger: 'change' }],
  statue: [{ required: true, message: '请选择商品状态', trigger: 'change' }],
};

// 列表数据
const typeList = ref([]);
const supplyList = ref([]);
const placeList = ref([]);
const unitList = ref([]);
const brandList = ref([]);
const storeList = ref([]);

// 打开商品信息对话框
function openItemDialog() {
  dialogItemVisible.value = true;
  loadTypeList();
  loadSupplyList();
  loadPlaceList();
  queryUnitList();
  queryBrandList();
  queryStoreList();
}

// 打开商品类型选择对话框
function openTypeDialog() {
  dialogTypeVisible.value = true;
  loadTypeList();
}

// 处理类型树节点点击
function handleTypeNodeClick(data) {
  if (data.children && data.children.length > 0) {
    ElMessage.warning('只能选择叶子节点');
    typeTreeRef.value.setCurrentKey(null);
  } else {
    typeTreeRef.value.setCurrentKey(data.id);
  }
}

// 确认类型选择
function confirmTypeSelection() {
  const selectedNode = typeTreeRef.value.getCurrentNode();
  if (!selectedNode) {
    ElMessage.warning('请选择一个商品类型');
    return;
  }
  if (selectedNode.children && selectedNode.children.length > 0) {
    ElMessage.warning('只能选择叶子节点');
    return;
  }
  itemForm.typeId = selectedNode.id;
  selectedTypeName.value = selectedNode.label;
  dialogTypeVisible.value = false;
}

// 图片上传成功回调
function handleAvatarSuccess(response) {
  const imageUrl = typeof response === 'string' ? response : (response.url || '');
  if (imageUrl) {
    if (!Array.isArray(itemForm.imgs)) {
      itemForm.imgs = [];
    }
    itemForm.imgs.push(imageUrl);
    console.log('保存的图片地址列表：', itemForm.imgs);
  }
}

// 图片预览
function handlePictureCardPreview(file) {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
}

// 提交表单
function submitItem() {
  itemFormRef.value.validate((valid) => {
    if (valid) {
      axios.post("http://localhost:8080/saveItem", itemForm)
        .then((response) => {
          // 检查响应状态
          if (response.data && response.data.code === 500) {
            ElMessage.error(response.data.message || '保存失败，请稍后重试');
            return;
          }
          ElMessage.success('保存成功');
          dialogItemVisible.value = false;
          // 清空表单
          Object.assign(itemForm, {
            itemNum: '', itemName: '', typeId: null, store: 0, brandId: null,
            storeId: null, supplyId: null, placeId: null, unitId: null, price: 0,
            sellPrice: 0, vipPrice: 0, itemDesc: '', itemDate: null, endDate: null,
            hotTitle: '', facturer: '', statue: 1, imgs: [], createBy: ''
          });
          selectedTypeName.value = '';
        })
        .catch((error) => {
          console.error(error);
          // 获取具体的错误信息
          const errorMsg = error.response?.data?.message || '保存失败，请稍后重试';
          ElMessage.error(errorMsg);
        });
    }
  });
}

// 加载商品类型（从类目管理页获取树形数据）
function loadTypeList() {
  categoryApi.getCategoryTree()
    .then((response) => {
      typeList.value = response.data;
    })
    .catch((error) => {
      console.error('加载商品类型失败:', error);
      ElMessage.error('加载商品类型失败，请稍后重试');
    });
}

// 其他数据加载方法
function loadSupplyList() {
  axios.get("http://localhost:8080/supplyList")
    .then((response) => {
      supplyList.value = response.data;
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error('加载供应商失败，请稍后重试');
    });
}

function loadPlaceList() {
  axios.get("http://localhost:8080/placeList")
    .then((response) => {
      placeList.value = response.data;
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error('加载产地失败，请稍后重试');
    });
}

function queryUnitList() {
  axios.get("http://localhost:8080/unitList")
    .then((response) => {
      unitList.value = response.data;
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error('加载单位失败，请稍后重试');
    });
}

function queryBrandList() {
  axios.get("http://localhost:8080/brandList")
    .then((response) => {
      brandList.value = response.data;
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error('加载品牌失败，请稍后重试');
    });
}

function queryStoreList() {
  axios.get("http://localhost:8080/storeList")
    .then((response) => {
      storeList.value = response.data;
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error('加载门店失败，请稍后重试');
    });
}
</script>

<style scoped>
.el-form {
  margin-top: 20px;
}
.el-form-item {
  margin-bottom: 20px;
}
.el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
@media (max-width: 768px) {
  .el-form-item {
    margin-bottom: 15px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 80px;
    height: 80px;
  }
}
</style>