<template>
    <h2>添加菜单</h2>
    <div style="text-align: left">
      <h4>选择新增节点的父节点:</h4>
      <el-tree
          :props="props"
          :data="treeNodeList"
          node-key="id"
          ref="treeRef"
          @node-click="hanldNodeClick"
          highlight-current="true"
      />
  
    </div>
    <hr/>
  <!-- 添加表单控件 -->
    <el-form :model="menuForm" label-width="120px">
      <el-form-item label="菜单名称">
        <el-input v-model="menuForm.label" style="width: 50%"/>
      </el-form-item>
  
      <el-form-item>
        <el-button type="primary" @click="subMenuForm">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script setup>
  //页面加载发送ajax请求
  import {onMounted, reactive, ref} from "vue";
  import axios from "axios";
  import {ElMessage} from "element-plus";
  //定义tree控件的配置参数
  const props={
    id:'id',
    label:'label',
    children:'subMenu'
  };
  //定义tree控件节点的集合
  const treeNodeList=ref([]);
  //定义添加菜单的form表单
  const menuForm=reactive({
    label:'',
    component: null
  })
  //发送ajax请求，加载菜单节点数
  function loadMenuTree(){
    axios.get("http://localhost:8080/listMenus")
        .then((response)=>{
          treeNodeList.value=response.data;
        })
        .catch((error)=>{
          console.log(error);
        })
  }
  onMounted(function(){
    loadMenuTree()
  });

  //声明变量保存当前选中树节点的id
  var id=0;
  //定义tree控件节点的点击回调函数
  function hanldNodeClick(node){
    console.log(node);
    id=node.id;
  }
  //发送保存菜单的请求
  function subMenuForm(){
    if(id==0){
      ElMessage("请选择当前新增菜单节点的父节点......");
      return;
    }
    menuForm.pid=id; //指定新增节点的父id
    //ElMessage("发送ajax请求包擦新增节点......");
    axios.post("http://localhost:8080/saveMenus",menuForm)
    .then((response)=>{
      if(response.data.code==200){
        loadMenuTree();//重新渲染树
      }
      ElMessage(response.data.msg);
    })
    .catch((error)=>{
      console.log(error);
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
</style>