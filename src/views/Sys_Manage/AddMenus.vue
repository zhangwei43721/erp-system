<template>
  <h2>管理菜单</h2>
  <div style="text-align: left">
    <h4>选择新增节点的父节点 (或拖拽排序):</h4>
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
        @node-drop="handleDrop"
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
import { onMounted, reactive, ref, nextTick } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
// 注意：移除了 Element Plus 拖拽事件相关的类型导入，因为在纯 JS 中它们不是必需的
// import type Node from 'element-plus/es/components/tree/src/model/node'
// import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
// import type { AllowDropType, NodeDropType } from 'element-plus/es/components/tree/src/tree.type'

// 定义tree控件的配置参数
const props = {
label: 'label',
children: 'subMenu' // 这个与后端返回的 MenuVo 中的子菜单属性名一致
};

// 定义tree控件节点的集合
const treeNodeList = ref([]);
const treeRef = ref(null); // 或 ref()

// 定义添加菜单的form表单
const menuForm = reactive({
id: null,
label: '',
component: null,
pid: 0 // 新增时父节点ID，根节点 pid 为 0
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
    ElMessage.error("菜单加载失败");
  });
}

onMounted(() => {
loadMenuTree();
});

// 声明变量保存当前选中树节点的id，用于新增
let currentSelectedPidForAdd = 0; // 根节点 pid 为 0

// 定义tree控件节点的点击回调函数
function hanldNodeClick(data) { // 移除了类型: MenuData
currentSelectedPidForAdd = data.id;
console.log("Selected parent for new node:", currentSelectedPidForAdd);
}

// 打开编辑弹窗
function openEditDialog(data) { // 移除了类型: MenuData
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
      loadMenuTree(); // 重新加载树
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
menuForm.component = null;
currentSelectedPidForAdd = 0; // 重置为根节点
if (treeRef.value) {
  treeRef.value.setCurrentKey(null); // 取消选中高亮
}
}

