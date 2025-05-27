<template>
  <h2>商品信息</h2>
  <div style="text-align: left">
    <el-button type="primary" @click="openItemDialog">添加商品</el-button>
  </div>
  <!-- 添加商品信息的对话框 -->
  <el-dialog v-model="dialogItemVisible" width="60%">
    <div style="text-align: left">
      商品图片:<!--  上传商品图片控件  -->
      <el-upload action="http://localhost:8080/uploadImg" list-type="picture-card" :auto-upload="true" method="post"
        :on-success="handleAvatarSuccess">
        <el-icon>
          <Plus />
        </el-icon>

        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <el-icon><zoom-in /></el-icon>
              </span>
            </span>
          </div>
        </template>
      </el-upload>
    </div>
    <el-form :model="itemForm" label-width="120px" :inline="true">

      <el-form-item label="名称">
        <el-input v-model="itemForm.id" />
      </el-form-item>
      <el-form-item label="编号">
        <el-input v-model="itemForm.id" />
      </el-form-item>
      <el-form-item label="种类">
        <el-input v-model="itemForm.id" />
      </el-form-item>
      <el-form-item label="库存">
        <el-input v-model="itemForm.id" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-input v-model="itemForm.id" />
      </el-form-item>
      <el-form-item label="仓库">
        <el-input v-model="itemForm.id" />
      </el-form-item>
      <el-form-item label="供应商" style="width: 34%">
        <el-select v-model="itemForm.id" class="m-2" placeholder="请选择供应商">
          <el-option v-for="item in supplyList" :key="item.supplyId" :label="item.supplyName" :value="item.supplyId" />
        </el-select>
      </el-form-item>

      <el-form-item label="产地" style="width: 34%">
        <el-select v-model="itemForm.id" class="m-2" placeholder="请选择供产地">
          <el-option v-for="item in placeList" :key="item.placeId" :label="item.placeName" :value="item.placeId" />
        </el-select>

      </el-form-item>
      <el-form-item label="单位" style="width: 34%">
        <el-select v-model="itemForm.id" class="m-2" placeholder="请选择商品单位">
          <el-option v-for="item in unitList" :key="item.unitId" :label="item.unitName" :value="item.unitId" />
        </el-select>

      </el-form-item>
      <el-form-item label="进价">
        <el-input v-model="itemForm.id" />
      </el-form-item>
      <el-form-item label="售价">
        <el-input v-model="itemForm.id" />
      </el-form-item>
      <el-form-item label="会员价">
        <el-input v-model="itemForm.id" />
      </el-form-item>
      <el-form-item label="详细介绍" style="width: 72%">
        <el-input v-model="itemForm.id" type="text" />
      </el-form-item>
      <el-form-item label="生成日期">
        <el-input v-model="itemForm.id" />
      </el-form-item>
      <el-form-item label="保质期">
        <el-input v-model="itemForm.id" />
      </el-form-item>

    </el-form>

  </el-dialog>
  <!-- 图片预览的对话框 -->
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>

import { reactive, ref } from "vue";
import { Plus, ZoomIn } from '@element-plus/icons-vue'
import axios from "axios";

//定义对话框状态
const dialogItemVisible = ref(false);
//声明表单
const itemForm = reactive({
  id: 0
})

//定义函数打开添加商品对话框
function openItemDialog() {
  dialogItemVisible.value = true;
  //调用函数加载供应商列表
  loadSupplyList();
  //加载商品产地选项
  loadPlaceList();
  //加载商品单位选项
  queryUnitList();
}
//声明变量保存需要预览的图片路径
const dialogImageUrl = ref(null);
//预览图片对话框的状态
const dialogVisible = ref(false);
function handlePictureCardPreview(file) {
  console.log("======================" + file);
  dialogImageUrl.value = file.url;
  dialogVisible.value = true
}
//定义图片上传成功后的回调函数
function handleAvatarSuccess(path) {
  console.log(path)
}
//声明供应商列表
const supplyList = ref([]);
function loadSupplyList() {
  axios.get("http://localhost:8080/supplyList")
    .then((response) => {
      supplyList.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    })
}
//声明产地列表集合数据
const placeList = ref([]);
function loadPlaceList() {
  axios.get("http://localhost:8080/placeList")
    .then((response) => {
      placeList.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}
//声明单位集合
const unitList = ref([]);
function queryUnitList() {
  axios.get("http://localhost:8080/unitList")
    .then((response) => {
      unitList.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>


<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>