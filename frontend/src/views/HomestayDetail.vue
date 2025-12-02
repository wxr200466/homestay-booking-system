<template>
  <div class="detail-container">
    <!-- 页面头部 -->
    <header class="detail-header">
      <div class="header-content">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/homestay/list' }">民宿列表</el-breadcrumb-item>
          <el-breadcrumb-item>{{ homestay.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        
        <div class="header-actions">
          <el-button
            :type="isFavorite ? 'danger' : 'info'"
            :icon="Star"
            @click="toggleFavorite"
          >
            {{ isFavorite ? '已收藏' : '收藏' }}
          </el-button>
          <el-button
            type="primary"
            icon="Share"
            @click="handleShare"
          >
            分享
          </el-button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="detail-main">
      <div class="main-content">
        <!-- 左侧：民宿详情 -->
        <div class="detail-left">
          <!-- 图片展示区 -->
          <div class="image-section">
            <!-- 主图 -->
            <div class="main-image">
              <el-image
                :src="currentImage"
                :preview-src-list="imageList"
                fit="cover"
                class="main-image-content"
              />
              <div class="image-controls">
                <el-button
                  circle
                  :icon="ArrowLeft"
                  @click="prevImage"
                  class="nav-btn"
                />
                <div class="image-counter">
                  {{ currentImageIndex + 1 }} / {{ imageList.length }}
                </div>
                <el-button
                  circle
                  :icon="ArrowRight"
                  @click="nextImage"
                  class="nav-btn"
                />
              </div>
            </div>
            
            <!-- 缩略图列表 -->
            <div class="thumbnail-list">
              <div
                v-for="(img, index) in imageList"
                :key="index"
                :class="['thumbnail-item', { active: index === currentImageIndex }]"
                @click="currentImageIndex = index"
              >
                <el-image
                  :src="img"
                  fit="cover"
                  class="thumbnail-image"
                />
              </div>
            </div>
          </div>

          <!-- 基本信息 -->
          <div class="info-section">
            <div class="info-header">
              <h1 class="homestay-title">{{ homestay.name }}</h1>
              <div class="title-actions">
                <el-rate
                  v-model="homestay.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}"
                />
                <span class="review-count">({{ homestay.reviewCount }}条评价)</span>
              </div>
            </div>
            
            <div class="info-subtitle">
              <el-tag type="success" size="large">{{ homestay.type }}</el-tag>
              <span class="address">
                <el-icon><Location /></el-icon>
                {{ homestay.address }}
              </span>
              <span class="host-info">
                房东：
                <el-avatar :size="24" :src="homestay.host.avatar" />
                <span class="host-name">{{ homestay.host.name }}</span>
                <el-tag type="success" size="small" v-if="homestay.host.isSuperHost">
                  超赞房东
                </el-tag>
              </span>
            </div>

            <!-- 特色标签 -->
            <div class="feature-tags">
              <el-tag
                v-for="tag in homestay.features"
                :key="tag"
                type="info"
                size="large"
              >
                {{ tag }}
              </el-tag>
            </div>

            <!-- 房间信息卡片 -->
            <el-card class="room-info-card" shadow="hover">
              <div class="room-grid">
                <div class="room-item">
                  <el-icon class="room-icon"><User /></el-icon>
                  <div class="room-details">
                    <div class="room-label">可住人数</div>
                    <div class="room-value">{{ homestay.maxGuests }}人</div>
                  </div>
                </div>
                <div class="room-item">
                  <el-icon class="room-icon"><House /></el-icon>
                  <div class="room-details">
                    <div class="room-label">房间</div>
                    <div class="room-value">{{ homestay.bedrooms }}室{{ homestay.beds }}床</div>
                  </div>
                </div>
                <div class="room-item">
                  <el-icon class="room-icon"><BathTube /></el-icon>
                  <div class="room-details">
                    <div class="room-label">卫生间</div>
                    <div class="room-value">{{ homestay.bathrooms }}个</div>
                  </div>
                </div>
                <div class="room-item">
                  <el-icon class="room-icon"><OfficeBuilding /></el-icon>
                  <div class="room-details">
                    <div class="room-label">面积</div>
                    <div class="room-value">{{ homestay.area }}㎡</div>
                  </div>
                </div>
              </div>
            </el-card>

            <!-- 设施列表 -->
            <div class="facility-section">
              <h2 class="section-title">
                <el-icon><Setting /></el-icon>
                设施与服务
              </h2>
              <div class="facility-grid">
                <div
                  v-for="facility in homestay.facilities"
                  :key="facility.id"
                  class="facility-item"
                >
                  <el-icon class="facility-icon">{{ facility.icon }}</el-icon>
                  <span class="facility-name">{{ facility.name }}</span>
                </div>
              </div>
            </div>

            <!-- 民宿描述 -->
            <div class="description-section">
              <h2 class="section-title">房源介绍</h2>
              <div class="description-content" v-html="homestay.description"></div>
            </div>

            <!-- 位置地图 -->
            <div class="location-section">
              <h2 class="section-title">
                <el-icon><Location /></el-icon>
                位置
              </h2>
              <div class="location-content">
                <div class="location-info">
                  <p class="location-address">{{ homestay.addressDetail }}</p>
                  <p class="location-tips">{{ homestay.locationTips }}</p>
                </div>
                <div class="location-map">
                  <!-- 这里可以集成地图组件 -->
                  <div class="map-placeholder">
                    <el-icon><MapLocation /></el-icon>
                    <p>地图位置</p>
                    <p class="map-coordinate">坐标: {{ homestay.coordinate }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 房客评价 -->
            <div class="review-section">
              <h2 class="section-title">
                <el-icon><ChatLineRound /></el-icon>
                房客评价
                <span class="review-summary">
                  {{ homestay.rating }}分 · {{ homestay.reviewCount }}条评价
                </span>
              </h2>
              
              <!-- 评分分布 -->
              <div class="rating-distribution">
                <div class="rating-overall">
                  <div class="rating-score">{{ homestay.rating.toFixed(1) }}</div>
                  <div class="rating-stars">
                    <el-rate v-model="homestay.rating" disabled />
                  </div>
                  <div class="rating-count">{{ homestay.reviewCount }}条评价</div>
                </div>
                <div class="rating-bars">
                  <div
                    v-for="item in ratingDistribution"
                    :key="item.stars"
                    class="rating-bar-item"
                  >
                    <span class="bar-label">{{ item.stars }}星</span>
                    <el-progress
                      :percentage="item.percentage"
                      :show-text="false"
                      class="rating-bar"
                    />
                    <span class="bar-count">{{ item.count }}条</span>
                  </div>
                </div>
              </div>

              <!-- 评价列表 -->
              <div class="review-list">
                <div
                  v-for="review in homestay.reviews"
                  :key="review.id"
                  class="review-item"
                >
                  <div class="review-header">
                    <el-avatar :size="40" :src="review.user.avatar" />
                    <div class="review-user">
                      <div class="user-name">{{ review.user.name }}</div>
                      <div class="review-date">{{ review.date }}</div>
                    </div>
                    <div class="review-rating">
                      <el-rate v-model="review.rating" disabled size="small" />
                    </div>
                  </div>
                  <div class="review-content">
                    {{ review.content }}
                  </div>
                  <div class="review-images" v-if="review.images.length > 0">
                    <el-image
                      v-for="(img, idx) in review.images"
                      :key="idx"
                      :src="img"
                      :preview-src-list="review.images"
                      class="review-image"
                    />
                  </div>
                  <div class="review-response" v-if="review.response">
                    <div class="response-header">
                      <el-icon><ChatLineSquare /></el-icon>
                      <span>房东回复：</span>
                    </div>
                    <div class="response-content">{{ review.response }}</div>
                  </div>
                </div>
              </div>

              <!-- 查看更多评价 -->
              <div class="review-more" v-if="homestay.reviewCount > 3">
                <el-button type="primary" text @click="viewAllReviews">
                  查看全部{{ homestay.reviewCount }}条评价
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>

            <!-- 房东信息 -->
            <div class="host-section">
              <h2 class="section-title">
                <el-icon><UserFilled /></el-icon>
                房东介绍
              </h2>
              <div class="host-content">
                <div class="host-profile">
                  <el-avatar :size="80" :src="homestay.host.avatar" />
                  <div class="host-info">
                    <h3 class="host-name">{{ homestay.host.name }}</h3>
                    <div class="host-tags">
                      <el-tag type="success" v-if="homestay.host.isSuperHost">
                        超赞房东
                      </el-tag>
                      <el-tag>已实名认证</el-tag>
                      <el-tag>5年房东经验</el-tag>
                    </div>
                    <p class="host-description">{{ homestay.host.description }}</p>
                  </div>
                </div>
                <div class="host-stats">
                  <div class="stat-item">
                    <div class="stat-value">98%</div>
                    <div class="stat-label">回复率</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">1小时内</div>
                    <div class="stat-label">平均回复时间</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">200+</div>
                    <div class="stat-label">接待房客</div>
                  </div>
                </div>
                <div class="host-actions">
                  <el-button type="primary" icon="ChatLineRound">
                    联系房东
                  </el-button>
                  <el-button icon="View">
                    查看房东其他房源
                  </el-button>
                </div>
              </div>
            </div>

            <!-- 预订须知 -->
            <div class="notice-section">
              <h2 class="section-title">
                <el-icon><InfoFilled /></el-icon>
                预订须知
              </h2>
              <div class="notice-content">
                <el-collapse v-model="activeNotices">
                  <el-collapse-item title="入住政策" name="checkin">
                    <ul>
                      <li>入住时间：14:00后</li>
                      <li>退房时间：12:00前</li>
                      <li>自助入住：凭密码入住</li>
                      <li>允许携带宠物</li>
                      <li>允许举办派对/活动</li>
                    </ul>
                  </el-collapse-item>
                  <el-collapse-item title="取消政策" name="cancel">
                    <p>在入住日期前7天取消预订，可获得全额退款。</p>
                    <p>在入住日期前3-7天取消预订，可获得50%退款。</p>
                    <p>在入住日期前3天内取消预订，不予退款。</p>
                  </el-collapse-item>
                  <el-collapse-item title="安全须知" name="safety">
                    <p>请注意安全，保管好个人财物。</p>
                    <p>遵守当地法律法规。</p>
                    <p>紧急情况请联系房东或拨打紧急电话。</p>
                  </el-collapse-item>
                  <el-collapse-item title="其他注意事项" name="other">
                    <p>请爱护房屋设施。</p>
                    <p>保持房屋整洁。</p>
                    <p>遵守小区管理规定。</p>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：预订卡片 -->
        <div class="detail-right">
          <div class="booking-card">
            <div class="card-header">
              <div class="price-display">
                <span class="price-currency">¥</span>
                <span class="price-value">{{ homestay.price }}</span>
                <span class="price-unit">/晚</span>
              </div>
              <div class="rating-badge">
                <el-rate v-model="homestay.rating" disabled size="small" />
                <span class="rating-text">{{ homestay.reviewCount }}条评价</span>
              </div>
            </div>

            <!-- 日期选择 -->
            <div class="booking-dates">
              <div class="date-field">
                <label>入住</label>
                <el-date-picker
                  v-model="booking.checkInDate"
                  type="date"
                  placeholder="选择日期"
                  :disabled-date="disabledCheckInDate"
                  size="large"
                />
              </div>
              <div class="date-field">
                <label>退房</label>
                <el-date-picker
                  v-model="booking.checkOutDate"
                  type="date"
                  placeholder="选择日期"
                  :disabled-date="disabledCheckOutDate"
                  size="large"
                />
              </div>
            </div>

            <!-- 人数选择 -->
            <div class="booking-guests">
              <label>房客</label>
              <div class="guest-selector">
                <div class="guest-item">
                  <span>成人</span>
                  <el-input-number
                    v-model="booking.adults"
                    :min="1"
                    :max="homestay.maxGuests"
                    size="small"
                  />
                </div>
                <div class="guest-item">
                  <span>儿童</span>
                  <el-input-number
                    v-model="booking.children"
                    :min="0"
                    :max="4"
                    size="small"
                  />
                </div>
                <div class="guest-item">
                  <span>婴儿</span>
                  <el-input-number
                    v-model="booking.infants"
                    :min="0"
                    :max="2"
                    size="small"
                  />
                </div>
              </div>
            </div>

            <!-- 价格明细 -->
            <div class="price-breakdown">
              <div class="price-item">
                <span>¥{{ homestay.price }} × {{ nights }}晚</span>
                <span>¥{{ subtotal }}</span>
              </div>
              <div class="price-item">
                <span>清洁费</span>
                <span>¥{{ homestay.cleaningFee }}</span>
              </div>
              <div class="price-item">
                <span>服务费</span>
                <span>¥{{ serviceFee }}</span>
              </div>
              <div class="price-item total">
                <span>总计</span>
                <span class="total-price">¥{{ totalPrice }}</span>
              </div>
            </div>

            <!-- 预订按钮 -->
            <div class="booking-actions">
              <el-button
                type="primary"
                size="large"
                @click="handleBooking"
                :disabled="!canBook"
                class="book-btn"
              >
                {{ bookingButtonText }}
              </el-button>
              <p class="booking-notice">
                预订后不会被立即扣款，房东确认后才需支付
              </p>
            </div>

            <!-- 举报按钮 -->
            <div class="report-section">
              <el-button type="text" icon="Warning" @click="handleReport">
                举报此房源
              </el-button>
            </div>
          </div>

          <!-- 相似房源推荐 -->
          <div class="similar-homestays">
            <h3>相似房源</h3>
            <div class="similar-list">
              <div
                v-for="item in similarHomestays"
                :key="item.id"
                class="similar-item"
                @click="$router.push(`/homestay/${item.id}`)"
              >
                <el-image :src="item.coverImage" fit="cover" class="similar-image" />
                <div class="similar-info">
                  <h4>{{ item.name }}</h4>
                  <div class="similar-price">¥{{ item.price }}/晚</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部导航 -->
    <footer class="detail-footer">
      <div class="footer-content">
        <div class="footer-price">
          <span class="footer-price-label">每晚价格</span>
          <div class="footer-price-value">
            <span class="currency">¥</span>
            <span class="value">{{ homestay.price }}</span>
          </div>
        </div>
        <div class="footer-actions">
          <el-button
            :type="isFavorite ? 'danger' : 'info'"
            :icon="Star"
            @click="toggleFavorite"
          >
            {{ isFavorite ? '已收藏' : '收藏' }}
          </el-button>
          <el-button type="primary" size="large" @click="handleBooking">
            立即预订
          </el-button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Star,
  Share,
  ArrowLeft,
  ArrowRight,
  Location,
  User,
  House,
  BathTube,
  OfficeBuilding,
  Setting,
  MapLocation,
  ChatLineRound,
  ChatLineSquare,
  UserFilled,
  InfoFilled,
  Warning
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 民宿ID从路由参数获取
const homestayId = computed(() => route.params.id)

// 图片相关
const imageList = ref([
  'https://via.placeholder.com/800x600/667eea/ffffff?text=民宿主图1',
  'https://via.placeholder.com/800x600/764ba2/ffffff?text=民宿主图2',
  'https://via.placeholder.com/800x600/f093fb/ffffff?text=民宿主图3',
  'https://via.placeholder.com/800x600/f5576c/ffffff?text=民宿主图4',
  'https://via.placeholder.com/800x600/4fd1c5/ffffff?text=民宿主图5'
])
const currentImageIndex = ref(0)
const currentImage = computed(() => imageList.value[currentImageIndex.value])

// 民宿数据
const homestay = reactive({
  id: 1,
  name: '西湖边温馨民宿 · 观景大床房',
  type: '整套公寓',
  address: '杭州市西湖区龙井路88号',
  addressDetail: '西湖风景区，步行5分钟可达西湖，周边餐厅、咖啡馆林立',
  locationTips: '交通便利，靠近地铁站，周边生活设施齐全',
  coordinate: '120.16, 30.27',
  rating: 4.8,
  reviewCount: 128,
  price: 398,
  cleaningFee: 80,
  maxGuests: 4,
  bedrooms: 2,
  beds: 2,
  bathrooms: 1,
  area: 65,
  description: `
    <p>位于西湖风景区的精致民宿，拥有绝佳的湖景视野。房间装修温馨舒适，设施齐全，是您度假的理想选择。</p>
    <p>房间配备：</p>
    <ul>
      <li>舒适大床（1.8×2.0米）</li>
      <li>独立卫生间（24小时热水）</li>
      <li>高速WiFi</li>
      <li>空调、暖气</li>
      <li>厨房设施（可做饭）</li>
    </ul>
    <p>周边景点：西湖、雷峰塔、灵隐寺等。</p>
  `,
  features: ['湖景房', '可做饭', '免费停车', '自助入住', '允许带宠物'],
  facilities: [
    { id: 1, name: 'WiFi', icon: 'VideoPlay' },
    { id: 2, name: '空调', icon: 'Sunny' },
    { id: 3, name: '厨房', icon: 'Food' },
    { id: 4, name: '洗衣机', icon: 'Loading' },
    { id: 5, name: '烘干机', icon: 'Sunrise' },
    { id: 6, name: '电视', icon: 'VideoCamera' },
    { id: 7, name: '暖气', icon: 'Sunny' },
    { id: 8, name: '热水', icon: 'Watermelon' },
    { id: 9, name: '停车位', icon: 'Van' },
    { id: 10, name: '游泳池', icon: 'Watermelon' }
  ],
  host: {
    id: 1,
    name: '张房东',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    isSuperHost: true,
    description: '5年房东经验，热爱旅游和民宿经营，希望能为每位房客提供舒适的住宿体验。'
  },
  reviews: [
    {
      id: 1,
      user: {
        name: '李小姐',
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
      },
      rating: 5,
      date: '2024-11-15',
      content: '民宿位置非常好，步行到西湖只要5分钟。房间干净整洁，房东很热情，回复很快。强烈推荐！',
      images: [],
      response: '感谢李小姐的好评！欢迎下次再来！'
    },
    {
      id: 2,
      user: {
        name: '王先生',
        avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
      },
      rating: 4.5,
      date: '2024-11-10',
      content: '房间很温馨，设施齐全，特别是床很舒服。周边吃饭很方便，下次还会选择这里。',
      images: [
        'https://via.placeholder.com/300x200/667eea/ffffff?text=评价图片1',
        'https://via.placeholder.com/300x200/764ba2/ffffff?text=评价图片2'
      ],
      response: ''
    }
  ]
})

// 评分分布
const ratingDistribution = computed(() => [
  { stars: 5, count: 96, percentage: 75 },
  { stars: 4, count: 24, percentage: 19 },
  { stars: 3, count: 5, percentage: 4 },
  { stars: 2, count: 2, percentage: 2 },
  { stars: 1, count: 1, percentage: 1 }
])

// 收藏状态
const isFavorite = ref(false)

// 预订信息
const booking = reactive({
  checkInDate: '',
  checkOutDate: '',
  adults: 2,
  children: 0,
  infants: 0,
  specialRequests: ''
})

// 展开的注意事项
const activeNotices = ref(['checkin'])

// 相似房源
const similarHomestays = ref([
  { id: 2, name: '西湖观景公寓', coverImage: 'https://via.placeholder.com/100x80/667eea/ffffff?text=相似1', price: 350 },
  { id: 3, name: '龙井茶山别墅', coverImage: 'https://via.placeholder.com/100x80/764ba2/ffffff?text=相似2', price: 550 },
  { id: 4, name: '西溪湿地木屋', coverImage: 'https://via.placeholder.com/100x80/f093fb/ffffff?text=相似3', price: 280 }
])

// 计算属性
const nights = computed(() => {
  if (!booking.checkInDate || !booking.checkOutDate) return 0
  const diff = new Date(booking.checkOutDate) - new Date(booking.checkInDate)
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const subtotal = computed(() => homestay.price * nights)

const serviceFee = computed(() => Math.round(homestay.price * nights.value * 0.1))

const totalPrice = computed(() => subtotal.value + homestay.cleaningFee + serviceFee.value)

const canBook = computed(() => {
  return booking.checkInDate && 
         booking.checkOutDate && 
         booking.adults > 0 &&
         nights.value > 0
})

const bookingButtonText = computed(() => {
  if (!userStore.isLoggedIn) return '请先登录'
  if (!canBook.value) return '请选择日期'
  return `预订 · ¥${totalPrice.value}`
})

// 方法
const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + imageList.value.length) % imageList.value.length
}

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % imageList.value.length
}

const toggleFavorite = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  isFavorite.value = !isFavorite.value
  ElMessage.success(isFavorite.value ? '已添加到收藏' : '已取消收藏')
}

const handleShare = () => {
  ElMessage.success('链接已复制到剪贴板')
  // 实际应该复制分享链接
}

const disabledCheckInDate = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

const disabledCheckOutDate = (date) => {
  if (booking.checkInDate) {
    return date <= booking.checkInDate
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

const handleBooking = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  if (!canBook.value) {
    ElMessage.warning('请填写完整的预订信息')
    return
  }
  
  // 跳转到确认页面
  router.push({
    path: '/reservation/confirm',
    query: {
      homestayId: homestayId.value,
      checkIn: booking.checkInDate,
      checkOut: booking.checkOutDate,
      adults: booking.adults,
      children: booking.children,
      infants: booking.infants
    }
  })
}

const viewAllReviews = () => {
  // 跳转到评价页面
  ElMessage.info('查看全部评价功能开发中')
}

const handleReport = () => {
  ElMessageBox.prompt('请输入举报原因', '举报房源', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    inputType: 'textarea',
    inputPlaceholder: '请详细描述举报原因...'
  }).then(({ value }) => {
    if (value) {
      ElMessage.success('举报已提交，我们会尽快处理')
    }
  }).catch(() => {
    // 取消
  })
}

// 生命周期
onMounted(() => {
  // 模拟加载数据
  console.log('加载民宿详情，ID:', homestayId.value)
  
  // 检查是否已收藏
  // 实际应该调用API检查收藏状态
})
</script>

<style scoped>
.detail-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 头部 */
.detail-header {
  background: white;
  border-bottom: 1px solid #eee;
  padding: 16px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* 主内容区 */
.detail-main {
  flex: 1;
  background: #f5f5f5;
  padding: 24px 0;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 40px;
}

/* 左侧详情 */
.detail-left {
  flex: 1;
  min-width: 0;
}

/* 右侧预订卡片 */
.detail-right {
  width: 380px;
  position: sticky;
  top: 20px;
  height: fit-content;
}

/* 图片区域 */
.image-section {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.main-image {
  position: relative;
  height: 500px;
}

.main-image-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 30px;
}

.nav-btn {
  background: white;
  border: none;
}

.nav-btn:hover {
  background: #f5f5f5;
}

.image-counter {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.thumbnail-list {
  display: flex;
  gap: 8px;
  padding: 16px;
  overflow-x: auto;
}

.thumbnail-item {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  flex-shrink: 0;
}

.thumbnail-item.active {
  border-color: #409eff;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 信息区域 */
.info-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.info-header {
  margin-bottom: 20px;
}

.homestay-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
}

.title-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-count {
  color: #666;
  font-size: 14px;
}

.info-subtitle {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.address {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 14px;
}

.host-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.host-name {
  font-weight: 500;
}

.feature-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

/* 房间信息卡片 */
.room-info-card {
  margin-bottom: 24px;
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.room-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.room-icon {
  font-size: 24px;
  color: #409eff;
}

.room-label {
  font-size: 12px;
  color: #666;
}

.room-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 设施区域 */
.facility-section {
  margin: 32px 0;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.facility-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.facility-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.facility-icon {
  color: #409eff;
  font-size: 20px;
}

.facility-name {
  font-size: 14px;
  color: #333;
}

/* 描述区域 */
.description-section {
  margin: 32px 0;
}

.description-content {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
}

.description-content ul {
  padding-left: 20px;
}

.description-content li {
  margin-bottom: 8px;
}

/* 位置区域 */
.location-section {
  margin: 32px 0;
}

.location-content {
  display: flex;
  gap: 40px;
}

.location-info {
  flex: 1;
}

.location-address {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.location-tips {
  font-size: 14px;
  color: #666;
}

.location-map {
  width: 300px;
  height: 200px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.map-placeholder {
  text-align: center;
  color: #999;
}

.map-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.map-coordinate {
  font-size: 12px;
  margin-top: 8px;
}

/* 评价区域 */
.review-section {
  margin: 32px 0;
}

.review-summary {
  font-size: 16px;
  font-weight: normal;
  color: #666;
  margin-left: 12px;
}

.rating-distribution {
  display: flex;
  gap: 40px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
}

.rating-overall {
  text-align: center;
}

.rating-score {
  font-size: 48px;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.rating-stars {
  margin: 8px 0;
}

.rating-count {
  font-size: 14px;
  color: #666;
}

.rating-bars {
  flex: 1;
}

.rating-bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.bar-label {
  width: 40px;
  font-size: 14px;
  color: #666;
}

.rating-bar {
  flex: 1;
}

.bar-count {
  width: 50px;
  text-align: right;
  font-size: 14px;
  color: #666;
}

.review-list {
  margin-bottom: 24px;
}

.review-item {
  padding: 24px 0;
  border-bottom: 1px solid #eee;
}

.review-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
}

.review-user {
  flex: 1;
}

.user-name {
  font-weight: 500;
  color: #333;
}

.review-date {
  font-size: 12px;
  color: #999;
}

.review-content {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 16px;
}

.review-images {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.review-image {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  object-fit: cover;
}

.review-response {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.response-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #409eff;
  font-weight: 500;
}

.response-content {
  color: #333;
  line-height: 1.6;
}

.review-more {
  text-align: center;
  padding: 16px;
}

/* 房东区域 */
.host-section {
  margin: 32px 0;
}

.host-content {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 32px;
}

.host-profile {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.host-info {
  flex: 1;
}

.host-name {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.host-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.host-description {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
}

.host-stats {
  display: flex;
  gap: 40px;
  margin-bottom: 24px;
  justify-content: center;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.host-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 注意事项 */
.notice-section {
  margin: 32px 0;
}

/* 预订卡片 */
.booking-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.price-display {
  display: flex;
  align-items: baseline;
}

.price-currency {
  font-size: 18px;
  color: #ff6b6b;
  font-weight: 600;
}

.price-value {
  font-size: 32px;
  color: #ff6b6b;
  font-weight: 700;
  margin: 0 4px;
}

.price-unit {
  font-size: 16px;
  color: #666;
}

.rating-badge {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-text {
  font-size: 12px;
  color: #666;
}

.booking-dates {
  margin-bottom: 24px;
}

.date-field {
  margin-bottom: 16px;
}

.date-field label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.booking-guests {
  margin-bottom: 24px;
}

.booking-guests label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 500;
}

.guest-selector {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.guest-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.guest-item:last-child {
  margin-bottom: 0;
}

.price-breakdown {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}

.price-item.total {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
  font-weight: 600;
}

.total-price {
  font-size: 20px;
  color: #ff6b6b;
}

.booking-actions {
  margin-bottom: 24px;
}

.book-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.booking-notice {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: 12px;
}

.report-section {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

/* 相似房源 */
.similar-homestays {
  margin-top: 24px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.similar-homestays h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.similar-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.similar-item {
  display: flex;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.similar-item:hover {
  background-color: #f5f5f5;
}

.similar-image {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  flex-shrink: 0;
}

.similar-info {
  flex: 1;
}

.similar-info h4 {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.similar-price {
  font-size: 14px;
  color: #ff6b6b;
  font-weight: 600;
}

/* 底部导航 */
.detail-footer {
  background: white;
  border-top: 1px solid #eee;
  padding: 16px 0;
  position: sticky;
  bottom: 0;
  z-index: 100;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-price {
  display: flex;
  flex-direction: column;
}

.footer-price-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.footer-price-value {
  display: flex;
  align-items: baseline;
}

.footer-price-value .currency {
  font-size: 16px;
  color: #ff6b6b;
  font-weight: 600;
}

.footer-price-value .value {
  font-size: 28px;
  color: #ff6b6b;
  font-weight: 700;
  margin: 0 4px;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .main-content {
    flex-direction: column;
  }
  
  .detail-right {
    width: 100%;
    position: static;
  }
  
  .location-content {
    flex-direction: column;
  }
  
  .location-map {
    width: 100%;
    height: 300px;
  }
}

@media (max-width: 768px) {
  .room-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .rating-distribution {
    flex-direction: column;
    gap: 24px;
  }
}
</style>