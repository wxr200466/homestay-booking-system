<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <header class="home-header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">🏡</span>
          <span class="logo-text">民宿预约系统</span>
        </div>
        
        <div class="header-search">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索民宿、地点或特色"
            class="search-input"
            size="large"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
        
        <div class="header-actions">
          <el-button type="primary" @click="$router.push('/login')" v-if="!isLoggedIn">
            登录/注册
          </el-button>
          <div class="user-info" v-else>
            <el-dropdown @command="handleUserCommand">
              <div class="user-dropdown">
                <el-avatar :size="36" :src="userAvatar" />
                <span class="user-name">{{ userName }}</span>
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="orders">
                    <el-icon><Document /></el-icon>我的订单
                  </el-dropdown-item>
                  <el-dropdown-item command="collections">
                    <el-icon><Star /></el-icon>我的收藏
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
      
      <!-- 导航菜单 -->
      <nav class="main-nav">
        <div class="nav-content">
          <el-menu
            :default-active="activeNav"
            mode="horizontal"
            @select="handleNavSelect"
            class="nav-menu"
          >
            <el-menu-item index="home">首页</el-menu-item>
            <el-menu-item index="recommend">推荐民宿</el-menu-item>
            <el-menu-item index="luxury">精品民宿</el-menu-item>
            <el-menu-item index="budget">经济实惠</el-menu-item>
            <el-menu-item index="experience">特色体验</el-menu-item>
            <el-menu-item index="help">帮助中心</el-menu-item>
          </el-menu>
        </div>
      </nav>
    </header>

    <!-- 主内容区 -->
    <main class="home-main">
      <!-- 搜索筛选区域 -->
      <div class="filter-section">
        <el-card class="filter-card">
          <div class="filter-content">
            <!-- 位置筛选 -->
            <div class="filter-item">
              <span class="filter-label">位置：</span>
              <el-select
                v-model="filter.location"
                placeholder="选择位置"
                clearable
                @change="handleFilterChange"
              >
                <el-option
                  v-for="item in locationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            
            <!-- 价格筛选 -->
            <div class="filter-item">
              <span class="filter-label">价格：</span>
              <el-select
                v-model="filter.priceRange"
                placeholder="价格区间"
                clearable
                @change="handleFilterChange"
              >
                <el-option label="100元以下" value="0-100" />
                <el-option label="100-300元" value="100-300" />
                <el-option label="300-500元" value="300-500" />
                <el-option label="500元以上" value="500-10000" />
              </el-select>
            </div>
            
            <!-- 入住日期 -->
            <div class="filter-item">
              <span class="filter-label">入住：</span>
              <el-date-picker
                v-model="filter.checkInDate"
                type="date"
                placeholder="选择入住日期"
                :disabled-date="disabledCheckInDate"
                @change="handleDateChange"
              />
            </div>
            
            <!-- 退房日期 -->
            <div class="filter-item">
              <span class="filter-label">退房：</span>
              <el-date-picker
                v-model="filter.checkOutDate"
                type="date"
                placeholder="选择退房日期"
                :disabled-date="disabledCheckOutDate"
                @change="handleDateChange"
              />
            </div>
            
            <!-- 人数 -->
            <div class="filter-item">
              <span class="filter-label">人数：</span>
              <el-input-number
                v-model="filter.guestCount"
                :min="1"
                :max="10"
                @change="handleFilterChange"
              />
            </div>
            
            <!-- 设施筛选 -->
            <div class="filter-item">
              <span class="filter-label">设施：</span>
              <el-select
                v-model="filter.facilities"
                multiple
                placeholder="选择设施"
                @change="handleFilterChange"
              >
                <el-option label="WiFi" value="wifi" />
                <el-option label="空调" value="air-conditioner" />
                <el-option label="厨房" value="kitchen" />
                <el-option label="洗衣机" value="washer" />
                <el-option label="停车位" value="parking" />
                <el-option label="游泳池" value="pool" />
              </el-select>
            </div>
            
            <!-- 排序方式 -->
            <div class="filter-item">
              <span class="filter-label">排序：</span>
              <el-select
                v-model="filter.sortBy"
                @change="handleSortChange"
              >
                <el-option label="推荐排序" value="recommend" />
                <el-option label="价格从低到高" value="price_asc" />
                <el-option label="价格从高到低" value="price_desc" />
                <el-option label="评分从高到低" value="rating_desc" />
                <el-option label="收藏数从高到低" value="collect_desc" />
              </el-select>
            </div>
            
            <!-- 重置按钮 -->
            <el-button type="info" plain @click="resetFilters">
              重置筛选
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 民宿列表 -->
      <div class="homestay-list-section">
        <div class="section-header">
          <h2 class="section-title">发现优质民宿</h2>
          <span class="section-count">共 {{ filteredHomestays.length }} 个房源</span>
        </div>
        
        <!-- 列表/网格视图切换 -->
        <div class="view-toggle">
          <el-button-group>
            <el-button
              :type="viewMode === 'grid' ? 'primary' : ''"
              @click="viewMode = 'grid'"
            >
              <el-icon><Grid /></el-icon> 网格视图
            </el-button>
            <el-button
              :type="viewMode === 'list' ? 'primary' : ''"
              @click="viewMode = 'list'"
            >
              <el-icon><List /></el-icon> 列表视图
            </el-button>
          </el-button-group>
        </div>
        
        <!-- 民宿卡片网格 -->
        <div v-if="viewMode === 'grid'" class="homestay-grid">
          <div
            v-for="homestay in paginatedHomestays"
            :key="homestay.id"
            class="homestay-card"
            @click="viewHomestayDetail(homestay.id)"
          >
            <div class="card-image">
              <img :src="homestay.coverImage" :alt="homestay.name" />
              <div class="image-overlay">
                <el-button
                  type="danger"
                  :icon="Star"
                  circle
                  size="small"
                  class="favorite-btn"
                  @click.stop="toggleFavorite(homestay.id)"
                />
              </div>
              <div class="card-badge" v-if="homestay.isRecommended">
                <span class="badge-text">推荐</span>
              </div>
            </div>
            
            <div class="card-content">
              <div class="card-header">
                <h3 class="homestay-name">{{ homestay.name }}</h3>
                <div class="rating">
                  <el-rate
                    v-model="homestay.rating"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                  />
                </div>
              </div>
              
              <p class="homestay-address">
                <el-icon><Location /></el-icon>
                {{ homestay.address }}
              </p>
              
              <div class="homestay-features">
                <span class="feature-item">
                  <el-icon><User /></el-icon>
                  {{ homestay.maxGuests }}人
                </span>
                <span class="feature-item">
                  <el-icon><House /></el-icon>
                  {{ homestay.bedrooms }}室{{ homestay.beds }}床
                </span>
                <span class="feature-item" v-if="homestay.hasWifi">
                  <el-icon><Wifi /></el-icon>
                  WiFi
                </span>
              </div>
              
              <div class="card-footer">
                <div class="price-section">
                  <span class="price-currency">¥</span>
                  <span class="price-value">{{ homestay.price }}</span>
                  <span class="price-unit">/晚</span>
                </div>
                <el-button type="primary" size="small" @click.stop="quickBook(homestay)">
                  立即预订
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 民宿列表视图 -->
        <div v-else class="homestay-list">
          <el-table :data="paginatedHomestays" style="width: 100%">
            <el-table-column label="民宿信息" width="300">
              <template #default="{ row }">
                <div class="table-homestay-info">
                  <img :src="row.coverImage" class="table-image" />
                  <div class="table-info">
                    <h4 class="table-name">{{ row.name }}</h4>
                    <p class="table-address">{{ row.address }}</p>
                    <div class="table-features">
                      <el-tag
                        v-for="feature in row.features"
                        :key="feature"
                        size="small"
                        type="info"
                      >
                        {{ feature }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="评分" width="100">
              <template #default="{ row }">
                <div class="table-rating">
                  <el-rate v-model="row.rating" disabled size="small" />
                  <span class="rating-score">{{ row.rating.toFixed(1) }}</span>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="可住人数" width="100">
              <template #default="{ row }">
                <span>{{ row.maxGuests }}人</span>
              </template>
            </el-table-column>
            
            <el-table-column label="价格" width="120">
              <template #default="{ row }">
                <div class="table-price">
                  <span class="price-amount">¥{{ row.price }}</span>
                  <span class="price-unit">/晚</span>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="180">
              <template #default="{ row }">
                <div class="table-actions">
                  <el-button
                    type="primary"
                    size="small"
                    @click="viewHomestayDetail(row.id)"
                  >
                    查看详情
                  </el-button>
                  <el-button
                    :type="row.isFavorite ? 'danger' : 'info'"
                    size="small"
                    :icon="Star"
                    @click="toggleFavorite(row.id)"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 分页 -->
        <div class="pagination-section" v-if="totalPages > 1">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[12, 24, 48, 96]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filteredHomestays.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <!-- 推荐区域 -->
      <div class="recommend-section" v-if="recommendHomestays.length > 0">
        <h2 class="section-title">为您推荐</h2>
        <div class="recommend-list">
          <el-carousel :interval="4000" type="card" height="300px">
            <el-carousel-item
              v-for="item in recommendHomestays"
              :key="item.id"
              class="carousel-item"
            >
              <div class="carousel-content" @click="viewHomestayDetail(item.id)">
                <img :src="item.coverImage" class="carousel-image" />
                <div class="carousel-info">
                  <h3>{{ item.name }}</h3>
                  <p>{{ item.address }}</p>
                  <div class="carousel-price">¥{{ item.price }}起/晚</div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

      <!-- 特色分类 -->
      <div class="category-section">
        <h2 class="section-title">特色民宿分类</h2>
        <div class="category-grid">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-card"
            @click="filterByCategory(category.id)"
          >
            <div class="category-icon">{{ category.icon }}</div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="home-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于我们</h3>
          <p>民宿预约系统，为您提供优质的民宿预订服务。</p>
        </div>
        <div class="footer-section">
          <h3>联系我们</h3>
          <p>邮箱：support@homestay.com</p>
          <p>电话：400-123-4567</p>
        </div>
        <div class="footer-section">
          <h3>关注我们</h3>
          <div class="social-links">
            <el-button circle><el-icon><ChatDotRound /></el-icon></el-button>
            <el-button circle><el-icon><VideoCamera /></el-icon></el-button>
            <el-button circle><el-icon><Headset /></el-icon></el-button>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 民宿预约系统 毕业设计项目 | 作者：wxr200466</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  User,
  Document,
  Star,
  SwitchButton,
  Location,
  House,
  Wifi,
  Grid,
  List,
  ArrowDown,
  ChatDotRound,
  VideoCamera,
  Headset
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 搜索相关
const searchKeyword = ref('')
const activeNav = ref('home')
const viewMode = ref('grid') // grid | list

// 筛选条件
const filter = reactive({
  location: '',
  priceRange: '',
  checkInDate: '',
  checkOutDate: '',
  guestCount: 2,
  facilities: [],
  sortBy: 'recommend'
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(12)

// 模拟数据
const mockHomestays = ref([
  {
    id: 1,
    name: '西湖边温馨民宿',
    address: '杭州市西湖区',
    coverImage: 'https://via.placeholder.com/300x200/667eea/ffffff?text=民宿1',
    rating: 4.8,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    price: 298,
    hasWifi: true,
    features: ['WiFi', '空调', '厨房'],
    isRecommended: true,
    isFavorite: false
  },
  // 更多模拟数据...
])

// 计算属性
const isLoggedIn = computed(() => userStore.isLoggedIn)
const userName = computed(() => userStore.getDisplayName())
const userAvatar = computed(() => userStore.avatar)

const filteredHomestays = computed(() => {
  let result = [...mockHomestays.value]
  
  // 位置筛选
  if (filter.location) {
    result = result.filter(item => item.address.includes(filter.location))
  }
  
  // 价格筛选
  if (filter.priceRange) {
    const [min, max] = filter.priceRange.split('-').map(Number)
    result = result.filter(item => item.price >= min && item.price <= max)
  }
  
  // 设施筛选
  if (filter.facilities.length > 0) {
    result = result.filter(item => 
      filter.facilities.every(facility => item.features.includes(facility))
    )
  }
  
  // 排序
  switch (filter.sortBy) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating_desc':
      result.sort((a, b) => b.rating - a.rating)
      break
    default:
      // 推荐排序（默认）
      result.sort((a, b) => b.isRecommended - a.isRecommended)
  }
  
  return result
})

const paginatedHomestays = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredHomestays.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredHomestays.value.length / pageSize.value)
})

