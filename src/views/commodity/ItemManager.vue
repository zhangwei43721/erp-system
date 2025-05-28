<template>
  <h2>商品信息</h2>
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <el-button type="primary" @click="openItemDialog">添加商品</el-button>
    <el-form :inline="true" :model="searchForm" class="search-form" ref="searchFormRef">
      <el-form-item label="商品编号" prop="itemNum">
        <el-input v-model="searchForm.itemNum" placeholder="请输入商品编号" clearable/>
      </el-form-item>
      <el-form-item label="商品名称" prop="itemName">
        <el-input v-model="searchForm.itemName" placeholder="请输入商品名称" clearable/>
      </el-form-item>
      <el-form-item label="状态" prop="statue">
        <el-select v-model="searchForm.statue" placeholder="请选择" clearable style="width: 100px;">
          <el-option label="上架" :value="1" />
          <el-option label="下架" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetSearchForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 商品列表表格 -->
  <el-table :data="itemList" row-key="id" stripe style="width: 100%">
    <el-table-column type="expand">
      <template #default="{ row }">
        <el-descriptions :column="2" border style="margin: 10px 20px;">
          <el-descriptions-item label="商品图片">
            <div v-if="row.imgs && row.imgs.length" class="image-preview">
              <el-image v-for="(img, index) in row.imgs" :key="index" :initial-index="index" :preview-src-list="row.imgs"
                        :preview-teleported="true" :src="img" :z-index="3000" class="table-image"
                        fit="cover"
                        style="width: 60px; height: 60px; margin-right: 5px; border-radius: 4px;"/>
            </div>
            <span v-else>无图片</span>
          </el-descriptions-item>
          <el-descriptions-item label="商品描述">{{ row.itemDesc }}</el-descriptions-item>
          <el-descriptions-item label="进货价格">{{ row.price }}</el-descriptions-item>
          <el-descriptions-item label="会员价格">{{ row.vipPrice }}</el-descriptions-item>
          <el-descriptions-item label="供应商">{{ row.supplyName }}</el-descriptions-item>
          <el-descriptions-item label="产地">{{ row.placeName }}</el-descriptions-item>
          <el-descriptions-item label="单位">{{ row.unitName }}</el-descriptions-item>
          <el-descriptions-item label="所属仓库">{{ row.storeName }}</el-descriptions-item>
          <el-descriptions-item label="生产日期">{{ row.itemDate }}</el-descriptions-item>
          <el-descriptions-item label="到期日期">{{ row.endDate }}</el-descriptions-item>
          <el-descriptions-item label="促销标题">{{ row.hotTitle }}</el-descriptions-item>
          <el-descriptions-item label="制造商">{{ row.facturer }}</el-descriptions-item>
          <el-descriptions-item label="创建者">{{ row.createBy }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-table-column>
    <el-table-column label="商品编号" prop="itemNum"/>
    <el-table-column label="商品名称" prop="itemName"/>
    <el-table-column label="商品类型" prop="cateName"/>
    <el-table-column label="品牌" prop="brandName"/>
    <el-table-column label="库存" prop="store" width="80"/>
    <el-table-column label="销售价格" prop="sellPrice"/>
    <el-table-column label="状态" prop="statue" width="80">
      <template #default="{ row }">
        <el-tag :type="row.statue === 0 ? 'success' : 'danger'">
          {{ row.statue === 0 ? '上架' : '下架' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="{ row }">
        <el-button link size="small" type="primary" @click="handleDeleteItem(row.id)">删除</el-button>
        <el-button link size="small" type="primary" @click="openUpdateDialog(row)">修改</el-button>
        <el-button v-if="row.statue === 1" link size="small" type="success" @click="handleUpItem(row.id)">上架</el-button>
        <el-button v-if="row.statue === 0" link size="small" type="warning" @click="handleDownItem(row.id)">下架</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页器 -->
  <el-pagination :page-size="10" :pager-count="5" :total="total" background class="mt-4" layout="prev, pager, next"
                 size="small" @current-change="handlePageChange"/>

  <!-- 添加商品对话框 -->
  <el-dialog v-model="dialogItemVisible" :width="dialogWidth" title="添加商品">
    <div style="margin-bottom: 20px;">
      <span>商品图片:</span>
      <el-upload :action="uploadImageUrl" :auto-upload="true" :file-list="fileList" :on-preview="handlePictureCardPreview"
                 :on-remove="handleRemove" :on-success="handleAvatarSuccess" list-type="picture-card"
                 method="post" preview-teleported>
        <el-icon>
          <Plus/>
        </el-icon>
      </el-upload>
    </div>
    <el-form ref="itemFormRef" :model="itemForm" :rules="itemRules" label-width="120px">
      <el-row :gutter="20">
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="商品编号" prop="itemNum">
            <el-input v-model="itemForm.itemNum"/>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="商品名称" prop="itemName">
            <el-input v-model="itemForm.itemName"/>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="商品类型" prop="typeId">
            <el-input v-model="selectedTypeName" disabled placeholder="点击选择商品类型"/>
            <el-button size="small" style="margin-left: 10px;" type="primary" @click="openTypeDialog">选择</el-button>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="库存数量" prop="store">
            <el-input v-model.number="itemForm.store" type="number"/>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="品牌" prop="brandId">
            <el-select v-model="itemForm.brandId" placeholder="请选择品牌">
              <el-option v-for="item in brandList" :key="item.brandId" :label="item.brandName" :value="item.brandId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="门店" prop="storeId">
            <el-select v-model="itemForm.storeId" placeholder="请选择门店">
              <el-option v-for="item in storeList" :key="item.storeId" :label="item.storeName" :value="item.storeId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="供应商" prop="supplyId">
            <el-select v-model="itemForm.supplyId" placeholder="请选择供应商">
              <el-option v-for="item in supplyList" :key="item.supplyId" :label="item.supplyName"
                         :value="item.supplyId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="产地" prop="placeId">
            <el-select v-model="itemForm.placeId" placeholder="请选择产地">
              <el-option v-for="item in placeList" :key="item.placeId" :label="item.placeName" :value="item.placeId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="单位" prop="unitId">
            <el-select v-model="itemForm.unitId" placeholder="请选择单位">
              <el-option v-for="item in unitList" :key="item.unitId" :label="item.unitName" :value="item.unitId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="进货价格" prop="price">
            <el-input v-model.number="itemForm.price" type="number"/>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="销售价格" prop="sellPrice">
            <el-input v-model.number="itemForm.sellPrice" type="number"/>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="会员价格" prop="vipPrice">
            <el-input v-model.number="itemForm.vipPrice" type="number"/>
          </el-form-item>
        </el-col>
        <el-col :md="24" :sm="24" :xs="24">
          <el-form-item label="商品描述" prop="itemDesc">
            <el-input v-model="itemForm.itemDesc" :rows="3" type="textarea"/>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="生产日期" prop="itemDate">
            <el-date-picker v-model="itemForm.itemDate" placeholder="选择生产日期" type="date"/>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="到期日期" prop="endDate">
            <el-date-picker v-model="itemForm.endDate" placeholder="选择到期日期" type="date"/>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="促销标题" prop="hotTitle">
            <el-input v-model="itemForm.hotTitle"/>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="制造商" prop="facturer">
            <el-input v-model="itemForm.facturer"/>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="商品状态" prop="statue">
            <el-select v-model="itemForm.statue" placeholder="请选择状态">
              <el-option :value="1" label="上架"/>
              <el-option :value="0" label="下架"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-form-item label="创建者" prop="createBy">
            <el-input v-model="itemForm.createBy"/>
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
  <el-dialog v-model="dialogTypeVisible" :width="dialogWidth" title="选择商品类型">
    <el-tree ref="typeTreeRef" :data="typeList" :expand-on-click-node="false" :highlight-current="true" :props="typeTreeConfig"
             default-expand-all node-key="id" @node-click="handleTypeNodeClick">
      <template #default="{ node }">
        <span>{{ node.label }}</span>
      </template>
    </el-tree>
    <template #footer>
      <el-button @click="dialogTypeVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmTypeSelection">确认</el-button>
    </template>
  </el-dialog>

  <!-- 图片预览组件 -->
  <el-image-viewer v-if="dialogVisible" :hide-on-click-modal="false" :initial-index="0" :teleported="true"
                   :url-list="[dialogImageUrl]" :z-index="3000" :zoom-rate="1.2" @close="dialogVisible = false"/>
</template>

<script setup>
import {computed, nextTick, onMounted, reactive, ref} from "vue";
import {Plus} from '@element-plus/icons-vue';
import {ElMessage, ElMessageBox} from "element-plus";
import {categoryApi} from "@/api/category";
import {itemApi, uploadImageUrl} from "@/api/item";

// 对话框状态和图片上传相关
const dialogItemVisible = ref(false);
const dialogTypeVisible = ref(false);
const dialogVisible = ref(false);
const dialogImageUrl = ref('');
const itemFormRef = ref(null);
const typeTreeRef = ref(null);
const searchFormRef = ref(null); // 新增: 查询表单引用
const fileList = ref([]);

// 列表数据
const itemList = ref([]);
const total = ref(0);

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

// 查询表单数据
const searchForm = reactive({
  itemNum: '',
  itemName: '',
  statue: null,
});

// 商品表单数据
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
  imgs: [],
  createBy: ''
});

// 显示选中的类型名称
const selectedTypeName = ref('');

// 表单验证规则
const itemRules = {
  itemNum: [{required: true, message: '请输入商品编号', trigger: 'blur'}],
  itemName: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
  typeId: [{required: true, message: '请选择商品类型', trigger: 'change'}],
  store: [{required: true, message: '请输入库存数量', trigger: 'blur'}],
  brandId: [{required: true, message: '请选择品牌', trigger: 'change'}],
  storeId: [{required: true, message: '请选择门店', trigger: 'change'}],
  supplyId: [{required: true, message: '请选择供应商', trigger: 'change'}],
  placeId: [{required: true, message: '请选择产地', trigger: 'change'}],
  unitId: [{required: true, message: '请选择单位', trigger: 'change'}],
  price: [{required: true, message: '请输入进货价格', trigger: 'blur'}],
  sellPrice: [{required: true, message: '请输入销售价格', trigger: 'blur'}],
  vipPrice: [{required: true, message: '请输入会员价格', trigger: 'blur'}],
  itemDate: [{required: true, message: '请选择生产日期', trigger: 'change'}],
  endDate: [{required: true, message: '请选择到期日期', trigger: 'change'}],
  statue: [{required: true, message: '请选择商品状态', trigger: 'change'}],
};

// 列表数据
const typeList = ref([]);
const supplyList = ref([]);
const placeList = ref([]);
const unitList = ref([]);
const brandList = ref([]);
const storeList = ref([]);

// 打开商品信息对话框并加载所有数据
function openItemDialog() {
  // 重置表单和相关状态
  Object.assign(itemForm, {
    id: null, // 清除可能存在的id，确保是添加操作
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
    imgs: [],
    createBy: ''
  });
  selectedTypeName.value = '';
  fileList.value = [];
  //确保DOM更新完毕后再调用resetFields，以保证itemFormRef可用
  nextTick(() => {
    if (itemFormRef.value) {
      itemFormRef.value.resetFields();
    }
  });

  // 获取商品编号
  itemApi.getItemCode()
      .then(response => {
        itemForm.itemNum = response.data;
      })
      .catch(() => {
        ElMessage.error('获取商品编号失败');
      });

  dialogItemVisible.value = true;
  loadAllData(); // 加载下拉框等所需数据
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
    if (!Array.isArray(itemForm.imgs)) itemForm.imgs = [];
    itemForm.imgs.push(imageUrl);
    fileList.value.push({url: imageUrl, status: 'success'});
  }
}

