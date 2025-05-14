<script setup>
import AddCustomer from "@/views/AddCustomer.vue";
import ListCustomer from "@/views/ListCustomer.vue";
import AddSellJh from "@/views/AddSellJh";
import { onMounted, ref } from "vue";
import axios from "axios";
import { markRaw, shallowRef } from "vue";
// 声明数组保存所有组件，按后端component值顺序映射
const views = [
  markRaw(AddCustomer),
  markRaw(ListCustomer),
  markRaw(AddSellJh),
  markRaw(AddSellJh),
  markRaw(AddSellJh),
];

const currentComponent = shallowRef(views[0]);
const menus = ref([]);

/* menu组件选中叶子节点触发的函数，参数index：菜单节点的id */
const handlerSelect = function (index) {
  console.log("Selected index:", index); // 调试 id
  axios
    .get("http://localhost:8080/compIndex?id=" + index)
    .then((response) => {
      console.log("Response:", response.data); // 调试后端返回的 component 值
      const componentIndex = response.data;
      currentComponent.value = views[componentIndex];
    })
    .catch((error) => {
      console.log("Error:", error); // 捕获并显示错误
    });
};

onMounted(() => {
  axios
    .get("http://localhost:8080/listMenus")
    .then((response) => {
      menus.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="top">ERP-ikun小组</el-header>
      <el-container>
        <el-aside width="240px" class="left">
          系统菜单
          <el-menu class="el-menu-vertical-demo" @select="handlerSelect">
            <el-sub-menu v-for="menu in menus" :index="menu.id.toString()">
              <template #title>
                <span>{{ menu.label }}</span>
              </template>
              <el-menu-item
                v-for="subMenu in menu.subMenu"
                :index="subMenu.id.toString()"
              >
                {{ subMenu.label }}
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main class="right">
          <component :is="currentComponent"></component>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.top {
  background-color: azure;
}
.left {
  background-color: blanchedalmond;
  height: 600px;
}
.right {
  background-color: cornsilk;
}
</style>