<template>
    <h2>添加菜单</h2>
    <div style="text-align: left">
      <h4>选择新增节点的父节点:</h4>
      <el-tree
          :props="props"
          :data="treeNodeList"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          ref="treeRef"
          @node-click="hanldNodeClick"
          highlight-current="true"
        >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <a @click.stop="openEditDialog(data)" style="color: var(--el-color-primary)"> 修改 </a>
              <a style="margin-left: 8px; color: var(--el-color-danger)" @click.stop="delMenus(node, data)"> 删除 </a>
            </span>
          </span>
        </template>
      </el-tree>
    </div>
    <hr/>
    <!-- 添加表单控件 -->
    <el-form :model="menuForm" label-width="120px">
      <el-form-item label="菜单名称">
        <el-input v-model="menuForm.label" style="width: 50%"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="subMenuForm">保存</el-button>
        <el-button @click="resetForm">取消</el-button>
      </el-form-item>
    </el-form>
    <!-- 修改弹窗 -->
    <el-dialog title="修改菜单" v-model="dialogVisible" width="30%">
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="菜单名称">
          <el-input v-model="editForm.label" style="width: 50%"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateMenu">更新</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { onMounted, reactive, ref } from "vue";
  import axios from "axios";
  import { ElMessage } from "element-plus";
  
  // 定义tree控件的配置参数
  const props = {
    id: 'id',
    label: 'label',
    children: 'subMenu'
  };
  
  // 定义tree控件节点的集合
  const treeNodeList = ref([]);
  
  // 定义添加菜单的form表单
  const menuForm = reactive({
    id: null,
    label: '',
    component: null
  });
  
  // 添加弹窗状态和编辑表单数据
  const dialogVisible = ref(false);
  const editForm = reactive({
    id: null,
    label: '',
    component: null
  });
  
  // 发送ajax请求，加载菜单节点树
  function loadMenuTree() {
    axios.get("http://localhost:8080/listMenus")
      .then((response) => {
        treeNodeList.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  onMounted(() => {
    loadMenuTree();
  });
  
  // 声明变量保存当前选中树节点的id
  let id = 0;
  
  // 定义tree控件节点的点击回调函数
  function hanldNodeClick(node) {
    id = node.id;
  }
  
  // 打开编辑弹窗
  function openEditDialog(data) {
    editForm.id = data.id;
    editForm.label = data.label;
    editForm.component = data.component;
    dialogVisible.value = true;
  }
  
  // 更新菜单
  function updateMenu() {
    axios.put("http://localhost:8080/updateMenus", editForm)
      .then((response) => {
        if (response.data.code === 200) {
          loadMenuTree();
          dialogVisible.value = false;
        }
        ElMessage({
          type: response.data.code === 200 ? 'success' : 'error',
          message: response.data.msg || '更新成功'
        });
      })
      .catch((error) => {
        console.log(error);
        ElMessage.error('修改失败，请稍后重试');
      });
  }
  
  // 重置表单
  function resetForm() {
    menuForm.id = null;
    menuForm.label = '';
    menuForm.component = null;
    id = 0;
  }
  
  // 发送保存菜单的请求
  function subMenuForm() {
    if (id === 0) {
      ElMessage("请选择当前新增菜单节点的父节点......");
      return;
    }
    menuForm.pid = id;
    axios.post("http://localhost:8080/saveMenus", menuForm)
      .then((response) => {
        if (response.data.code === 200) {
          loadMenuTree();
          resetForm();
        }
        ElMessage({
          type: response.data.code === 200 ? 'success' : 'error',
          message: response.data.msg || '添加成功'
        });
      })
      .catch((error) => {
        console.log(error);
        ElMessage.error('添加失败，请稍后重试');
      });
  }
  
  // 删除菜单
  function delMenus(node, data) {
    if (data.subMenu && data.subMenu.length > 0) {
      ElMessage(data.label + ",节点存在子节点不能删除.......");
      return;
    }
    axios.delete("http://localhost:8080/deleteMenus?id=" + data.id)
      .then((response) => {
        if (response.data.code === 200) {
          loadMenuTree();
        }
        ElMessage({
          type: response.data.code === 200 ? 'success' : 'error',
          message: response.data.msg
        });
      });
  }
  </script>
  
  <style scoped>
  ::v-deep .el-tree-node.is-current > .el-tree-node__content {
    background-color: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }
  
  ::v-deep .el-tree-node__content:hover {
    background-color: var(--el-fill-color-light);
  }
  
  ::v-deep .el-tree {
    --el-tree-node-hover-bg-color: var(--el-fill-color-light);
    --el-tree-text-color: var(--el-text-color-regular);
    --el-tree-expand-icon-color: var(--el-text-color-placeholder);
  }
  
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  </style>