// 移除图片
function handleRemove(file) {
  const index = fileList.value.indexOf(file);
  if (index !== -1) {
    fileList.value.splice(index, 1);
    itemForm.imgs.splice(index, 1);
  }
}

// 图片预览
function handlePictureCardPreview(uploadFile) {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
}

// 提交表单
function submitItem() {
  itemFormRef.value.validate((valid) => {
    if (valid) {
      const apiCall = itemForm.id ? itemApi.updateItem(itemForm) : itemApi.saveItem(itemForm);
      apiCall
          .then((response) => {
            if (response.data && response.data.code === 500) {
              ElMessage.error(response.data.message || '操作失败，请稍后重试');
              return;
            }
            ElMessage.success(itemForm.id ? '修改成功' : '添加成功');
            dialogItemVisible.value = false;
            Object.assign(itemForm, {
              itemNum: '', itemName: '', typeId: null, store: 0, brandId: null,
              storeId: null, supplyId: null, placeId: null, unitId: null, price: 0,
              sellPrice: 0, vipPrice: 0, itemDesc: '', itemDate: null, endDate: null,
              hotTitle: '', facturer: '', statue: 1, imgs: [], createBy: ''
            });
            selectedTypeName.value = '';
            fileList.value = [];
            loadItemList(1);
          })
          .catch((error) => {
            const errorMsg = error.response?.data?.message || '保存失败，请稍后重试';
            ElMessage.error(errorMsg);
          });
    }
  });
}

