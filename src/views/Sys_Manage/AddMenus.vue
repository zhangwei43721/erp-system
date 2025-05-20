<template>
  <h2>管理菜单</h2>
  <div style="text-align: left">
    <h4>选择新增节点的父节点 (拖拽可调整菜单结构):</h4>
    <el-tree
        :props="props"
        :data="treeNodeList"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        ref="treeRef"
        @node-click="hanldNodeClick"
        highlight-current="true"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        @node-drop="handleNodeDrop"
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
    <el-form-item label="新增菜单名称">
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
// 引入 Element Plus Tree 的类型 (如果需要更严格的类型检查)
// import type Node from 'element-plus/es/components/tree/src/model/node'
// import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
// import type { AllowDropType, NodeDropType } from 'element-plus/es/components/tree/src/tree.type'

// 定义tree控件的配置参数
const props = {
  // id: 'id', // node-key 已经指定了 id, props 中的 id 主要用于 initial checked keys 等，这里可以省略
  label: 'label',
  children: 'subMenu' // 确保这个和后端返回的数据结构一致
};

// 定义tree控件节点的集合
const treeNodeList = ref([]);
const treeRef = ref(null); // 引用 el-tree 实例

// 定义添加菜单的form表单
const menuForm = reactive({
  // id: null, // id是自增的，添加时不需要
  label: '',
  component: null, // component 后端会自动处理
  pid: null // 将通过点击父节点或拖拽设置
});

// 添加弹窗状态和编辑表单数据
const dialogVisible = ref(false);
const editForm = reactive({
  id: null,
  label: '',
  component: null,
  pid: null // 编辑时可能也需要pid，虽然当前UI没体现修改pid
});

// 发送ajax请求，加载菜单节点树
function loadMenuTree() {
  axios.get("http://localhost:8080/listMenus")
    .then((response) => {
      treeNodeList.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error("菜单加载失败！");
    });
}

onMounted(() => {
  loadMenuTree();
});

// 声明变量保存当前选中树节点的id, 用于“添加”操作的父节点
let currentSelectedParentIdForAdd = 0; 

// 定义tree控件节点的点击回调函数
function hanldNodeClick(data, node) { // el-tree的node-click回调参数顺序是 data, node, component
  currentSelectedParentIdForAdd = data.id;
  ElMessage.info(`已选择 "${data.label}" 作为新增节点的父节点`);
}

// 打开编辑弹窗
function openEditDialog(data) {
  editForm.id = data.id;
  editForm.label = data.label;
  editForm.component = data.component;
  editForm.pid = data.pid; // 保存原始pid，以防万一
  dialogVisible.value = true;
}

// 更新菜单 (主要用于修改名称)
function updateMenu() {
  axios.put("http://localhost:8080/updateMenus", editForm) // editForm 包含 id, label, component, pid
    .then((response) => {
      if (response.data.code === 200) {
        loadMenuTree(); // 重新加载以确保数据一致
        dialogVisible.value = false;
      }
      ElMessage({
        type: response.data.code === 200 ? 'success' : 'error',
        message: response.data.msg || (response.data.code === 200 ? '更新成功' : '更新失败')
      });
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error('修改失败，请稍后重试');
    });
}

// 重置表单
function resetForm() {
  menuForm.label = '';
  menuForm.component = null; // 后端会自动处理
  menuForm.pid = null;
  currentSelectedParentIdForAdd = 0; // 重置选中的父节点
  if (treeRef.value) {
      treeRef.value.setCurrentKey(null); // 取消树的当前高亮节点
  }
}

// 发送保存菜单的请求
function subMenuForm() {
  if (currentSelectedParentIdForAdd === 0) {
    ElMessage.warning("请先在树中选择一个父节点后再添加！");
    return;
  }
  if (!menuForm.label.trim()) {
    ElMessage.warning("菜单名称不能为空！");
    return;
  }
  menuForm.pid = currentSelectedParentIdForAdd;
  axios.post("http://localhost:8080/saveMenus", menuForm)
    .then((response) => {
      if (response.data.code === 200) {
        loadMenuTree();
        resetForm();
      }
      ElMessage({
        type: response.data.code === 200 ? 'success' : 'error',
        message: response.data.msg || (response.data.code === 200 ? '添加成功' : '添加失败')
      });
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error('添加失败，请稍后重试');
    });
}

