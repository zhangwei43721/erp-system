<template>
  <h2>管理菜单</h2>
  <div style="text-align: left">
    <h4>选择新增节点的父节点（支持拖拽调整顺序）</h4>
    <el-tree ref="treeRef" :allow-drag="allowDrag" :allow-drop="allowDrop" :data="treeNodeList"
      :expand-on-click-node="false" :highlight-current="true" :props="props" default-expand-all draggable node-key="id"
      @node-click="hanldNodeClick" @node-drop="handleDrop">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <a style="color: var(--el-color-primary)" @click.stop="openEditDialog(data)"> 修改 </a>
            <a style="margin-left: 8px; color: var(--el-color-danger)" @click.stop="delMenus(node, data)"> 删除 </a>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
  <hr />
  <!-- 添加表单控件 -->
  <el-form :model="menuForm" label-width="120px">
    <el-form-item label="新增菜单名称">
      <el-input v-model="menuForm.label" style="width: 50%" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="subMenuForm">保存</el-button>
      <el-button @click="resetForm">重置表单</el-button>
    </el-form-item>
  </el-form>
  <!-- 修改弹窗 -->
  <el-dialog v-model="dialogVisible" title="修改菜单" width="30%">
    <el-form :model="editForm" label-width="120px">
      <el-form-item label="菜单名称">
        <el-input v-model="editForm.label" style="width: 50%" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="updateMenu">更新</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import emitter from "@/eventBus";
import { menuApi } from "@/api/menu";

const props = {
  label: 'label',
  children: 'subMenu'
};

const treeNodeList = ref([]);
const treeRef = ref(null);

const menuForm = reactive({
  id: null,
  label: '',
  component: null,
  pid: 0
});

const dialogVisible = ref(false);
const editForm = reactive({
  id: null,
  label: '',
  component: null
});

function loadMenuTree() {
  menuApi.getMenuTree()
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

let currentSelectedPidForAdd = 0;

function hanldNodeClick(data) {
  currentSelectedPidForAdd = data.id;
  // console.log("Selected parent for new node:", currentSelectedPidForAdd);
}

function openEditDialog(data) {
  editForm.id = data.id;
  editForm.label = data.label;
  editForm.component = data.component;
  dialogVisible.value = true;
}

function updateMenu() {
  menuApi.updateMenu(editForm)
    .then((response) => {
      if (response.data.code === 200) {
        loadMenuTree();
        dialogVisible.value = false;
        emitter.emit('menu-structure-changed'); // <--- 触发事件
      }
      ElMessage({
        type: response.data.code === 200 ? 'success' : 'error',
        message: response.data.message || (response.data.code === 200 ? '更新成功' : '更新失败')
      });
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error('修改失败，请稍后重试');
    });
}

function resetForm() {
  // 重置表单数据
  menuForm.label = '';
  menuForm.component = null;
  currentSelectedPidForAdd = 0;

  // 清除树选择
  if (treeRef.value) {
    treeRef.value.setCurrentKey(null);
  }

  ElMessage.info('已重置表单');
}

function subMenuForm() {
  if (!menuForm.label.trim()) {
    ElMessage.warning("菜单名称不能为空");
    return;
  }
  menuForm.pid = currentSelectedPidForAdd;
  menuApi.saveMenu(menuForm)
    .then((response) => {
      if (response.data.code === 200) {
        loadMenuTree();
        resetForm();
        emitter.emit('menu-structure-changed'); // <--- 触发事件
      }
      ElMessage({
        type: response.data.code === 200 ? 'success' : 'error',
        message: response.data.message || (response.data.code === 200 ? '添加成功' : '添加失败')
      });
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error('添加失败，请稍后重试');
    });
}

async function delMenus(node, data) {
  if (data.subMenu && data.subMenu.length > 0) {
    ElMessage.warning(data.label + ", 节点存在子节点不能删除!");
    return;
  }
  try {
    await ElMessageBox.confirm(
      `确定要删除菜单 "${data.label}" 吗?`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    );
    const response = await menuApi.deleteMenu(data.id);
    if (response.data.code === 200) {
      loadMenuTree();
      emitter.emit('menu-structure-changed'); // <--- 触发事件
    }
    ElMessage({ type: response.data.code === 200 ? 'success' : 'error', message: response.data.message });
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      console.error("删除失败:", error);
      ElMessage.error('删除操作失败');
    } else {
      ElMessage.info('已取消删除');
    }
  }
}

// --- 拖拽相关方法 ---
const allowDrag = () => {
  return true;
};

// 辅助函数，用于getNodeLevel
const isPidOfLevelOneNode = (pidToCheck) => {
  if (!treeNodeList.value || treeNodeList.value.length === 0) return false;
  return treeNodeList.value.some(levelOneNode => levelOneNode.id === pidToCheck);
};

const getNodeLevel = (node) => {
  if (!node || !node.data || typeof node.data.pid === 'undefined') return 0;
  if (node.data.pid === 0) return 1; // 直接判断pid是否为0
  if (node.data.pid !== 0 && isPidOfLevelOneNode(node.data.pid)) { // isPidOfLevelOneNode 遍历 treeNodeList
    return 2;
  }
  return 0; // 未知或无效层级
};