const recommendHomestays = computed(() => {
  return mockHomestays.value.filter(item => item.isRecommended).slice(0, 5)
})

const locationOptions = ref([
  { label: '杭州市', value: '杭州' },
  { label: '上海市', value: '上海' },
  { label: '北京市', value: '北京' },
  { label: '广州市', value: '广州' },
  { label: '深圳市', value: '深圳' }
])

const categories = ref([
  { id: 'seaview', name: '海景民宿', icon: '🌊', description: '面朝大海，春暖花开' },
  { id: 'mountain', name: '山居民宿', icon: '⛰️', description: '隐居山林，静享自然' },
  { id: 'ancient', name: '古镇民宿', icon: '🏮', description: '古色古香，文化体验' },
  { id: 'luxury', name: '奢华别墅', icon: '🏰', description: '尊贵享受，私密空间' },
  { id: 'budget', name: '经济实惠', icon: '💰', description: '性价比高，舒适入住' },
  { id: 'family', name: '家庭亲子', icon: '👨‍👩‍👧', description: '适合家庭，儿童友好' }
])

// 方法
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    ElMessage.info(`搜索关键词: ${searchKeyword.value}`)
    // 实际应该调用搜索API
  }
}

const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'orders':
      router.push('/orders')
      break
    case 'collections':
      router.push('/collections')
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    userStore.logout()
    ElMessage.success('退出登录成功')
    router.push('/login')
  } catch {
    // 用户取消
  }
}