// 删除菜单
function delMenus(node, data) {
  // data.subMenu 是前端构建的，后端判断子节点更可靠，但前端也可以做初步判断
  if (data.subMenu && data.subMenu.length > 0) {
    ElMessage.error(data.label + ", 节点存在子节点不能删除!");
    return;
  }
  // 二次确认
  ElMessage.confirm(`确定要删除菜单 "${data.label}" 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    axios.delete("http://localhost:8080/deleteMenus?id=" + data.id)
      .then((response) => {
        if (response.data.code === 200) {
          loadMenuTree();
        }
        ElMessage({
          type: response.data.code === 200 ? 'success' : 'error',
          message: response.data.msg
        });
      }).catch(error => {
        console.error("删除失败:", error);
        ElMessage.error("删除操作失败");
      });
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
}

// --- 拖拽相关方法 ---

/**
 * 判断节点是否允许被拖拽
 * @param {Node} draggingNode - 被拖拽的节点
 */
const allowDrag = (draggingNode) => {
  // 示例：可以禁止某些特定节点被拖拽
  // if (draggingNode.data.label === '系统管理') return false;
  return true; // 默认都允许拖拽
};

/**
 * 判断节点是否允许被放置
 * @param {Node} draggingNode - 被拖拽的节点
 * @param {Node} dropNode - 目标节点
 * @param {AllowDropType} type - 放置类型: 'prev', 'inner', 'next'
 */
const allowDrop = (draggingNode, dropNode, type) => {
  // 1. 不能将父节点拖拽到其子节点内部或子节点的前后
  let parent = dropNode.parent;
  while (parent) {
    if (parent.key === draggingNode.key) { // dropNode 是 draggingNode 的子孙
      return false;
    }
    parent = parent.parent;
  }
  // 2. 示例：如果目标节点是“系统管理”，则不允许作为其子节点（inner）
  // if (dropNode.data.label === '系统管理' && type === 'inner') {
  //   return false;
  // }
  return true; // 默认允许
};

/**
 * 拖拽成功完成时触发
 * @param {Node} draggingNode - 被拖拽的节点
 * @param {Node} dropNode - 目标节点
 * @param {NodeDropType} dropType - 放置类型: 'before', 'after', 'inner' (注意与 allowDrop 的 type 不同)
 * @param {Event} ev - 事件对象
 */
const handleNodeDrop = async (draggingNode, dropNode, dropType, ev) => {
  console.log('tree drop: ', draggingNode.data.label, dropNode.data.label, dropType);

  const draggedMenu = draggingNode.data; // 被拖拽的菜单数据
  const targetMenu = dropNode.data;   // 目标菜单数据

  let newPid;
  // let order = 0; // 如果需要排序，这里可以计算顺序

  if (dropType === 'inner') {
    // 拖入目标节点内部，成为其子节点
    newPid = targetMenu.id;
  } else {
    // 'before' 或 'after'，成为目标节点的兄弟节点，父节点与目标节点相同
    newPid = targetMenu.pid; // 如果 targetMenu 是根节点，其 pid 可能是 0 或 null
  }
  // 确保根节点的 pid 为 0 (根据你的数据库设计)
  if (newPid === null || newPid === undefined) {
      newPid = 0;
  }


  // 准备发送给后端的数据
  // 关键是更新被拖拽节点的 pid
  // 其他字段 (label, component) 保持不变
  const updatePayload = {
    id: draggedMenu.id,
    label: draggedMenu.label,       // 保持原label
    component: draggedMenu.component, // 保持原component
    pid: newPid
  };

  // 避免将节点拖拽到自身或其子节点下（理论上 allowDrop 已经处理，但可再确认）
  if (draggedMenu.id === newPid) {
      ElMessage.error("不能将节点设置为自身的父节点！");
      loadMenuTree(); // 发生错误，重新加载树以恢复
      return;
  }
  
  try {
    const response = await axios.put("http://localhost:8080/updateMenus", updatePayload);
    if (response.data.code === 200) {
      ElMessage.success(response.data.msg || '菜单结构更新成功！');
      // El-tree 已经自动更新了前端的展示结构
      // 为了确保数据完全同步（特别是如果后端有其他逻辑），可以重新加载
      // 但如果拖拽操作频繁，重新加载可能会影响体验
      // 此处选择在成功后，相信 el-tree 的前端更新，并假设后端已正确保存
      // 如果有复杂的顺序或其它逻辑，loadMenuTree() 更安全
      // 简单的父子关系变更，可以信任前端的即时更新，但要确保 pid 正确
      // 更新拖拽节点在前端数据中的 pid，以便下次操作基于正确数据
      // (el-tree 的 draggingNode.data 已经是更新后的结构了，所以这里主要是为了确认)
      // draggedMenu.pid = newPid; // vue-draggable 或 element-plus tree 内部会处理
      
      // 最佳实践：拖拽成功后，重新从后端加载树，保证数据绝对一致
      loadMenuTree();

    } else {
      ElMessage.error(response.data.msg || '菜单结构更新失败！');
      loadMenuTree(); // 如果后端更新失败，则重新加载树以恢复到操作前状态
    }
  } catch (error) {
    console.error('Error updating menu structure:', error);
    ElMessage.error('操作失败，请检查网络或联系管理员。');
    loadMenuTree(); // 发生异常，重新加载树以恢复
  }
};

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