// 加载所有数据
function loadAllData() {
  Promise.all([
    categoryApi.getCategoryTree(),
    itemApi.getSupplyList(),
    itemApi.getPlaceList(),
    itemApi.getUnitList(),
    itemApi.getBrandList(),
    itemApi.getStoreList()
  ])
      .then(([typeRes, supplyRes, placeRes, unitRes, brandRes, storeRes]) => {
        typeList.value = typeRes.data;
        supplyList.value = supplyRes.data;
        placeList.value = placeRes.data;
        unitList.value = unitRes.data;
        brandList.value = brandRes.data;
        storeList.value = storeRes.data;
      })
      .catch(() => {
        ElMessage.error('加载数据失败，请稍后重试');
      });
}

// 加载商品类型
function loadTypeList() {
  categoryApi.getCategoryTree()
      .then((response) => {
        typeList.value = response.data;
      })
      .catch(() => {
        ElMessage.error('加载商品类型失败，请稍后重试');
      });
}

// 加载商品列表
function loadItemList(pageNum = 1, pageSize = 10) {
  const params = {
    pageNum,
    pageSize,
    itemNum: searchForm.itemNum,
    itemName: searchForm.itemName,
    statue: searchForm.statue,
  };
  itemApi.getItemList(params)
      .then((response) => {
        // 确保从后端正确解析数据
        if (response.data && response.data.items) {
          itemList.value = response.data.items;
          total.value = response.data.total;
        } else {
          // 处理可能的空数据或错误格式
          itemList.value = [];
          total.value = 0;
          ElMessage.warning('商品数据格式不正确或为空');
        }
      })
      .catch(() => {
        ElMessage.error('加载商品列表失败');
      });
}

