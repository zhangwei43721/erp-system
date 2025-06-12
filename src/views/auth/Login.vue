<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">ERP系统登录</h2>
      <el-form :model="form" :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="User"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock"
            show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="handleLogin" :loading="loading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-footer">
        <el-link type="primary" @click="goToRegister">注册账号</el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api/user'

const router = useRouter()
const loginForm = ref(null)
const loading = ref(false)

const form = ref({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = () => {
  loginForm.value.validate(valid => {
    if (!valid) return

    loading.value = true
    // 调用登录API
    userApi.login(form.value.username, form.value.password)
      .then(response => {
        const token = response.data.data.token
        const userId = response.data.data.userId
        const username = response.data.data.username

        // 保存token和用户信息到localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('userId', userId)
        localStorage.setItem('username', username || form.value.username)

        router.push('/')
        ElMessage.success('登录成功')
      })
      .catch(error => {
        ElMessage.error('登录失败: ' + (error.response?.data?.data?.message || error.response?.data?.message || error.message))
      })
      .finally(() => {
        loading.value = false
      })
  })
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f7fa;
}

.login-card {
  width: 400px;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #409eff;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
}

.login-footer {
  text-align: right;
  margin-top: 10px;
}
</style>