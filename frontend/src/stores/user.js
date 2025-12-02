import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useUserStore = defineStore('user', {
  // 状态定义
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    permissions: JSON.parse(localStorage.getItem('permissions') || '[]')
  }),
  
  // 计算属性（getters）
  getters: {
    // 是否已登录
    isLoggedIn: (state) => !!state.token,
    
    // 用户ID
    userId: (state) => state.userInfo.id || null,
    
    // 用户名
    userName: (state) => state.userInfo.username || '',
    
    // 真实姓名
    realName: (state) => state.userInfo.realName || '',
    
    // 手机号
    phone: (state) => state.userInfo.phone || '',
    
    // 头像
    avatar: (state) => state.userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    
    // 用户角色：0-普通用户，1-房东，2-管理员
    role: (state) => state.userInfo.role || 0,
    
    // 用户状态：0-禁用，1-正常
    status: (state) => state.userInfo.status || 1,
    
    // 角色文本
    roleText: (state) => {
      const roleMap = {
        0: '普通用户',
        1: '房东',
        2: '管理员'
      }
      return roleMap[state.userInfo.role] || '未知角色'
    },
    
    // 状态文本
    statusText: (state) => {
      return state.userInfo.status === 1 ? '正常' : '已禁用'
    },
    
    // 权限检查
    isAdmin: (state) => state.userInfo.role === 2,
    isLandlord: (state) => state.userInfo.role === 1,
    isNormalUser: (state) => state.userInfo.role === 0,
    
    // 检查是否有特定权限
    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission)
    },
    
    // 检查是否有任意权限
    hasAnyPermission: (state) => (permissions) => {
      return permissions.some(permission => state.permissions.includes(permission))
    },
    
    // 检查是否拥有所有权限
    hasAllPermissions: (state) => (permissions) => {
      return permissions.every(permission => state.permissions.includes(permission))
    }
  },
  
  // 动作（actions）
  actions: {
    // 设置token
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    
    // 更新用户信息（部分更新）
    updateUserInfo(info) {
      this.userInfo = { ...this.userInfo, ...info }
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    },
    
    // 设置权限
    setPermissions(permissions) {
      this.permissions = permissions
      localStorage.setItem('permissions', JSON.stringify(permissions))
    },
    
    // 登录成功后的初始化
    initUser(data) {
      this.setToken(data.token)
      this.setUserInfo(data.userInfo)
      if (data.permissions) {
        this.setPermissions(data.permissions)
      }
    },
    
    // 更新头像
    updateAvatar(avatarUrl) {
      this.userInfo.avatar = avatarUrl
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    },
    
    // 更新手机号
    updatePhone(phone) {
      this.userInfo.phone = phone
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    },
    
    // 更新真实姓名
    updateRealName(realName) {
      this.userInfo.realName = realName
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    },
    
    // 注销登录
    logout() {
      this.token = ''
      this.userInfo = {}
      this.permissions = []
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('permissions')
      localStorage.removeItem('savedUsername')
    },
    
    // 检查登录状态（自动续期token）
    checkLoginStatus() {
      if (!this.token) {
        return false
      }
      
      // 这里可以添加token过期检查逻辑
      // 如果token即将过期，自动刷新
      
      return true
    },
    
    // 获取用户展示名称（优先显示真实姓名）
    getDisplayName() {
      return this.realName || this.userName || '用户'
    },
    
    // 获取完整的用户信息（用于API请求）
    getUserForRequest() {
      return {
        userId: this.userId,
        username: this.userName,
        role: this.role
      }
    },
    
    // 验证表单权限（用于按钮显示控制）
    canAccess(requiredRole, requiredPermissions = []) {
      // 检查角色
      if (requiredRole !== undefined && this.role < requiredRole) {
        return false
      }
      
      // 检查权限
      if (requiredPermissions.length > 0 && !this.hasAllPermissions(requiredPermissions)) {
        return false
      }
      
      return true
    }
  },
  
    // 持久化配置
  persist: {
    key: 'homestay-user-store',
    storage: localStorage,
    paths: ['token', 'userInfo', 'permissions'],
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    }
  }
})

// 权限常量定义（方便其他地方使用）
export const PERMISSIONS = {
  // 用户相关
  USER_VIEW: 'user:view',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  
  // 民宿相关
  HOMESTAY_VIEW: 'homestay:view',
  HOMESTAY_CREATE: 'homestay:create',
  HOMESTAY_EDIT: 'homestay:edit',
  HOMESTAY_DELETE: 'homestay:delete',
  HOMESTAY_AUDIT: 'homestay:audit',
  
  // 订单相关
  ORDER_VIEW: 'order:view',
  ORDER_CREATE: 'order:create',
  ORDER_EDIT: 'order:edit',
  ORDER_CANCEL: 'order:cancel',
  ORDER_CONFIRM: 'order:confirm',
  
  // 评论相关
  COMMENT_VIEW: 'comment:view',
  COMMENT_CREATE: 'comment:create',
  COMMENT_DELETE: 'comment:delete',
  
  // 管理员相关
  ADMIN_DASHBOARD: 'admin:dashboard',
  ADMIN_STATISTICS: 'admin:statistics',
  ADMIN_SETTINGS: 'admin:settings'
}

// 角色常量
export const ROLES = {
  NORMAL_USER: 0,
  LANDLORD: 1,
  ADMIN: 2
}

// 角色对应的默认权限
export const ROLE_PERMISSIONS = {
  [ROLES.NORMAL_USER]: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.HOMESTAY_VIEW,
    PERMISSIONS.ORDER_VIEW,
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.ORDER_CANCEL,
    PERMISSIONS.COMMENT_VIEW,
    PERMISSIONS.COMMENT_CREATE
  ],
  
  [ROLES.LANDLORD]: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.HOMESTAY_VIEW,
    PERMISSIONS.HOMESTAY_CREATE,
    PERMISSIONS.HOMESTAY_EDIT,
    PERMISSIONS.HOMESTAY_DELETE,
    PERMISSIONS.ORDER_VIEW,
    PERMISSIONS.ORDER_CONFIRM,
    PERMISSIONS.COMMENT_VIEW
  ],
  
  [ROLES.ADMIN]: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.HOMESTAY_VIEW,
    PERMISSIONS.HOMESTAY_CREATE,
    PERMISSIONS.HOMESTAY_EDIT,
    PERMISSIONS.HOMESTAY_DELETE,
    PERMISSIONS.HOMESTAY_AUDIT,
    PERMISSIONS.ORDER_VIEW,
    PERMISSIONS.ORDER_EDIT,
    PERMISSIONS.ORDER_CANCEL,
    PERMISSIONS.COMMENT_VIEW,
    PERMISSIONS.COMMENT_DELETE,
    PERMISSIONS.ADMIN_DASHBOARD,
    PERMISSIONS.ADMIN_STATISTICS,
    PERMISSIONS.ADMIN_SETTINGS
  ]
}