// 处理查询
function handleSearch() {
  loadItemList(1); // 查询时总是从第一页开始
}

// 重置查询表单
function resetSearchForm() {
  if (searchFormRef.value) {
    searchFormRef.value.resetFields();
  }
  // 手动清空searchForm reactive对象的值，因为resetFields可能不会完全清空
  searchForm.itemNum = '';
  searchForm.itemName = '';
  searchForm.statue = null;
  loadItemList(1); // 重置后重新加载数据
}

// 删除商品
function handleDeleteItem(id) {
  ElMessageBox.confirm('确定要删除这个商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(() => {
        itemApi.deleteItem(id)
            .then((response) => {
              if (response.data.code === 200) {
                ElMessage.success(response.data.message || '删除成功');
                loadItemList(1);
              } else {
                ElMessage.error(response.data.message || '删除失败');
              }
            })
            .catch(() => {
              ElMessage.error('删除失败');
            });
      })
      .catch(() => {
        ElMessage.info('已取消删除');
      });
}

// 处理商品下架
function handleDownItem(id) {
  itemApi.downItem(id)
    .then((response) => {
      if (response.data.code === 200) {
        ElMessage.success(response.data.message || '下架成功');
        loadItemList(1);
      } else {
        ElMessage.error(response.data.message || '下架失败');
      }
    })
    .catch(() => {
      ElMessage.error('下架失败');
    });
}

// 处理商品上架
function handleUpItem(id) {
  itemApi.upItem(id)
    .then((response) => {
      if (response.data.code === 200) {
        ElMessage.success(response.data.message || '上架成功');
        loadItemList(1);
      } else {
        ElMessage.error(response.data.message || '上架失败');
      }
    })
    .catch(() => {
      ElMessage.error('上架失败');
    });
}

// 打开修改对话框
function openUpdateDialog(row) {
  dialogItemVisible.value = true;
  Object.assign(itemForm, {
    id: row.id,
    itemNum: row.itemNum || '',
    itemName: row.itemName || '',
    typeId: row.typeId,
    store: row.store || 0,
    brandId: row.brandId,
    storeId: row.storeId,
    supplyId: row.supplyId,
    placeId: row.placeId,
    unitId: row.unitId,
    price: row.price || 0,
    sellPrice: row.sellPrice || 0,
    vipPrice: row.vipPrice || 0,
    itemDesc: row.itemDesc || '',
    itemDate: row.itemDate,
    endDate: row.endDate,
    hotTitle: row.hotTitle || '',
    facturer: row.facturer || '',
    statue: row.statue,
    imgs: row.imgs || [],
    createBy: row.createBy || ''
  });
  fileList.value = (row.imgs || []).map(url => ({url, status: 'success'}));
  selectedTypeName.value = row.cateName || ''; // 使用 cateName 对应后端的商品类型名称
  loadAllData();
}

// 生命周期钩子
onMounted(() => {
  loadItemList(1);
});

// 处理分页
function handlePageChange(value) {
  loadItemList(value);
}
</script>

<style scoped></style>