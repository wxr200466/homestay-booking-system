import request from './request'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

// 用户API接口
const userApi = {
  // 用户登录
  login(data) {
    return request({
      url: '/api/user/login',
      method: 'post',
      data
    })
  },
  
  // 用户注册
  register(data) {
    return request({
      url: '/api/user/register',
      method: 'post',
      data
    })
  },
  
  // 获取用户信息
  getUserInfo() {
    return request({
      url: '/api/user/info',
      method: 'get'
    })
  },
  
  // 更新用户信息
  updateUserInfo(data) {
    return request({
      url: '/api/user/update',
      method: 'put',
      data
    })
  },
  
  // 修改密码
  changePassword(data) {
    return request({
      url: '/api/user/change-password',
      method: 'put',
      data
    })
  },
  
  // 上传头像
  uploadAvatar(formData) {
    return request({
      url: '/api/user/upload-avatar',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // 实名认证
  realNameAuth(data) {
    return request({
      url: '/api/user/real-name-auth',
      method: 'post',
      data
    })
  },
  
  // 获取验证码（登录/注册）
  getCaptcha(phone) {
    return request({
      url: '/api/user/captcha',
      method: 'get',
      params: { phone }
    })
  },
  
  // 忘记密码（发送重置邮件）
  forgotPassword(email) {
    return request({
      url: '/api/user/forgot-password',
      method: 'post',
      data: { email }
    })
  },
  
  // 重置密码
  resetPassword(data) {
    return request({
      url: '/api/user/reset-password',
      method: 'post',
      data
    })
  },
  
  // 退出登录
  logout() {
    return request({
      url: '/api/user/logout',
      method: 'post'
    })
  },
  
  // 获取用户列表（管理员）
  getUserList(params) {
    return request({
      url: '/api/admin/users',
      method: 'get',
      params
    })
  },
  
  // 更新用户状态（管理员）
  updateUserStatus(userId, status) {
    return request({
      url: `/api/admin/users/${userId}/status`,
      method: 'put',
      data: { status }
    })
  },
  
  // 更新用户角色（管理员）
  updateUserRole(userId, role) {
    return request({
      url: `/api/admin/users/${userId}/role`,
      method: 'put',
      data: { role }
    })
  },
  
  // 删除用户（管理员）
  deleteUser(userId) {
    return request({
      url: `/api/admin/users/${userId}`,
      method: 'delete'
    })
  }
}

// 封装的用户服务方法
const userService = {
  // 登录并初始化用户信息
  async loginAndInit(credentials) {
    try {
      const response = await userApi.login(credentials)
      
      if (response.code === 200) {
        const userStore = useUserStore()
        userStore.initUser(response.data)
        
        ElMessage.success({
          message: response.message || '登录成功',
          duration: 2000
        })
        
        return {
          success: true,
          data: response.data
        }
      } else {
        ElMessage.error({
          message: response.message || '登录失败',
          duration: 3000
        })
        
        return {
          success: false,
          message: response.message
        }
      }
    } catch (error) {
      console.error('登录错误:', error)
      
      let errorMessage = '登录失败，请检查网络连接'
      if (error.response) {
        errorMessage = error.response.data?.message || `服务器错误: ${error.response.status}`
      } else if (error.request) {
        errorMessage = '网络错误，请检查网络连接'
      } else {
        errorMessage = error.message || '登录失败'
      }
      
      ElMessage.error({
        message: errorMessage,
        duration: 3000
      })
      
      return {
        success: false,
        message: errorMessage
      }
    }
  },
  
  // 注册用户
  async registerUser(userData) {
    try {
      const response = await userApi.register(userData)
      
      if (response.code === 200) {
        ElMessage.success({
          message: response.message || '注册成功',
          duration: 2000
        })
        
        return {
          success: true,
          data: response.data
        }
      } else {
        ElMessage.error({
          message: response.message || '注册失败',
          duration: 3000
        })
        
        return {
          success: false,
          message: response.message
        }
      }
    } catch (error) {
      console.error('注册错误:', error)
      
      let errorMessage = '注册失败，请检查网络连接'
      if (error.response) {
        errorMessage = error.response.data?.message || `服务器错误: ${error.response.status}`
      } else if (error.request) {
         errorMessage = '网络错误，请检查网络连接'
      } else {
        errorMessage = error.message || '注册失败'
      }
      
      ElMessage.error({
        message: errorMessage,
        duration: 3000
      })
      
      return {
        success: false,
        message: errorMessage
      }
    }
  },
  
  // 获取并更新用户信息
  async fetchAndUpdateUserInfo() {
    try {
      const response = await userApi.getUserInfo()
      
      if (response.code === 200) {
        const userStore = useUserStore()
        userStore.setUserInfo(response.data)
        
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          message: response.message
        }
      }
    } catch (error) {
      console.error('获取用户信息错误:', error)
      return {
        success: false,
        message: error.message
      }
    }
  },
  
  // 退出登录
  async logoutUser() {
    try {
      // 先调用API退出
      await userApi.logout()
    } catch (error) {
      console.warn('退出API调用失败:', error)
      // 继续执行本地退出逻辑
    } finally {
      // 本地清除用户信息
      const userStore = useUserStore()
      userStore.logout()
      
      ElMessage.success({
        message: '退出登录成功',
        duration: 1500
      })
    }
  },
  
  // 检查登录状态
  checkLoginStatus() {
    const userStore = useUserStore()
    return userStore.checkLoginStatus()
  },
  
  // 获取用户权限
  getUserPermissions() {
    const userStore = useUserStore()
    return userStore.permissions
  },
  
  // 检查权限
  hasPermission(permission) {
    const userStore = useUserStore()
    return userStore.hasPermission(permission)
  },
  
  // 检查角色
  hasRole(role) {
    const userStore = useUserStore()
    return userStore.role === role
  },
  
  // 是否是管理员
  isAdmin() {
    const userStore = useUserStore()
    return userStore.isAdmin
  },
  
  // 是否是房东
  isLandlord() {
    const userStore = useUserStore()
    return userStore.isLandlord
  },
  
  // 获取用户展示信息
  getUserDisplayInfo() {
    const userStore = useUserStore()
    return {
      id: userStore.userId,
      name: userStore.getDisplayName(),
      avatar: userStore.avatar,
      role: userStore.role,
      roleText: userStore.roleText,
      status: userStore.statusText
    }
  }
}

// 默认导出userService，也导出userApi
export default userService
export { userApi }