const allowDrop = (draggingNode, dropNode, type) => {
  const draggingLevel = getNodeLevel(draggingNode);
  const dropLevel = getNodeLevel(dropNode);

  // 节点是否有子节点 (基于 draggingNode.data.subMenu，这依赖于后端返回的数据结构)
  // 或者直接检查 draggingNode (Node对象) 的 childNodes
  const draggingNodeHasChildren = draggingNode.childNodes && draggingNode.childNodes.length > 0;
  // 基本校验：无效层级或拖拽自身
  if (draggingLevel === 0 || dropLevel === 0 || draggingNode.key === dropNode.key) {
    return false;
  }

  // --- 规则开始 ---

  // 规则1: 拖拽一级节点 (父节点)
  if (draggingLevel === 1) {
    if (dropLevel === 1) { // 目标也是一级节点
      if (type === 'inner') {
        // 条件：允许一级节点A放入一级节点B内部，前提是A没有子节点
        // 此时A将从一级降为二级
        return !draggingNodeHasChildren;
        // 允许无子节点的一级节点成为另一一级节点的子节点
      }
      return true; // 允许一级节点之间同级排序 (prev/next)
    }
    if (dropLevel === 2) { // 目标是二级节点
      // 通常不允许一级节点直接操作二级节点来改变层级或排序，除非特定场景
      // 例如：如果想把一级节点P1放到二级节点S1的父节点下，与S1同级，
      // 这种情况应该通过拖拽P1到S1的父节点P2的 prev/next/inner 来实现。
      // 这里先保守禁止，一级节点不能直接以二级节点为目标改变结构。
      return false;
    }
  }

  // 规则2: 拖拽二级节点 (子节点)
  if (draggingLevel === 2) {
    if (dropLevel === 1) { // 目标是一级节点 (父节点)
      // 二级节点可以拖入一级节点内部成为其子节点 (type === 'inner')
      // 二级节点也可以拖到一级节点的前后，实现升级为新的一级节点
      if (type === 'prev' || type === 'next') {
        // 允许二级节点升级为一级节点，与目标一级节点同级
        return true;
      }
      // type === 'inner'，成为其子节点
      return true;
    }
    if (dropLevel === 2) { // 目标也是二级节点
      if (type === 'inner') {
        // 严格禁止二级节点下面再有子节点 (防止三级)
        return false;
      }
      // 允许二级节点之间同级排序 (prev/next)
      return true;
    }
  }

  return false; // 其他未明确定义的拖拽均不允许
};

const handleDrop = async (draggingNode, dropNode, dropType) => {
  if (dropType === 'none') {
    return;
  }

  // ElMessage.info(`节点 "${draggingNode.data.label}" 已拖拽到 "${dropNode.data.label}" ${dropType}`);
  // Element Plus 的 el-tree 会在触发此事件前，在内部更新其数据模型 (treeNodeList.value 的结构)。
  // 我们需要确保基于这个新结构，节点的 pid 也被正确更新。

  await nextTick(); // 等待DOM和el-tree内部数据更新

  // 重新构建树的PID和排序信息，并直接更新到 treeNodeList.value 中的节点
  // 这一步至关重要，确保后续的 getNodeLevel 能获取到最新的 pid
  const updateNodePidsAndCollectChanges = (nodes, parentId) => {
    const changes = [];
    nodes.forEach((nodeData, index) => {
      // 直接更新前端数据中的 pid 和 sortOrder (如果需要)
      nodeData.pid = parentId;

      changes.push({
        id: nodeData.id,
        pid: parentId,
        sortOrder: index,
        label: nodeData.label
      });

      if (nodeData.subMenu && nodeData.subMenu.length > 0) {
        // 递归调用，并将其子节点收集的变更合并
        changes.push(...updateNodePidsAndCollectChanges(nodeData.subMenu, nodeData.id));
      } else if (!nodeData.subMenu) {
        // 确保空的父节点在拖拽后仍然有 subMenu: []
        nodeData.subMenu = [];
      }
    });
    return changes;
  };

  // 基于当前 treeNodeList.value (el-tree 拖拽后更新的结构) 来更新 PID 并收集变更
  const updatesToSendToBackend = updateNodePidsAndCollectChanges(treeNodeList.value, 0);

  if (updatesToSendToBackend.length > 0) {
    try {
      const response = await menuApi.updateMenuOrder(updatesToSendToBackend);
      if (response.data.code === 200) {
        ElMessage.success('菜单顺序已同步到后端');
        emitter.emit('menu-structure-changed'); // <--- 触发事件
        // 通常不需要刷新，因为 treeNodeList.value 已是最新。
        // 若后端有其他副作用或为了绝对保险，可以取消注释下一行
        // loadMenuTree();
      } else {
        ElMessage.error(response.data.message || '后端同步失败，正在还原...');
        loadMenuTree(); // 同步失败，从后端恢复
      }
    } catch (error) {
      console.error("Error updating menu order:", error);
      ElMessage.error('同步菜单顺序失败，正在还原...');
      loadMenuTree(); // 网络错误等，也从后端恢复
    }
  }
};
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
</style>