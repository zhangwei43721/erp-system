<template>
  <h2>商品类目管理</h2>
  <div style="text-align: left">
    <h4>选择分类节点进行管理</h4>
    <!-- tree控件 -->
    <el-tree :props="config" :data="categoryList" default-expand-all node-key="id" ref="treeRef"
      :highlight-current="true" :expand-on-click-node="false" @node-click="handleClickNode">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span class="operation-buttons">
            <el-button type="primary" size="small" link @click.stop="showCategory(node, data)">
              修改
            </el-button>
            <el-button type="danger" size="small" link @click.stop="handleDelete(node, data)">
              删除
            </el-button>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
  <hr />
  <!-- 添加商品类目表单 -->
  <el-form :model="categoryForm" label-width="120px" class="category-form">
    <el-form-item label="分类编号">
      <el-input v-model="categoryForm.isbn" style="width: 80%" placeholder="请输入分类编号" />
    </el-form-item>
    <el-form-item label="分类名称">
      <el-input v-model="categoryForm.cateName" style="width: 80%" placeholder="请输入分类名称" />
    </el-form-item>
    <el-form-item label="分类描述">
      <el-input v-model="categoryForm.remark" style="width: 80%" placeholder="请输入分类描述" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="saveCategoryForm">保存</el-button>
      <el-button @click="resetForm">重置表单</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { categoryApi } from "@/api/category";

// --- 树配置 ---
const config = {
  id: 'id',
  label: 'label',
  children: 'children'
};

const treeRef = ref(null);
const categoryList = ref([]);

// --- 数据加载 ---
function queryCategoryTree() {
  categoryApi.getCategoryTree()
    .then((response) => {
      categoryList.value = response.data;
    })
    .catch((error) => {
      console.error('加载分类树失败:', error);
      ElMessage.error('加载分类树失败，请稍后重试');
    });
}

onMounted(() => {
  queryCategoryTree();
});

// --- 表单处理 ---
const categoryForm = reactive({
  id: 0,
  isbn: '',
  cateName: '',
  remark: '',
  pid: 0  // 默认为0，表示一级节点
});

let pnode = null; // 记录当前选中的节点对象

// --- 节点操作函数 ---
function handleClickNode(node) {
  pnode = node;
  // 如果是新增模式，设置父节点
  if (categoryForm.id === 0) {
    categoryForm.pid = node.id;
  }
}

function resetForm() {
  // 重置表单数据
  categoryForm.id = 0;
  categoryForm.isbn = '';
  categoryForm.cateName = '';
  categoryForm.remark = '';
  categoryForm.pid = 0;  // 重置为0，表示添加一级节点

  // 重置树选择状态
  if (treeRef.value) {
    treeRef.value.setCurrentKey(null);
  }
  pnode = null;
}

// --- 保存操作 ---
function saveCategoryForm() {
  if (!categoryForm.cateName.trim()) {
    ElMessage.warning('分类名称不能为空');
    return;
  }

  if (categoryForm.id === 0) {  // 新增模式
    // pid为0时表示添加一级节点，否则为选中节点的子节点
    if (pnode) {
      categoryForm.pid = pnode.id;
    }
  }

  const apiCall = categoryForm.id === 0
    ? categoryApi.saveCategory(categoryForm)
    : categoryApi.updateCategory(categoryForm);

  apiCall
    .then((response) => {
      if (response.data.code === 200) {
        ElMessage.success(response.data.message);
        queryCategoryTree();
        resetForm();
      } else {
        ElMessage.error(response.data.message);
      }
    })
    .catch((error) => {
      console.error('保存失败:', error);
      ElMessage.error('保存失败，请稍后重试');
    });
}

// --- 修改操作 ---
function showCategory(node, data) {
  categoryApi.getCategoryById(data.id)
    .then((response) => {
      Object.assign(categoryForm, response.data);
      pnode = node;
    })
    .catch((error) => {
      console.error('加载分类信息失败:', error);
      ElMessage.error('加载分类信息失败，请稍后重试');
    });
}

// --- 删除操作 ---
function handleDelete(node, data) {
  if (data.children && data.children.length > 0) {
    ElMessage.warning('该分类下还有子分类，不能删除');
    return;
  }

  ElMessageBox.confirm(
    '确定要删除该分类吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      categoryApi.deleteCategory(data.id)
        .then((response) => {
          if (response.data.code === 200) {
            ElMessage.success(response.data.message);
            queryCategoryTree();
            resetForm();
          } else {
            ElMessage.error(response.data.message);
          }
        })
        .catch((error) => {
          console.error('删除失败:', error);
          ElMessage.error('删除失败，请稍后重试');
        });
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.operation-buttons {
  margin-left: 10px;
}

.category-form {
  max-width: 600px;
  margin: 0 auto;
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

:deep(.el-tree-node__content:hover) {
  background-color: var(--el-fill-color-light);
}

:deep(.el-tree) {
  --el-tree-node-hover-bg-color: var(--el-fill-color-light);
}
</style>