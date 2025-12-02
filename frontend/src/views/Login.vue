
<template>
  <div class="login-container">
    <div class="login-background"></div>
    <div class="login-wrapper">
      <el-card class="login-card" shadow="hover">
        <div class="login-header">
          <h2>民宿预约系统</h2>
          <p>欢迎回来，请登录您的账户</p>
        </div>
        
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-width="0"
          size="large"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              clearable
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              clearable
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          
          <el-form-item>
            <div class="login-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              @click="handleLogin"
              :loading="loading"
              size="large"
              style="width: 100%;"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
          
          <el-form-item>
            <div class="login-divider">
              <span>其他登录方式</span>
            </div>
          </el-form-item>
          
          <el-form-item>
            <div class="social-login">
              <el-button class="social-btn wechat" circle>
                <svg-icon icon-class="wechat" />
              </el-button>
              <el-button class="social-btn qq" circle>
                <svg-icon icon-class="qq" />
              </el-button>
              <el-button class="social-btn weibo" circle>
                <svg-icon icon-class="weibo" />
              </el-button>
            </div>
          </el-form-item>
          
          <el-form-item>
            <div class="login-footer">
              还没有账号？
              <el-link type="primary" @click="$router.push('/register')" :underline="false">
                立即注册
              </el-link>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
      
      <div class="login-copyright">
        © 2025 民宿预约系统 毕业设计项目 | 作者:wxr200466
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loading = ref(false)
const rememberMe = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符', trigger: 'blur' }
  ]
}

// 检查本地存储的记住我
onMounted(() => {
  const savedUsername = localStorage.getItem('savedUsername')
  if (savedUsername) {
    loginForm.username = savedUsername
    rememberMe.value = true
  }
})

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return
    
    loading.value = true
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟响应数据
    const mockResponse = {
      code: 200,
      data: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-jwt-token',
        userInfo: {
          id: 1,
          username: loginForm.username,
          realName: '测试用户',
          phone: '13800138000',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          role: 0, // 0-普通用户
          status: 1 //
                  }
      },
      message: '登录成功'
    }
    
    // 保存到Pinia store
    userStore.setToken(mockResponse.data.token)
    userStore.setUserInfo(mockResponse.data.userInfo)
    
    // 记住我功能
    if (rememberMe.value) {
      localStorage.setItem('savedUsername', loginForm.username)
    } else {
      localStorage.removeItem('savedUsername')
    }
    
    ElMessage.success({
      message: '登录成功！欢迎回来',
      duration: 2000
    })
    
    // 跳转到首页
    router.push('/')
    
  } catch (error) {
    ElMessage.error({
      message: '登录失败：' + (error.message || '用户名或密码错误'),
      duration: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: -1;
}

.login-wrapper {
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.login-card {
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #2c3e50;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.login-header p {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.login-divider {
  display: flex;
  align-items: center;
  color: #bdc3c7;
  font-size: 14px;
  margin: 10px 0;
}

.login-divider::before,
.login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e0e0e0;
  margin: 0 15px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-btn {
  width: 44px;
  height: 44px;
  font-size: 20px;
  border: none;
}

.social-btn.wechat {
  background: #07c160;
  color: white;
}

.social-btn.qq {
  background: #12b7f5;
  color: white;
}

.social-btn.weibo {
  background: #e6162d;
  color: white;
}

.social-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  transition: all 0.3s;
}

.login-footer {
  text-align: center;
  color: #7f8c8d;
  font-size: 14px;
}

.login-copyright {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin-top: 20px;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  font-weight: 500;
  height: 44px;
}

:deep(.el-button--primary:hover) {
  opacity: 0.9;
  transform: translateY(-1px);
  transition: all 0.3s;
}
</style>
