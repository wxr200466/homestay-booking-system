<template>
  <div class="register-container">
    <div class="register-background"></div>
    <div class="register-wrapper">
      <el-card class="register-card" shadow="hover">
        <div class="register-header">
          <h2>创建新账户</h2>
          <p>注册账号，开启您的民宿之旅</p>
        </div>
        
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          label-width="0"
          size="large"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名(3-20位)"
              :prefix-icon="User"
              clearable
            />
          </el-form-item>
          
          <el-form-item prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="请输入手机号"
              :prefix-icon="Iphone"
              clearable
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码(6-20位)"
              :prefix-icon="Lock"
              show-password
              clearable
            />
          </el-form-item>
          
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
              :prefix-icon="Lock"
              show-password
              clearable
            />
          </el-form-item>
          
          <el-form-item prop="realName">
            <el-input
              v-model="registerForm.realName"
              placeholder="请输入真实姓名（选填）"
              :prefix-icon="UserFilled"
              clearable
            />
          </el-form-item>
          
          <el-form-item>
            <div class="register-agreement">
              <el-checkbox v-model="agreementChecked">
                我已阅读并同意
                <el-link type="primary" :underline="false">《用户协议》</el-link>
                和
                <el-link type="primary" :underline="false">《隐私政策》</el-link>
              </el-checkbox>
            </div>
          </el-form-item>
          
          <el-form-item prop="captcha">
            <div class="captcha-input">
              <el-input
                v-model="registerForm.captcha"
                placeholder="请输入验证码"
                :prefix-icon="Key"
                clearable
                style="flex: 1; margin-right: 10px;"
              />
              <el-button
                type="primary"
                :disabled="captchaDisabled"
                @click="getCaptcha"
                plain
              >
                {{ captchaText }}
              </el-button>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              @click="handleRegister"
              :loading="loading"
              :disabled="!agreementChecked"
              size="large"
              style="width: 100%;"
            >
              {{ loading ? '注册中...' : '立即注册' }}
            </el-button>
          </el-form-item>
          
          <el-form-item>
            <div class="register-footer">
              已有账号？
              <el-link type="primary" @click="$router.push('/login')" :underline="false">
                立即登录
              </el-link>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
      
      <div class="register-copyright">
        © 2025 民宿预约系统 毕业设计项目 | 作者:wxr200466
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  User, 
  Lock, 
  Iphone, 
  UserFilled, 
  Key 
} from '@element-plus/icons-vue'

const router = useRouter()

const registerFormRef = ref(null)
const loading = ref(false)
const agreementChecked = ref(true)
const captchaDisabled = ref(false)
const captchaCountdown = ref(0)

const registerForm = reactive({
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
  realName: '',
  captcha: '123456' // 测试用固定验证码
})

// 验证码按钮文本
const captchaText = computed(() => {
  if (captchaCountdown.value > 0) {
    return `${captchaCountdown.value}秒后重新获取`
  }
  return '获取验证码'
})

// 自定义验证规则
const validateUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入用户名'))
  } else if (value.length < 3 || value.length > 20) {
    callback(new Error('用户名长度在3-20个字符'))
  } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
    callback(new Error('用户名只能包含中文、英文、数字和下划线'))
  } else {
    callback()
  }
}

const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 6 || value.length > 20) {
    callback(new Error('密码长度在6-20个字符'))
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
    callback(new Error('密码需包含大小写字母和数字'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请确认密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [{ validator: validateUsername, trigger: 'blur' }],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

// 获取验证码
const getCaptcha = () => {
  if (!registerForm.phone) {
    ElMessage.warning('请输入手机号')
    return
  }
  
  captchaDisabled.value = true
  captchaCountdown.value = 60
  
  const timer = setInterval(() => {
    captchaCountdown.value--
    if (captchaCountdown.value <= 0) {
      clearInterval(timer)
      captchaDisabled.value = false
    }
  }, 1000)
  
  // 模拟发送验证码
  ElMessage.success('验证码已发送到您的手机:123456')
}

// 注册提交
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    const valid = await registerFormRef.value.validate()
    if (!valid) return
    
    if (!agreementChecked.value) {
      ElMessage.warning('请同意用户协议和隐私政策')
      return
    }
    
    loading.value = true
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟成功响应
    ElMessage.success({
      message: '注册成功！欢迎加入民宿预约系统',
      duration: 2000
    })
    
    // 跳转到登录页
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    
  } catch (error) {
    ElMessage.error({
      message: '注册失败：' + (error.message || '请检查表单信息'),
      duration: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 20px;
}

.register-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  z-index: -1;
}

.register-wrapper {
  width: 100%;
  max-width: 480px;
}

.register-card {
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #2c3e50;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.register-header p {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
}

.register-agreement {
  font-size: 14px;
  color: #5a6c7d;
}

.register-agreement .el-checkbox {
  margin-right: 5px;
}

.captcha-input {
  display: flex;
  align-items: center;
}

.register-footer {
  text-align: center;
  color: #7f8c8d;
  font-size: 14px;
}

.register-copyright {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin-top: 20px;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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

:deep(.el-button.is-disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

:deep(.el-link) {
  font-size: 14px;
}
</style>
