import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从store获取token
    const userStore = useUserStore()
    const token = userStore.token
    
    // 如果token存在，添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    // 如果是文件上传，使用form-data
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    
    // 添加请求时间戳，防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 如果响应数据是二进制流（如下载文件），直接返回
    if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') {
      return response
    }
    
    // 根据后端返回的code判断请求状态
    // code === 200 表示成功
    if (res.code === 200) {
      return res
    }
    
    // 处理特定的错误码
    switch (res.code) {
      case 401: // 未授权，token过期
        handleUnauthorized()
        break
      case 403: // 禁止访问，权限不足
        handleForbidden()
        break
      case 404: // 资源不存在
        ElMessage.error(res.message || '请求的资源不存在')
        break
      case 500: // 服务器错误
        ElMessage.error(res.message || '服务器内部错误')
        break
      default:
        // 其他错误
        ElMessage.error(res.message || '请求失败')
    }
    
    return Promise.reject(new Error(res.message || 'Error'))
  },
  error => {
    console.error('响应错误:', error)
    
    if (error.response) {
      // 请求已发出，服务器返回了错误状态码
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          ElMessage.error(data?.message || '请求参数错误')
          break
        case 401:
          handleUnauthorized()
          break
        case 403:
          handleForbidden()
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 405:
          ElMessage.error('请求方法不被允许')
          break
        case 408:
          ElMessage.error('请求超时，请检查网络')
          break
        case 500:
          ElMessage.error('服务器内部错误，请稍后重试')
          break
        case 502:
          ElMessage.error('网关错误')
          break
        case 503:
          ElMessage.error('服务不可用，请稍后重试')
          break
        case 504:
          ElMessage.error('网关超时')
          break
        default:
          ElMessage.error(`请求失败: ${status}`)
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      if (error.code === 'ECONNABORTED') {
        ElMessage.error('请求超时，请检查网络连接')
      } else {
        ElMessage.error('网络错误，请检查网络连接')
      }
    } else {
      // 请求配置错误
      ElMessage.error('请求配置错误: ' + error.message)
    }
    
    return Promise.reject(error)
  }
)

// 处理未授权（401）
function handleUnauthorized() {
  const userStore = useUserStore()
  
  // 清除用户信息
  userStore.logout()
  
  ElMessage.warning({
    message: '登录已过期，请重新登录',
    duration: 2000,
    onClose: () => {
      // 跳转到登录页
      router.push('/login')
    }
  })
}

// 处理禁止访问（403）
function handleForbidden() {
  ElMessage.error({
    message: '权限不足，无法访问该资源',
    duration: 3000
  })
  
  // 如果是管理员页面，跳转到首页
  if (router.currentRoute.value.path.startsWith('/admin')) {
    router.push('/')
  }
}

// 封装常用请求方法
const http = {
  get(url, params = {}) {
    return service.get(url, { params })
  },
  
  post(url, data = {}) {
    return service.post(url, data)
  },
  
  put(url, data = {}) {
    return service.put(url, data)
  },
  
  delete(url, params = {}) {
    return service.delete(url, { params })
  },
  
  upload(url, formData, onUploadProgress) {
    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    })
  },
  
  download(url, params = {}) {
    return service.get(url, {
      params,
      responseType: 'blob'
    })
  }
}

export default service
export { http }