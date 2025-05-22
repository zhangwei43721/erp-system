<template>
  <h2>角色管理</h2>
  <div style="text-align: left">
    <el-button type="primary" @click="openRoleDialog">添加角色</el-button>
  </div>
  <el-table :data="rolerList" stripe style="width: 100%">
    <el-table-column prop="id" label="编号" width="180" />
    <el-table-column label="角色" width="260">
      <template #default="scope">
        <el-input v-if="scope.row.edit" v-model="scope.row.rname"></el-input>
        <span v-else>{{ scope.row.rname }}</span>
      </template>

    </el-table-column>
    <el-table-column label="描述">
      <template #default="scope">
        <el-input v-if="scope.row.edit" v-model="scope.row.rdesc"></el-input>
        <span v-else>{{ scope.row.rdesc }}</span>
      </template>
    </el-table-column>
    <el-table-column align="right">
      <template #header>
        <span>操作</span>
      </template>
      <template #default="scope">
        <el-button size="mini" @click="handleAuthorize(scope.row)">授权</el-button>
        <el-button v-if="!scope.row.edit" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button v-else size="mini" type="success" @click="handleSave(scope.row)">保存</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <hr />
  <el-pagination small background :page-size="10" :pager-count="10" layout="prev, pager, next" :total="total"
    class="mt-4" @current-change="rolerPageChange" />
  <!-- 角色信息对话框 -->
  <!-- 回显客户信息的对话框 -->
  <el-dialog v-model="dialogRoleVisible" width="80%">
    <h2>角色信息</h2>

    <!-- 对话框中添加form -->
    <el-form :model="rolerForm" label-width="120px">
      <el-form-item label="角色名称">
        <el-input v-model="rolerForm.rname" style="width: 80%" />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="rolerForm.rdesc" style="width: 80%" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveRoleForm">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
  <!--授权对话框-->
  <el-dialog title="角色授权" v-model="authDialogVisible" width="40%">
    <div style="text-align: left">
      <h4>请选择该角色可访问的菜单</h4>
      <el-tree
        :props="props"
        :data="treeNodeList"
        node-key="id"
        show-checkbox
        default-expand-all
        ref="treeRef"
        :highlight-current="true"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
    </div>
    <template #footer>
      <el-button @click="authDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveRoleAuth">保存授权</el-button>
    </template>
  </el-dialog>

</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
//定义角色集合列表数据
const rolerList = ref([]);
const total = ref(0);

// 树形菜单相关数据
const treeNodeList = ref([]);
const treeRef = ref(null);
const props = {
  label: 'label',
  children: 'subMenu'
};

// 授权对话框状态
const authDialogVisible = ref(false);
const currentRoleId = ref(null);
const currentRoleName = ref('');

//发送请求加载角色列表
function queryRoleList(pageNum) {
  axios.get("http://localhost:8080/rolerList?pageNum=" + pageNum)
    .then((response) => {
      rolerList.value = response.data.rolerList;
      total.value = response.data.total;
    })
    .catch((error) => {
      console.log(error);
    });
}
//加载页码调用函数
onMounted(function () {
  queryRoleList(1);
})

//定义分页按钮函数
function rolerPageChange(pageNum) {
  queryRoleList(pageNum);
}
//定义函数实现表格编辑效果
function handleEdit(row) {
  row.edit = true;
}
//定义函数实现编辑后保存
function handleSave(row) {
  //row.edit=false;
  //console.log(row);
  //发送ajax请求进行数据更新
  axios.post("http://localhost:8080/updateRoler", row)
    .then((response) => {
      if (response.data.code == 200) {
        row.edit = false;
      }
      ElMessage(response.data.msg);
    })
    .catch((error) => {
      console.log(error);
    });
}

// 处理授权按钮点击事件
function handleAuthorize(row) {
  currentRoleId.value = row.id;
  currentRoleName.value = row.rname;
  loadMenuTree();
  loadRoleMenus(row.id);
  authDialogVisible.value = true;
}

// 加载菜单树
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

// 加载角色已有的菜单权限
function loadRoleMenus(roleId) {
  axios.get(`http://localhost:8080/listRoleMenus?roleId=${roleId}`)
    .then((response) => {
      // 等待树加载完成后再设置选中状态
      setTimeout(() => {
        if (treeRef.value) {
          // 清除之前的选择
          treeRef.value.setCheckedKeys([]);
          
          // 设置新的选中项
          if (response.data && response.data.length > 0) {
            // 先找出只包含叶子节点的ID
            const leafNodeIds = filterLeafNodeIds(response.data, treeNodeList.value);
            // 只选中叶子节点，父节点会自动变为半选中状态
            treeRef.value.setCheckedKeys(leafNodeIds);
          }
        }
      }, 100);
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error("角色菜单权限加载失败");
    });
}

// 递归检查节点ID是否为叶子节点，并过滤出叶子节点ID
function filterLeafNodeIds(ids, nodes) {
  // 存储所有非叶子节点的ID
  const parentIds = new Set();
  
  // 递归收集所有非叶子节点ID
  function collectParentIds(nodeList) {
    if (!nodeList || nodeList.length === 0) return;
    
    for (const node of nodeList) {
      if (node.subMenu && node.subMenu.length > 0) {
        // 这是一个父节点
        parentIds.add(node.id);
        // 递归检查子节点
        collectParentIds(node.subMenu);
      }
    }
  }
  
  // 收集所有父节点ID
  collectParentIds(nodes);
  
  // 过滤出只有叶子节点的ID
  return ids.filter(id => !parentIds.has(id));
}

// 保存角色授权
function saveRoleAuth() {
  if (!treeRef.value || !currentRoleId.value) {
    ElMessage.warning("请先选择角色和菜单");
    return;
  }
  
  // 获取选中的节点和半选中的节点
  const checkedKeys = treeRef.value.getCheckedKeys();
  const halfCheckedKeys = treeRef.value.getHalfCheckedKeys();
  
  // 合并所有需要的权限ID
  const allKeys = [...checkedKeys, ...halfCheckedKeys];
  
  const authData = {
    roleId: currentRoleId.value,
    menuIds: allKeys
  };
  
  axios.post("http://localhost:8080/saveRoleMenus", authData)
    .then((response) => {
      if (response.data.code === 200) {
        ElMessage.success("授权成功");
        authDialogVisible.value = false;
      } else {
        ElMessage.error(response.data.msg || "授权失败");
      }
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error("授权失败，请稍后重试");
    });
}

//定义函数实现删除角色
function handleDelete(row) {
  ElMessageBox.confirm('确认要删除该角色吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    axios.post("http://localhost:8080/deleteRoler", row)
      .then((response) => {
        if (response.data.code == 200) {
          queryRoleList(1);
        }
        ElMessage(response.data.msg);
      })
      .catch((error) => {
        console.log(error);
        ElMessage("删除失败，请稍后重试");
      });
  }).catch(() => {
    ElMessage("已取消删除");
  });
}

//定义对话框状态
const dialogRoleVisible = ref(false);
//定义form表单
const rolerForm = reactive({
  rname: '',
  rdesc: ''
});
//定义打开添加角色信息的对话框
function openRoleDialog() {
  dialogRoleVisible.value = true;
}
//定义函数提交角色信息保存的ajax请求
function saveRoleForm() {
  axios.post("http://localhost:8080/saveRoler", rolerForm)
    .then((response) => {
      if (response.data.code == 200) {
        dialogRoleVisible.value = false;
        rolerForm.rname = '';
        rolerForm.rdesc = '';
        queryRoleList(1);
      }
      ElMessage(response.data.msg);
    })
    .catch((error) => {
      console.log(error);
    })
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