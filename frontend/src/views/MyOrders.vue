<template>
  <div class="orders-container">
    <!-- 页面头部 -->
    <div class="orders-header">
      <div class="header-content">
        <h1 class="page-title">我的订单</h1>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/profile' }">个人中心</el-breadcrumb-item>
          <el-breadcrumb-item>我的订单</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <div class="orders-main">
      <div class="main-content">
        <!-- 左侧：筛选和统计 -->
        <div class="sidebar-left">
          <!-- 订单统计 -->
          <el-card class="stats-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <h3>订单统计</h3>
              </div>
            </template>
            
            <div class="stats-content">
              <div class="stat-item total">
                <div class="stat-icon">
                  <el-icon><Tickets /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ orderStats.total }}</div>
                  <div class="stat-label">总订单</div>
                </div>
              </div>
              
              <div class="stat-grid">
                <div class="stat-item" :class="getStatusClass('pending_payment')">
                  <div class="stat-icon">
                    <el-icon><Clock /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ orderStats.pending_payment }}</div>
                    <div class="stat-label">待支付</div>
                  </div>
                </div>
                
                <div class="stat-item" :class="getStatusClass('pending_confirm')">
                  <div class="stat-icon">
                    <el-icon><MessageBox /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ orderStats.pending_confirm }}</div>
                    <div class="stat-label">待确认</div>
                  </div>
                </div>
                
                <div class="stat-item" :class="getStatusClass('confirmed')">
                  <div class="stat-icon">
                    <el-icon><CircleCheck /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ orderStats.confirmed }}</div>
                    <div class="stat-label">已确认</div>
                  </div>
                </div>
                
                <div class="stat-item" :class="getStatusClass('completed')">
                  <div class="stat-icon">
                    <el-icon><Finished /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ orderStats.completed }}</div>
                    <div class="stat-label">已完成</div>
                  </div>
                </div>
                
                <div class="stat-item" :class="getStatusClass('cancelled')">
                  <div class="stat-icon">
                    <el-icon><Close /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ orderStats.cancelled }}</div>
                    <div class="stat-label">已取消</div>
                  </div>
                </div>
                
                <div class="stat-item" :class="getStatusClass('refunded')">
                  <div class="stat-icon">
                    <el-icon><Refresh /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ orderStats.refunded }}</div>
                    <div class="stat-label">已退款</div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 快速筛选 -->
          <el-card class="filter-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <h3>快速筛选</h3>
                <el-button type="text" @click="resetFilters">重置</el-button>
              </div>
            </template>
            
            <div class="filter-content">
              <!-- 状态筛选 -->
              <div class="filter-section">
                <h4 class="section-title">订单状态</h4>
                <div class="status-filters">
                  <el-checkbox-group v-model="filters.status" @change="handleFilterChange">
                    <el-checkbox label="pending_payment">待支付</el-checkbox>
                    <el-checkbox label="pending_confirm">待确认</el-checkbox>
                    <el-checkbox label="confirmed">已确认</el-checkbox>
                    <el-checkbox label="completed">已完成</el-checkbox>
                    <el-checkbox label="cancelled">已取消</el-checkbox>
                    <el-checkbox label="refunded">已退款</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              
              <!-- 时间筛选 -->
              <div class="filter-section">
                <h4 class="section-title">订单时间</h4>
                <div class="time-filters">
                  <el-radio-group v-model="filters.timeRange" @change="handleFilterChange">
                    <el-radio label="all">全部时间</el-radio>
                    <el-radio label="week">最近一周</el-radio>
                    <el-radio label="month">最近一月</el-radio>
                    <el-radio label="quarter">最近三月</el-radio>
                    <el-radio label="year">最近一年</el-radio>
                  </el-radio-group>
                </div>
              </div>
              
              <!-- 排序方式 -->
              <div class="filter-section">
                <h4 class="section-title">排序方式</h4>
                <div class="sort-filters">
                  <el-radio-group v-model="filters.sortBy" @change="handleFilterChange">
                    <el-radio label="create_time_desc">最新订单</el-radio>
                    <el-radio label="create_time_asc">最早订单</el-radio>
                    <el-radio label="price_desc">价格最高</el-radio>
                    <el-radio label="price_asc">价格最低</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 订单提示 -->
          <el-card class="tips-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <h3>订单提示</h3>
              </div>
            </template>
            
            <div class="tips-content">
              <div class="tip-item">
                <el-icon color="#e6a23c"><Warning /></el-icon>
                <div class="tip-text">
                  <div class="tip-title">待支付订单</div>
                  <div class="tip-desc">请在15分钟内完成支付，超时订单将自动取消</div>
                </div>
              </div>
              
              <div class="tip-item">
                <el-icon color="#409eff"><InfoFilled /></el-icon>
                <div class="tip-text">
                  <div class="tip-title">入住须知</div>
                  <div class="tip-desc">入住前请与房东确认具体入住时间和方式</div>
                </div>
              </div>
              
              <div class="tip-item">
                <el-icon color="#67c23a"><CircleCheck /></el-icon>
                <div class="tip-text">
                  <div class="tip-title">评价提醒</div>
                  <div class="tip-desc">入住完成后记得给房东和房源评价哦</div>
                </div>
              </div>
              
              <div class="tip-item">
                <el-icon color="#f56c6c"><Close /></el-icon>
                <div class="tip-text">
                  <div class="tip-title">取消政策</div>
                  <div class="tip-desc">取消订单请提前联系房东，避免产生违约金</div>
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 右侧：订单列表 -->
        <div class="content-right">
          <!-- 搜索和视图切换 -->
          <div class="list-header">
            <div class="search-box">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索订单号、民宿名称或地址"
                clearable
                @clear="handleSearch"
                @keyup.enter="handleSearch"
              >
                <template #append>
                  <el-button :icon="Search" @click="handleSearch" />
                </template>
              </el-input>
            </div>
            
            <div class="view-controls">
              <el-button-group>
                <el-button
                  :type="viewMode === 'table' ? 'primary' : ''"
                  @click="viewMode = 'table'"
                >
                  <el-icon><List /></el-icon> 列表视图
                </el-button>
                <el-button
                  :type="viewMode === 'card' ? 'primary' : ''"
                  @click="viewMode = 'card'"
                >
                  <el-icon><Grid /></el-icon> 卡片视图
                </el-button>
              </el-button-group>
              
              <el-button :icon="Refresh" @click="refreshOrders" />
            </div>
          </div>

          <!-- 订单列表 -->
          <div class="orders-list">
            <!-- 表格视图 -->
            <div v-if="viewMode === 'table'" class="table-view">
              <el-table
                :data="paginatedOrders"
                style="width: 100%"
                @row-click="viewOrderDetail"
                class="orders-table"
              >
                <el-table-column label="订单信息" width="350">
                  <template #default="{ row }">
                    <div class="order-info-cell">
                      <el-image
                        :src="row.homestay.coverImage"
                        class="order-image"
                        fit="cover"
                      />
                      <div class="order-details">
                        <div class="order-title">{{ row.homestay.name }}</div>
                        <div class="order-address">
                          <el-icon><Location /></el-icon>
                          {{ row.homestay.address }}
                        </div>
                        <div class="order-dates">
                          {{ formatDate(row.checkInDate) }} - {{ formatDate(row.checkOutDate) }}
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                
                <el-table-column label="订单状态" width="120">
                  <template #default="{ row }">
                    <el-tag :type="getStatusTagType(row.status)" size="large" effect="light">
                      {{ getStatusText(row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
                
                <el-table-column label="金额" width="120">
                  <template #default="{ row }">
                    <div class="order-price">
                      <div class="price-amount">¥{{ row.totalPrice }}</div>
                      <div class="price-detail">{{ row.nights }}晚</div>
                    </div>
                  </template>
                </el-table-column>
                
                <el-table-column label="入住人" width="100">
                  <template #default="{ row }">
                    <div class="order-guests">
                      {{ row.guestCount }}人
                    </div>
                  </template>
                </el-table-column>
                
                <el-table-column label="操作" width="180">
                  <template #default="{ row }">
                    <div class="order-actions">
                      <el-button
                        size="small"
                        @click.stop="viewOrderDetail(row)"
                      >
                        详情
                      </el-button>
                      
                      <el-dropdown @command="(command) => handleOrderAction(row, command)" trigger="click">
                        <el-button size="small" type="primary">
                          操作
                          <el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item
                              v-for="action in getAvailableActions(row.status)"
                              :key="action.command"
                              :command="action.command"
                              :icon="action.icon"
                            >
                              {{ action.text }}
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            
            <!-- 卡片视图 -->
            <div v-else class="card-view">
              <div class="orders-grid">
                <div
                  v-for="order in paginatedOrders"
                  :key="order.id"
                  class="order-card"
                  @click="viewOrderDetail(order)"
                >
                  <div class="card-header">
                    <div class="order-id">订单号：{{ order.orderNo }}</div>
                    <el-tag :type="getStatusTagType(order.status)" size="small">
                      {{ getStatusText(order.status) }}
                    </el-tag>
                  </div>
                  
                  <div class="card-content">
                    <el-image
                      :src="order.homestay.coverImage"
                      class="card-image"
                      fit="cover"
                    />
                    
                    <div class="card-info">
                      <h3 class="homestay-name">{{ order.homestay.name }}</h3>
                      
                      <div class="info-item">
                        <el-icon><Location /></el-icon>
                        <span>{{ order.homestay.address }}</span>
                      </div>
                      
                      <div class="info-item">
                        <el-icon><Calendar /></el-icon>
                        <span>{{ formatDate(order.checkInDate) }} - {{ formatDate(order.checkOutDate) }}</span>
                      </div>
                      
                      <div class="info-item">
                        <el-icon><User /></el-icon>
                        <span>{{ order.guestCount }}人入住</span>
                      </div>
                      
                      <div class="info-item">
                        <el-icon><Clock /></el-icon>
                        <span>下单时间：{{ formatDateTime(order.createTime) }}</span>
                      </div>
                      
                      <div class="order-price">
                        <span class="price-label">订单金额：</span>
                        <span class="price-value">¥{{ order.totalPrice }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="card-actions">
                    <el-button
                      size="small"
                      @click.stop="viewOrderDetail(order)"
                    >
                      查看详情
                    </el-button>
                    
                    <el-button
                      v-for="action in getAvailableActions(order.status)"
                      :key="action.command"
                      :type="action.type"
                      size="small"
                      @click.stop="handleOrderAction(order, action.command)"
                    >
                      {{ action.text }}
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 空状态 -->
            <div v-if="filteredOrders.length === 0" class="empty-state">
              <el-empty description="暂无相关订单">
                <template #image>
                  <el-icon :size="100"><ShoppingCart /></el-icon>
                </template>
                <p class="empty-tip">去首页看看有没有心仪的民宿吧~</p>
                <el-button type="primary" @click="$router.push('/')">
                  去逛逛
                </el-button>
              </el-empty>
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination-section" v-if="filteredOrders.length > 0">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[5, 10, 20, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="filteredOrders.length"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="showOrderDetail"
      :title="`订单详情 - ${selectedOrder?.orderNo || ''}`"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-if="selectedOrder" class="order-detail">
        <!-- 订单状态 -->
        <div class="detail-status">
          <el-steps :active="getStatusStep(selectedOrder.status)" finish-status="success" align-center>
            <el-step title="已下单" :description="formatDateTime(selectedOrder.createTime)" />
            <el-step title="已支付" :description="selectedOrder.payTime ? formatDateTime(selectedOrder.payTime) : '待支付'" />
            <el-step title="已确认" :description="selectedOrder.confirmTime ? formatDateTime(selectedOrder.confirmTime) : '待确认'" />
            <el-step title="已完成" :description="selectedOrder.completeTime ? formatDateTime(selectedOrder.completeTime) : '待完成'" />
          </el-steps>
        </div>
        
        <div class="detail-content">
          <!-- 民宿信息 -->
          <div class="detail-section">
            <h3 class="section-title">民宿信息</h3>
            <div class="homestay-info">
              <el-image
                :src="selectedOrder.homestay.coverImage"
                class="detail-image"
                fit="cover"
              />
              <div class="homestay-details">
                <h4>{{ selectedOrder.homestay.name }}</h4>
                <p class="homestay-address">
                  <el-icon><Location /></el-icon>
                  {{ selectedOrder.homestay.address }}
                </p>
                <div class="homestay-features">
                  <el-tag
                    v-for="feature in selectedOrder.homestay.features"
                    :key="feature"
                    size="small"
                  >
                    {{ feature }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 入住信息 -->
          <div class="detail-section">
            <h3 class="section-title">入住信息</h3>
            <div class="stay-info">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">入住日期：</span>
                  <span class="info-value">{{ formatDate(selectedOrder.checkInDate) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">退房日期：</span>
                  <span class="info-value">{{ formatDate(selectedOrder.checkOutDate) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">入住晚数：</span>
                  <span class="info-value">{{ selectedOrder.nights }}晚</span>
                </div>
                <div class="info-item">
                  <span class="info-label">入住人数：</span>
                  <span class="info-value">{{ selectedOrder.guestCount }}人</span>
                </div>
                <div class="info-item">
                  <span class="info-label">联系人：</span>
                  <span class="info-value">{{ selectedOrder.contactName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">联系电话：</span>
                  <span class="info-value">{{ selectedOrder.contactPhone }}</span>
                </div>
              </div>
              
              <div class="special-requests" v-if="selectedOrder.specialRequests">
                <span class="requests-label">特殊需求：</span>
                <span class="requests-content">{{ selectedOrder.specialRequests }}</span>
              </div>
            </div>
          </div>
          
          <!-- 价格明细 -->
          <div class="detail-section">
            <h3 class="section-title">价格明细</h3>
            <div class="price-details">
              <div class="price-item">
                <span>房费（¥{{ selectedOrder.homestay.price }} × {{ selectedOrder.nights }}晚）</span>
                <span>¥{{ selectedOrder.roomPrice }}</span>
              </div>
              <div class="price-item">
                <span>清洁费</span>
                <span>¥{{ selectedOrder.cleaningFee }}</span>
              </div>
              <div class="price-item">
                <span>服务费</span>
                <span>¥{{ selectedOrder.serviceFee }}</span>
              </div>
              <div class="price-item discount" v-if="selectedOrder.couponDiscount > 0">
                <span>优惠券减免</span>
                <span class="discount-amount">-¥{{ selectedOrder.couponDiscount }}</span>
              </div>
              <div class="price-item total">
                <span>实付金额</span>
                <span class="total-amount">¥{{ selectedOrder.totalPrice }}</span>
              </div>
            </div>
          </div>
          
          <!-- 房东信息 -->
          <div class="detail-section">
            <h3 class="section-title">房东信息</h3>
            <div class="host-info">
              <el-avatar :size="50" :src="selectedOrder.host.avatar" />
              <div class="host-details">
                <h4>{{ selectedOrder.host.name }}</h4>
                <p class="host-contact">
                  <el-icon><Phone /></el-icon>
                  {{ selectedOrder.host.phone }}
                </p>
                <p class="host-contact">
                  <el-icon><Message /></el-icon>
                  {{ selectedOrder.host.email }}
                </p>
              </div>
              <div class="host-actions">
                <el-button type="primary" size="small" icon="ChatLineRound">
                  联系房东
                </el-button>
              </div>
            </div>
          </div>
          
          <!-- 订单日志 -->
          <div class="detail-section">
            <h3 class="section-title">订单日志</h3>
            <div class="order-logs">
              <div
                v-for="log in selectedOrder.logs"
                :key="log.id"
                class="log-item"
              >
                <div class="log-time">{{ formatDateTime(log.time) }}</div>
                <div class="log-content">{{ log.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showOrderDetail = false">关闭</el-button>
          <el-button
            v-for="action in getAvailableActions(selectedOrder?.status || '')"
            :key="action.command"
            :type="action.type"
            @click="handleOrderAction(selectedOrder, action.command)"
          >
            {{ action.text }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  List,
  Grid,
  Tickets,
  Clock,
  MessageBox,
  CircleCheck,
  Finished,
  Close,
  Refresh as RefreshIcon,
  Location,
  Calendar,
  User,
  ShoppingCart,
  ArrowDown,
  Phone,
  Message,
  ChatLineRound,
  Warning,
  InfoFilled,
  CreditCard,
  Edit,
  Star,
  Delete,
  View
} from '@element-plus/icons-vue'

const router = useRouter()

// 视图模式
const viewMode = ref('table')

// 搜索相关
const searchKeyword = ref('')

// 筛选条件
const filters = reactive({
  status: [],
  timeRange: 'all',
  sortBy: 'create_time_desc'
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 订单统计
const orderStats = reactive({
  total: 15,
  pending_payment: 2,
  pending_confirm: 1,
  confirmed: 3,
  completed: 6,
  cancelled: 2,
  refunded: 1
})

// 模拟订单数据
const orders = ref([
  {
    id: 1,
    orderNo: 'HS202412020001',
    homestay: {
      id: 1,
      name: '西湖边温馨民宿',
      coverImage: 'https://via.placeholder.com/300x200/667eea/ffffff?text=民宿1',
      address: '杭州市西湖区龙井路88号',
      price: 398,
      features: ['湖景', 'WiFi', '厨房']
    },
    checkInDate: '2024-12-10',
    checkOutDate: '2024-12-12',
    nights: 2,
    guestCount: 2,
    roomPrice: 796,
    cleaningFee: 80,
    serviceFee: 79.6,
    couponDiscount: 50,
    totalPrice: 905.6,
    status: 'pending_payment',
    createTime: '2024-12-02 10:30:22',
    payTime: null,
    confirmTime: null,
    completeTime: null,
    contactName: '张三',
    contactPhone: '13800138000',
    specialRequests: '需要婴儿床',
    host: {
      name: '李房东',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      phone: '13800138001',
      email: 'landlord@example.com'
    },
    logs: [
      {
        id: 1,
        time: '2024-12-02 10:30:22',
        content: '订单创建成功'
      }
    ]
  },
  // 更多模拟订单数据...
])

// 计算属性
const filteredOrders = computed(() => {
  let result = [...orders.value]
  
  // 状态筛选
  if (filters.status.length > 0) {
    result = result.filter(order => filters.status.includes(order.status))
  }
  
  // 时间筛选
  if (filters.timeRange !== 'all') {
    const now = new Date()
    let startDate = new Date()
    
    switch (filters.timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }
    
    result = result.filter(order => new Date(order.createTime) >= startDate)
  }
  
  // 搜索筛选
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(order => 
      order.orderNo.toLowerCase().includes(keyword) ||
      order.homestay.name.toLowerCase().includes(keyword) ||
      order.homestay.address.toLowerCase().includes(keyword)
    )
  }
  
  // 排序
  result.sort((a, b) => {
    switch (filters.sortBy) {
      case 'create_time_asc':
        return new Date(a.createTime) - new Date(b.createTime)
      case 'price_desc':
        return b.totalPrice - a.totalPrice
      case 'price_asc':
        return a.totalPrice - b.totalPrice
      default: // create_time_desc
        return new Date(b.createTime) - new Date(a.createTime)
    }
  })
  
  return result
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrders.value.slice(start, end)
})

// 订单详情对话框
const showOrderDetail = ref(false)
const selectedOrder = ref(null)

// 方法
const getStatusClass = (status) => {
  return status
}

const getStatusTagType = (status) => {
  const typeMap = {
    pending_payment: 'danger',
    pending_confirm: 'warning',
    confirmed: 'primary',
    completed: 'success',
    cancelled: 'info',
    refunded: 'info'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    pending_payment: '待支付',
    pending_confirm: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款'
  }
  return textMap[status] || '未知状态'
}

const getStatusStep = (status) => {
  const stepMap = {
    pending_payment: 1,
    pending_confirm: 2,
    confirmed: 3,
    completed: 4,
    cancelled: 0,
    refunded: 0
  }
  return stepMap[status] || 0
}

const getAvailableActions = (status) => {
  const actions = []
  
  switch (status) {
    case 'pending_payment':
      actions.push(
        { command: 'pay', text: '去支付', icon: CreditCard, type: 'primary' },
        { command: 'cancel', text: '取消订单', icon: Close, type: 'danger' }
      )
      break
      
    case 'pending_confirm':
      actions.push(
        { command: 'cancel', text: '取消订单', icon: Close, type: 'danger' }
      )
      break
      
    case 'confirmed':
      actions.push(
        { command: 'checkin', text: '确认入住', icon: CircleCheck, type: 'primary' },
        { command: 'contact', text: '联系房东', icon: ChatLineRound, type: 'info' },
        { command: 'cancel', text: '申请取消', icon: Close, type: 'danger' }
      )
      break
      
    case 'completed':
      actions.push(
        { command: 'review', text: '评价', icon: Edit, type: 'primary' },
        { command: 'rebook', text: '再次预订', icon: RefreshIcon, type: 'success' },
        { command: 'invoice', text: '开发票', icon: Tickets, type: 'info' }
      )
      break
      
    case 'cancelled':
    case 'refunded':
      actions.push(
        { command: 'rebook', text: '重新预订', icon: RefreshIcon, type: 'primary' },
        { command: 'delete', text: '删除订单', icon: Delete, type: 'danger' }
      )
      break
  }
  
  // 通用操作
  actions.push(
    { command: 'detail', text: '查看详情', icon: View, type: 'info' }
  )
  
  return actions
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return ''
  const date = new Date(dateTimeStr)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const handleFilterChange = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  filters.status = []
  filters.timeRange = 'all'
  filters.sortBy = 'create_time_desc'
  searchKeyword.value = ''
  currentPage.value = 1
}

const handleSearch = () => {
  currentPage.value = 1
}

const refreshOrders = () => {
  ElMessage.success('订单列表已刷新')
}

const viewOrderDetail = (order) => {
  selectedOrder.value = order
  showOrderDetail.value = true
}

const handleOrderAction = async (order, command) => {
  switch (command) {
    case 'pay':
      await handlePayOrder(order)
      break
      
    case 'cancel':
      await handleCancelOrder(order)
      break
      
    case 'checkin':
      await handleCheckin(order)
      break
      
    case 'review':
      await handleReview(order)
      break
      
    case 'delete':
      await handleDeleteOrder(order)
      break
      
    case 'detail':
      viewOrderDetail(order)
      break
      
    default:
      ElMessage.info(`执行操作：${command}`)
  }
}

const handlePayOrder = async (order) => {
  try {
    await ElMessageBox.confirm(`确认支付订单 ${order.orderNo} 吗？`, '确认支付', {
      confirmButtonText: '确认支付',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 模拟支付过程
    ElMessage.success('跳转到支付页面...')
    // 实际应该跳转到支付页面
    // router.push(`/payment?orderNo=${order.orderNo}`)
    
  } catch {
    // 用户取消
  }
}

const handleCancelOrder = async (order) => {
  try {
    const { value: reason } = await ElMessageBox.prompt('请输入取消原因', '取消订单', {
      confirmButtonText: '确认取消',
      cancelButtonText: '取消',
      inputType: 'textarea',
      inputPlaceholder: '请说明取消订单的原因...'
    })
    
    if (reason) {
      // 模拟取消订单
      order.status = 'cancelled'
      order.logs.push({
        id: Date.now(),
        time: new Date().toISOString(),
        content: `订单取消，原因：${reason}`
      })
      
      ElMessage.success('订单取消成功')
      refreshOrders()
    }
    
  } catch {
    // 用户取消
  }
}

const handleCheckin = async (order) => {
  try {
    await ElMessageBox.confirm('确认已入住吗？', '确认入住', {
      confirmButtonText: '确认入住',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 模拟确认入住
    order.status = 'completed'
    order.completeTime = new Date().toISOString()
    order.logs.push({
      id: Date.now(),
      time: new Date().toISOString(),
      content: '已确认入住'
    })
    
    ElMessage.success('入住确认成功')
    refreshOrders()
    
  } catch {
    // 用户取消
  }
}

const handleReview = async (order) => {
  ElMessage.info('跳转到评价页面...')
  // router.push(`/review?orderId=${order.id}`)
}

const handleDeleteOrder = async (order) => {
  try {
    await ElMessageBox.confirm('确认删除订单吗？删除后无法恢复', '确认删除', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 模拟删除订单
    const index = orders.value.findIndex(o => o.id === order.id)
    if (index !== -1) {
      orders.value.splice(index, 1)
      ElMessage.success('订单删除成功')
      refreshOrders()
    }
    
  } catch {
    // 用户取消
  }
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

// 初始化加载
onMounted(() => {
  // 这里可以加载订单数据
  console.log('加载订单数据')
})
</script>

<style scoped>
.orders-container {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 页面头部 */
.orders-header {
  background: white;
  padding: 24px 0;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

/* 主内容区 */
.orders-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

.main-content {
  display: flex;
  gap: 24px;
}

/* 左侧边栏 */
.sidebar-left {
  width: 280px;
  flex-shrink: 0;
}

.stats-card,
.filter-card,
.tips-card {
  border-radius: 12px;
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 统计卡片 */
.stats-content {
  padding: 8px 0;
}

.stat-item.total {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  margin-bottom: 20px;
}

.stat-item.total .stat-icon {
  font-size: 24px;
}

.stat-item.total .stat-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.stat-item.total .stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #eee;
  transition: all 0.3s;
}

.stat-item:hover {
  border-color: #409eff;
  background: #f0f7ff;
}

.stat-item.pending_payment {
  border-left: 4px solid #f56c6c;
}

.stat-item.pending_confirm {
  border-left: 4px solid #e6a23c;
}

.stat-item.confirmed {
  border-left: 4px solid #409eff;
}

.stat-item.completed {
  border-left: 4px solid #67c23a;
}

.stat-item.cancelled,
.stat-item.refunded {
  border-left: 4px solid #909399;
}

.stat-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 6px;
  font-size: 16px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

/* 筛选卡片 */
.filter-content {
  padding: 8px 0;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.status-filters,
.time-filters,
.sort-filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 提示卡片 */
.tips-content {
  padding: 8px 0;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.tip-item:last-child {
  border-bottom: none;
}

.tip-item .el-icon {
  margin-top: 2px;
  flex-shrink: 0;
}

.tip-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.tip-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* 右侧内容区 */
.content-right {
  flex: 1;
  min-width: 0;
}

/* 列表头部 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.view-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 订单列表 */
.orders-list {
  min-height: 400px;
}

/* 表格视图 */
.orders-table :deep(.el-table__row) {
  cursor: pointer;
}

.orders-table :deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

.order-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-image {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  flex-shrink: 0;
}

.order-details {
  flex: 1;
}

.order-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.2;
}

.order-address {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.order-dates {
  font-size: 12px;
  color: #999;
}

.order-price {
  text-align: right;
}

.price-amount {
  font-size: 18px;
  font-weight: 700;
  color: #ff6b6b;
  line-height: 1;
}

.price-detail {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.order-guests {
  font-size: 14px;
  color: #333;
}

.order-actions {
  display: flex;
  gap: 8px;
}

/* 卡片视图 */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.order-id {
  font-size: 14px;
  color: #666;
}

.card-content {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.card-image {
  width: 100px;
  height: 80px;
  border-radius: 8px;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
}

.homestay-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.order-price {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.price-label {
  font-size: 12px;
  color: #666;
}

.price-value {
  font-size: 18px;
  font-weight: 700;
  color: #ff6b6b;
}

.card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 空状态 */
.empty-state {
  padding: 60px 0;
  background: white;
  border-radius: 12px;
  text-align: center;
}

.empty-tip {
  color: #666;
  margin: 12px 0 24px 0;
}

/* 分页 */
.pagination-section {
  margin-top: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
}

/* 订单详情对话框 */
.order-detail {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.detail-status {
  margin-bottom: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-content {
  padding: 0 4px;
}

.detail-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-section .section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-left: 8px;
  border-left: 4px solid #409eff;
}

/* 民宿信息 */
.homestay-info {
  display: flex;
  gap: 20px;
}

.detail-image {
  width: 150px;
  height: 100px;
  border-radius: 8px;
  flex-shrink: 0;
}

.homestay-details {
  flex: 1;
}

.homestay-details h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.homestay-address {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.homestay-features {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 入住信息 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
}

.info-label {
  width: 80px;
  font-size: 14px;
  color: #666;
  flex-shrink: 0;
}

.info-value {
  flex: 1;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.special-requests {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
}

.requests-label {
  color: #666;
  margin-right: 8px;
}

.requests-content {
  color: #333;
}

/* 价格明细 */
.price-details {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}

.price-item:last-child {
  margin-bottom: 0;
}

.price-item.discount {
  color: #67c23a;
}

.discount-amount {
  font-weight: 600;
}

.price-item.total {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ddd;
  font-size: 16px;
  font-weight: 600;
}

.total-amount {
  color: #ff6b6b;
  font-size: 20px;
}

/* 房东信息 */
.host-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.host-details {
  flex: 1;
}

.host-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.host-contact {
  font-size: 14px;
  color: #666;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.host-contact:last-child {
  margin-bottom: 0;
}

.host-actions {
  flex-shrink: 0;
}

/* 订单日志 */
.order-logs {
  max-height: 200px;
  overflow-y: auto;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.log-item {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #ddd;
}

.log-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.log-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.log-content {
  font-size: 14px;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .main-content {
    flex-direction: column;
  }
  
  .sidebar-left {
    width: 100%;
  }
  
  .orders-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  .view-controls {
    justify-content: space-between;
  }
  
  .homestay-info {
    flex-direction: column;
  }
  
  .host-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .host-actions {
    align-self: flex-end;
  }
}

/* 自定义滚动条 */
.order-detail::-webkit-scrollbar {
  width: 6px;
}

.order-detail::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.order-detail::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.order-detail::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.order-logs::-webkit-scrollbar {
  width: 4px;
}

.order-logs::-webkit-scrollbar-thumb {
  background: #d1d1d1;
}
</style>