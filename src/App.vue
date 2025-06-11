<script setup>
import { onMounted, shallowRef, ref, computed, reactive } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { User, ArrowDown, Edit, SwitchButton, House } from '@element-plus/icons-vue';

import SidebarMenu from "@/components/layout/SidebarMenu.vue";
import useMenu from "@/composables/useMenu";
import { appApi } from '@/api/app';
import { userApi } from '@/api/user';

// 动态组件映射
const components = {
  0: () => import("@/views/Custom_Manage/AddCustomer.vue"),
  1: () => import("@/views/Custom_Manage/ListCustomer.vue"),
  2: () => import("@/views/Custom_Manage/ListAfterSale.vue"),
  3: () => import("@/views/Custom_Manage/ListCustOrder.vue"),
  4: () => import("@/views/Custom_Manage/AddSellJh.vue"),
  5: () => import("@/views/statistics/CustomerArea.vue"),
  6: () => import("@/views/statistics/YearMonthCount.vue"),
  7: () => import("@/views/Custom_Manage/ListSellJh.vue"),
  8: () => import("@/views/Sys_Manage/AddMenus.vue"),
  9: () => import("@/views/Sys_Manage/UserManager.vue"),
  10: () => import("@/views/Sys_Manage/RolerManager.vue"),
  14: () => import("@/views/commodity/CategoryManager.vue"),
  15: () => import("@/views/commodity/ItemManager.vue"),
  16: () => import("@/views/commodity/ListOutStore.vue"),
  17: () => import("@/views/commodity/BuyListManager.vue"),
  18: () => import("@/views/commodity/InStoreList.vue"),
  19: () => import("@/views/commodity/ListStore.vue"),
  20: () => import("@/views/statistics/EmployeeCount.vue"),
  21: () => import("@/views/statistics/AfterSaleCount.vue"),
  22: () => import("@/views/statistics/YearNumCount.vue")
};

// 状态
const currentComponent = shallowRef(null);
const error = ref(null);
const route = useRoute();
const router = useRouter();
const username = ref(localStorage.getItem('username') || '用户');
const profileFormRef = ref(null);

// 个人信息对话框状态
const profile = reactive({
  visible: false,
  loading: false,
  form: { username: '', oldPassword: '', newPassword: '', confirmPassword: '' }
});

// 表单验证
const rules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        value !== profile.form.newPassword 
          ? callback(new Error('两次输入的密码不一致'))
          : callback();
      }, 
      trigger: 'blur' 
    }
  ]
};

const { menus, isLoading, activeMenuId, hasMenus, setActiveMenu, initializeMenu } = useMenu();
const isAuthPage = computed(() => ['/login', '/register'].includes(route.path));

// 方法
const handleCommand = (command) => {
  if (command === 'logout') handleLogout();
  if (command === 'profile') showProfile();
};

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗?', '提示', { type: 'warning' });
    ['token', 'username', 'userId'].forEach(key => localStorage.removeItem(key));
    router.push('/login');
    ElMessage.success('已退出登录');
  } catch {}
};

const showProfile = () => {
  profile.form = { username: username.value, oldPassword: '', newPassword: '', confirmPassword: '' };
  profile.visible = true;
};

const submitProfile = () => {
  profileFormRef.value.validate(async (valid) => {
    if (!valid) return;
    
    profile.loading = true;
    try {
      await userApi.updateUser(profile.form);
      username.value = profile.form.username;
      localStorage.setItem('username', username.value);
      profile.visible = false;
      ElMessage.success('修改成功');
    } catch (error) {
      ElMessage.error(`修改失败: ${error.response?.data?.message || error.message}`);
    } finally {
      profile.loading = false;
    }
  });
};

const handlerSelect = async (menuId) => {
  error.value = null;
  try {
    const { data: compIndex } = await appApi.getComponentIndex(menuId);
    if (components[compIndex]) {
      currentComponent.value = (await components[compIndex]()).default;
      setActiveMenu(menuId);
    } else {
      error.value = `无法找到组件 (ID: ${menuId})`;
    }
  } catch {
    error.value = `加载组件失败 (ID: ${menuId})`;
  }
};

onMounted(async () => {
  const menuId = await initializeMenu();
  if (menuId) await handlerSelect(menuId);
});
</script>

<template>
  <div style="height: 100vh;">
    <router-view v-if="isAuthPage" />
    
    <el-container v-else style="height: 100%;">
      <!-- 顶部导航 -->
      <el-header style="background: var(--el-color-primary); color: white;">
        <div style="display: flex; align-items: center; justify-content: space-between; height: 100%;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <el-icon size="24"><House /></el-icon>
            <span style="font-size: 18px; font-weight: bold;">ERP管理系统</span>
            <el-tag size="small" type="info">ikun小组</el-tag>
          </div>
          
          <el-dropdown @command="handleCommand">
            <div style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px;">
              <el-icon><User /></el-icon>
              <span>{{ username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><Edit /></el-icon>
                  修改个人信息
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-container>
        <!-- 侧边栏 -->
        <SidebarMenu
          :menus="menus"
          :activeMenuId="activeMenuId"
          :isLoading="isLoading"
          :error="error"
          :hasMenus="hasMenus"
          @select="handlerSelect"
          @refresh="initializeMenu"
          @clear-error="error = null"
        />

        <!-- 主内容 -->
        <el-main>
          <el-skeleton v-if="isLoading" :rows="6" animated />
          
          <el-alert
            v-else-if="error"
            :title="error"
            type="error"
            show-icon
            closable
            @close="error = null"
          />

          <keep-alive v-else>
            <component :is="currentComponent" />
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
    
    <!-- 个人信息对话框 -->
    <el-dialog v-model="profile.visible" title="修改个人信息" width="400px">
      <div style="text-align: center; margin-bottom: 20px;">
        <el-avatar size="large" icon="User" />
        <div style="margin-top: 8px; font-weight: bold;">{{ username }}</div>
      </div>
      
      <el-form
        :model="profile.form"
        :rules="rules"
        ref="profileFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input v-model="profile.form.username" disabled />
        </el-form-item>
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="profile.form.oldPassword"
            type="password"
            show-password
            placeholder="请输入原密码"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="profile.form.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="profile.form.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="profile.visible = false">取消</el-button>
        <el-button type="primary" :loading="profile.loading" @click="submitProfile">
          确认修改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 顶部导航栏字体、图标、用户名等全部高对比度显示 */
.el-header {
  background: var(--el-color-primary);
  color: #fff;
}
.el-header .el-icon,
.el-header span,
.el-header .el-tag {
  color: #fff !important;
}
.el-header .el-tag {
  background: rgba(255,255,255,0.15);
  border: none;
}

/* 用户名、下拉触发区高对比度 */
.el-header [role="button"],
.el-header .el-dropdown {
  color: #fff !important;
}

/* 个人信息弹窗头像和用户名 */
.el-dialog .el-avatar {
  background: var(--el-color-primary, #409EFF);
  color: #fff;
}
</style>