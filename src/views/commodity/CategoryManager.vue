<template>
  <h2>商品类目</h2>
<!-- tree控件 -->
  <el-tree
      :props="config"
      :data="categoryList"
      default-expand-all
      node-key="id"
      ref="treeRef"
      highlight-current="true"
      :expand-on-click-node="false"
      @node-click="handleClickNode">
    <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <a @click.stop="showCategory(node,data)" > 修改 </a>
          </span>
        </span>
          <span>
            <a @click.stop="deleteCategory(node,data)" > 删除 </a>
          </span>
    </template>
  </el-tree>
<hr/>
<!-- 添加商品类目表单 -->
  <!-- 对话框中添加form -->
  <el-form :model="categoryForm" label-width="120px">
    <el-form-item label="分类编号">
      <el-input v-model="categoryForm.isbn" style="width: 80%"/>
    </el-form-item>
    <el-form-item label="分类名称">
      <el-input v-model="categoryForm.cateName" style="width: 80%"/>
    </el-form-item>
    <el-form-item label="分类描述">
      <el-input v-model="categoryForm.remark" style="width: 80%"/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="saveCategoryForm">保存</el-button>
      <el-button>清空</el-button>
    </el-form-item>
  </el-form>

</template>

<script setup>

import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";
  //声明tree的配置
  const config={
    id:'id',
    label:'label',
    children:'children'
  };
  //声明tree的引用
  const treeRef=ref(null);
  //声明树节点数据
  const categoryList=ref([]);

  //发送请求加载树
  function queryCategoryTree(){
    axios.get("http://localhost:8080/categoryList")
        .then((response)=>{
          categoryList.value=response.data;
        })
        .catch((error)=>{
          console.log(error);
        })
  }

  //加载发送请求，加载tree
  onMounted(function(){
    queryCategoryTree();
  });
//声明表单
const categoryForm=reactive({
  id:0,
  isbn:'',
  cateName:'',
  remark:''
})
var pnode=null;//记录当前选中的节点对象
//定义树节点的单击回调函数
function handleClickNode(node){
  //console.log(node.children);
  pnode=node;
}
//提交发送商品类目数据
function saveCategoryForm(){
  //默认保存处理增加请求的接口
  var url="http://localhost:8080/saveCategory";

  if(categoryForm.id==0){ //判断表单中是否存在id，确认是添加请求还是更新请求
    if(!pnode){
      ElMessage("必选选中某个父节点......");
      return;
    }
    if(pnode.children.length==0){
      ElMessage("只能选中一级父节点......");
      return;
    }
    categoryForm.pid=pnode.id; //指定当前新增节点的父节点
  }else{ //更新请求接口
    url="http://localhost:8080/updateCategory";
  }
  //发送ajax请求保存商品类目数据
  axios.post(url,categoryForm)
  .then((response)=>{
    if(response.data.code==200){
      queryCategoryTree();
      //清空表单
      categoryForm.isbn='';
      categoryForm.cateName='';
      categoryForm.remark='';
      categoryForm.id=0;
      pnode=null;
    }
    ElMessage(response.data.message);
  })
  .catch((error)=>{})
}
//定义函数实现商品类目树的回显
function showCategory(node,data){
  //通过id发送ajax请求
  axios.get("http://localhost:8080/loadCategory/"+data.id)
  .then((response)=>{
    //将响应数据赋值给表单
    categoryForm.isbn=response.data.isbn;
    categoryForm.cateName=response.data.cateName;
    categoryForm.remark=response.data.remark;
    categoryForm.id=data.id;
  })
  .catch((error)=>{
    console.log(error);
  });
}
//定义函数实现商品类目的删除
function deleteCategory(node,data){
  //通过id发送ajax请求
  axios.get("http://localhost:8080/deleteCategory/"+data.id)
  .then((response)=>{
    if(response.data.code==200){
      queryCategoryTree();
    }
    ElMessage(response.data.message);
  })
  .catch((error)=>{
    console.log(error);
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
</style>