// 发送保存菜单的请求
function subMenuForm() {
if (!menuForm.label.trim()) {
    ElMessage.warning("菜单名称不能为空");
    return;
}
// currentSelectedPidForAdd 默认是 0，如果用户没点任何节点直接添加，则添加到根节点
menuForm.pid = currentSelectedPidForAdd;
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
async function delMenus(node, data) { // 移除了类型: Node, MenuData
if (data.subMenu && data.subMenu.length > 0) {
  ElMessage.warning(data.label + ", 节点存在子节点不能删除!");
  return;
}
try {
  await ElMessageBox.confirm(
    `确定要删除菜单 "${data.label}" 吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  );
  // 用户点击了确定
  const response = await axios.delete("http://localhost:8080/deleteMenus?id=" + data.id);
  if (response.data.code === 200) {
    loadMenuTree(); // 重新加载树
  }
  ElMessage({
    type: response.data.code === 200 ? 'success' : 'error',
    message: response.data.msg
  });
} catch (error) {
  // 用户点击了取消，或者网络错误
  if (error !== 'cancel' && error !== 'close') { // ElMessageBox.confirm取消时会reject 'cancel'
      console.error("删除失败:", error);
      ElMessage.error('删除操作失败');
  } else {
      ElMessage.info('已取消删除');
  }
}
}

// --- 拖拽相关方法 ---

const allowDrag = (draggingNode) => { // 移除了类型: Node
// 可以根据需要限制某些节点不可拖拽
// 例如: if (draggingNode.data.label === '不可拖拽的节点') return false;
return true;
};

const allowDrop = (draggingNode, dropNode, type) => {
  // 辅助函数：获取节点层级
  const getNodeLevel = (node) => {
    if (!node || !node.data) return 0; // 无效或未知层级，保守处理
    if (node.data.pid === 0) return 1; // 一级菜单
    // 判断是否为二级菜单：其父节点是一级菜单
    // treeNodeList.value 是一级菜单的数组
    // 需要遍历 treeNodeList 找到 node.parent.key 对应的一级菜单
    // 或者更简单地，如果 node.data.pid 不为0，且其父节点存在且 pid 为 0
    if (node.data.pid !== 0 && node.parent && node.parent.data && node.parent.data.pid === 0) {
        return 2; // 二级菜单
    }
    return 0; // 其他情况视为未知或不合规层级
  };

  const draggingLevel = getNodeLevel(draggingNode);
  const dropLevel = getNodeLevel(dropNode);

  // console.log(`Dragging: ${draggingNode.data.label}(L${draggingLevel}, PID ${draggingNode.data.pid}), Drop: ${dropNode.data.label}(L${dropLevel}, PID ${dropNode.data.pid}), Type: ${type}`);

  // 规则0: 无效层级或拖拽自身，则不允许
  if (draggingLevel === 0 || dropLevel === 0 || draggingNode.key === dropNode.key) {
    return false;
  }

  // 规则 1: 拖拽的是一级节点 (Level 1)
  if (draggingLevel === 1) {
    if (dropLevel === 1) {
      // 目标也是一级节点: 只允许同级排序 (prev, next)
      if (type === 'inner') {
        // ElMessage.warning('一级菜单之间不能互相嵌套，只能同级排序。');
        return false; // 严格禁止放入内部
      }
      return true; //允许 prev/next
    } else { // dropLevel is 2 or other
      // 不允许一级节点拖到二级节点或其他非一级节点的位置
      // ElMessage.warning('一级菜单只能与其他一级菜单同级排序。');
      return false;
    }
  }

  // 规则 2: 拖拽的是二级节点 (Level 2)
  if (draggingLevel === 2) {
    if (dropLevel === 1) {
      // 目标是一级节点: 只允许放入内部 (inner)
      if (type === 'prev' || type === 'next') {
        // ElMessage.warning('二级菜单不能与一级菜单同级，请拖入一级菜单内部。');
        return false;
      }
      return true; // 允许 inner
    } else if (dropLevel === 2) {
      // 目标也是二级节点: 只允许同级排序 (prev, next)，不允许放入内部
      if (type === 'inner') {
        // ElMessage.warning('二级菜单不能再包含子菜单。');
        return false;
      }
      return true; // 允许 prev/next (同父或跨父的同级排序)
    } else { // dropLevel is other
        return false; // 不允许二级节点拖到其他未知层级
    }
  }

  return false; // 默认不通过，以防有未覆盖的逻辑
};

const handleDrop = async (draggingNode, dropNode, dropType, ev) => {
// 移除了参数类型: Node, Node, NodeDropType, DragEvents
if (dropType === 'none') {
  // 没有实际放置，不处理
  return;
}

ElMessage.info(`节点 "${draggingNode.data.label}" 已拖拽到 "${dropNode.data.label}" ${dropType === 'inner' ? '内部' : (dropType === 'before' ? '前面' : '后面')}`);

await nextTick();

const updates = [];

function collectUpdatesRecursive(nodes, parentId) { // 移除了 nodes 类型 MenuData[]
  nodes.forEach((node, index) => {
    updates.push({
      id: node.id,
      pid: parentId,
      sortOrder: index,
      label: node.label
    });
    if (node.subMenu && node.subMenu.length > 0) {
      collectUpdatesRecursive(node.subMenu, node.id);
    }
  });
}

collectUpdatesRecursive(treeNodeList.value, 0); // 假设根节点的 pid 为 0

if (updates.length > 0) {
  console.log('Sending updated menu structure to backend:', updates);
  try {
    const response = await axios.post("http://localhost:8080/updateMenusOrder", updates);
    if (response.data.code === 200) {
      ElMessage.success('菜单顺序已同步到后端');
      // 拖拽成功后，通常不需要 loadMenuTree()，因为前端 treeNodeList.value 已是最新。
      // loadMenuTree(); // 如果需要强制从后端同步
    } else {
      ElMessage.error(response.data.msg || '后端同步失败');
      loadMenuTree(); // 同步失败，最好从后端恢复数据
    }
  } catch (error) {
    console.error("Error updating menu order:", error);
    ElMessage.error('同步菜单顺序失败，请稍后重试');
    loadMenuTree(); // 网络错误等，也从后端恢复数据
  }
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