const handleNavSelect = (index) => {
  activeNav.value = index
  // 根据导航切换内容
}

const handleFilterChange = () => {
  currentPage.value = 1
  // 实际应该调用API重新加载数据
}

const handleDateChange = () => {
  // 验证日期合法性
  if (filter.checkInDate && filter.checkOutDate) {
    if (filter.checkOutDate <= filter.checkInDate) {
      ElMessage.warning('退房日期必须晚于入住日期')
      filter.checkOutDate = ''
    }
  }
}

const disabledCheckInDate = (date) => {
  // 禁用今天之前的日期
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

const disabledCheckOutDate = (date) => {
  // 退房日期不能早于入住日期
  if (filter.checkInDate) {
    return date <= filter.checkInDate
  }
  return date < new Date()
}

const handleSortChange = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  filter.location = ''
  filter.priceRange = ''
  filter.checkInDate = ''
  filter.checkOutDate = ''
  filter.guestCount = 2
  filter.facilities = []
  filter.sortBy = 'recommend'
  currentPage.value = 1
}

const viewHomestayDetail = (id) => {
  router.push(`/homestay/${id}`)
}

const toggleFavorite = (id) => {
  const homestay = mockHomestays.value.find(item => item.id === id)
  if (homestay) {
    homestay.isFavorite = !homestay.isFavorite
    ElMessage.success(homestay.isFavorite ? '已收藏' : '已取消收藏')
  }
}

const quickBook = (homestay) => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  router.push(`/reservation/${homestay.id}`)
}

const filterByCategory = (categoryId) => {
  // 根据分类筛选
  ElMessage.info(`筛选分类: ${categoryId}`)
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

// 生命周期
onMounted(() => {
  // 可以在这里加载推荐数据
  console.log('Home page mounted')
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 头部样式 */
.home-header {
  background: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  cursor: pointer;
}

.logo-icon {
  font-size: 28px;
  margin-right: 8px;
}

.header-search {
  flex: 1;
  max-width: 500px;
  margin: 0 40px;
}

.search-input {
  border-radius: 20px;
  overflow: hidden;
}

.header-actions {
  display: flex;
  align-items: center;
}

.user-info {
  margin-left: 20px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 20px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: #f5f5f5;
}

.user-name {
  margin: 0 8px;
  font-size: 14px;
  color: #333;
}

/* 导航菜单 */
.main-nav {
  border-top: 1px solid #eee;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-menu {
  border-bottom: none;
}

/* 主内容区 */
.home-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 30px;
}

.filter-card {
  border-radius: 10px;
}

.filter-content {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

/* 民宿列表 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.section-count {
  color: #666;
  font-size: 14px;
}

.view-toggle {
  margin-bottom: 20px;
}

/* 网格视图 */
.homestay-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

.homestay-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
}

.homestay-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.homestay-card:hover .card-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
}

.favorite-btn {
  background: rgba(255, 255, 255, 0.9);
}

.card-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.card-content {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.homestay-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.homestay-address {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.homestay-features {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 13px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.price-section {
  display: flex;
  align-items: baseline;
}

.price-currency {
  font-size: 16px;
  color: #ff6b6b;
  font-weight: 600;
}

.price-value {
  font-size: 24px;
  color: #ff6b6b;
  font-weight: 700;
  margin: 0 2px;
}

.price-unit {
  font-size: 14px;
  color: #999;
}

/* 表格视图 */
.table-homestay-info {
  display: flex;
  gap: 15px;
  align-items: center;
}

.table-image {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
}

.table-info {
  flex: 1;
}

.table-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: #333;
}

.table-address {
  font-size: 13px;
  color: #666;
  margin: 0 0 8px 0;
}

.table-features {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.table-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-score {
  font-size: 14px;
  color: #ff9900;
  font-weight: 600;
}

.table-price {
  display: flex;
  align-items: baseline;
}

.price-amount {
  font-size: 20px;
  color: #ff6b6b;
  font-weight: 700;
}

.table-actions {
  display: flex;
  gap: 8px;
}

/* 推荐区域 */
.recommend-section {
  margin: 40px 0;
}

.carousel-item {
  border-radius: 12px;
  overflow: hidden;
}

.carousel-content {
  position: relative;
  height: 100%;
  cursor: pointer;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 20px;
}

.carousel-info h3 {
  margin: 0 0 5px 0;
  font-size: 20px;
}

.carousel-info p {
  margin: 0 0 10px 0;
  font-size: 14px;
  opacity: 0.9;
}

.carousel-price {
  font-size: 18px;
  font-weight: 700;
}

/* 分类区域 */
.category-section {
  margin: 40px 0;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.category-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
}

.category-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.15);
}

.category-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.category-card h3 {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px 0;
}

.category-card p {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

/* 分页 */
.pagination-section {
  margin: 30px 0;
  display: flex;
  justify-content: center;
}

/* 页脚 */
.home-footer {
  background: #2c3e50;
  color: white;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.footer-section h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #ecf0f1;
}

.footer-section p {
  font-size: 14px;
  color: #bdc3c7;
  margin: 5px 0;
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.footer-bottom {
  background: #1a252f;
  text-align: center;
  padding: 20px;
  font-size: 14px;
  color: #95a5a6;
}
</style>