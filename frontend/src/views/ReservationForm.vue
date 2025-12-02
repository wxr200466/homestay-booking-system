<template>
  <div class="reservation-container">
    <!-- 进度条 -->
    <div class="progress-section">
      <div class="progress-content">
        <el-steps :active="currentStep" align-center>
          <el-step title="选择日期" description="选择入住和退房日期" />
          <el-step title="填写信息" description="填写入住人信息" />
          <el-step title="确认支付" description="确认订单并支付" />
          <el-step title="预订成功" description="收到预订确认" />
        </el-steps>
      </div>
    </div>

    <div class="reservation-main">
      <div class="main-content">
        <!-- 左侧：表单区域 -->
        <div class="form-left">
          <el-card class="form-card">
            <!-- 步骤1：选择日期 -->
            <div v-if="currentStep === 1" class="step-content">
              <h2 class="step-title">选择入住日期</h2>
              
              <!-- 房源信息摘要 -->
              <div class="homestay-summary">
                <el-image
                  :src="homestay.coverImage"
                  class="summary-image"
                  fit="cover"
                />
                <div class="summary-info">
                  <h3>{{ homestay.name }}</h3>
                  <div class="summary-rating">
                    <el-rate v-model="homestay.rating" disabled size="small" />
                    <span class="rating-text">{{ homestay.reviewCount }}条评价</span>
                  </div>
                  <p class="summary-address">
                    <el-icon><Location /></el-icon>
                    {{ homestay.address }}
                  </p>
                </div>
              </div>

              <!-- 日期选择 -->
              <div class="date-selection">
                <div class="date-field">
                  <label>入住日期</label>
                  <el-date-picker
                    v-model="reservation.checkInDate"
                    type="date"
                    placeholder="选择入住日期"
                    :disabled-date="disabledCheckInDate"
                    size="large"
                    @change="handleDateChange"
                  />
                </div>
                
                <div class="date-field">
                  <label>退房日期</label>
                  <el-date-picker
                    v-model="reservation.checkOutDate"
                    type="date"
                    placeholder="选择退房日期"
                    :disabled-date="disabledCheckOutDate"
                    size="large"
                    @change="handleDateChange"
                  />
                </div>
              </div>

              <!-- 入住晚数 -->
              <div class="nights-info" v-if="nights > 0">
                <el-alert
                  :title="`您将入住 ${nights} 晚`"
                  type="info"
                  :closable="false"
                  show-icon
                />
              </div>

              <!-- 房客信息 -->
              <div class="guest-selection">
                <h3 class="section-title">房客信息</h3>
                <div class="guest-fields">
                  <div class="guest-field">
                    <label>成人（18岁以上）</label>
                    <el-input-number
                      v-model="reservation.adults"
                      :min="1"
                      :max="homestay.maxGuests"
                      @change="updateGuestCount"
                    />
                  </div>
                  
                  <div class="guest-field">
                    <label>儿童（2-17岁）</label>
                    <el-input-number
                      v-model="reservation.children"
                      :min="0"
                      :max="4"
                      @change="updateGuestCount"
                    />
                  </div>
                  
                  <div class="guest-field">
                    <label>婴儿（2岁以下）</label>
                    <el-input-number
                      v-model="reservation.infants"
                      :min="0"
                      :max="2"
                      @change="updateGuestCount"
                    />
                  </div>
                </div>
                
                <div class="guest-total">
                  <span>总计：</span>
                  <span class="total-count">{{ totalGuests }} 位房客</span>
                  <span class="capacity-info" v-if="totalGuests > homestay.maxGuests">
                    （超过最大入住人数 {{ homestay.maxGuests }} 人）
                  </span>
                </div>
              </div>

              <!-- 导航按钮 -->
              <div class="step-actions">
                <el-button @click="$router.go(-1)">返回</el-button>
                <el-button
                  type="primary"
                  @click="nextStep"
                  :disabled="!canProceedStep1"
                >
                  下一步：填写信息
                </el-button>
              </div>
            </div>

            <!-- 步骤2：填写信息 -->
            <div v-else-if="currentStep === 2" class="step-content">
              <h2 class="step-title">填写入住信息</h2>
              
              <!-- 入住人信息 -->
              <div class="guest-info-section">
                <h3 class="section-title">主要入住人信息</h3>
                <el-form
                  ref="guestFormRef"
                  :model="guestInfo"
                  :rules="guestRules"
                  label-width="100px"
                >
                  <el-form-item label="姓名" prop="name">
                    <el-input
                      v-model="guestInfo.name"
                      placeholder="请输入真实姓名"
                      clearable
                    />
                  </el-form-item>
                  
                  <el-form-item label="手机号" prop="phone">
                    <el-input
                      v-model="guestInfo.phone"
                      placeholder="请输入手机号"
                      clearable
                    />
                  </el-form-item>
                  
                  <el-form-item label="邮箱" prop="email">
                    <el-input
                      v-model="guestInfo.email"
                      placeholder="请输入邮箱"
                      clearable
                    />
                  </el-form-item>
                  
                  <el-form-item label="身份证号" prop="idCard">
                    <el-input
                      v-model="guestInfo.idCard"
                      placeholder="请输入身份证号"
                      clearable
                    />
                  </el-form-item>
                </el-form>
              </div>

              <!-- 特殊需求 -->
              <div class="special-requests">
                <h3 class="section-title">特殊需求（选填）</h3>
                <el-input
                  v-model="reservation.specialRequests"
                  type="textarea"
                  :rows="4"
                  placeholder="如有特殊需求，请在此说明（如：需要婴儿床、接机服务等）"
                  maxlength="500"
                  show-word-limit
                />
              </div>

              <!-- 房东留言 -->
              <div class="message-to-host">
                <h3 class="section-title">给房东的留言</h3>
                <el-input
                  v-model="reservation.messageToHost"
                  type="textarea"
                  :rows="3"
                  placeholder="告诉房东您的入住计划或任何需要说明的事项"
                  maxlength="300"
                  show-word-limit
                />
              </div>

              <!-- 发票信息 -->
              <div class="invoice-section">
                <h3 class="section-title">
                  <el-checkbox v-model="needInvoice">需要发票</el-checkbox>
                </h3>
                
                <div v-if="needInvoice" class="invoice-form">
                  <el-form
                    :model="invoiceInfo"
                    :rules="invoiceRules"
                    label-width="100px"
                  >
                    <el-form-item label="发票类型" prop="type">
                      <el-select v-model="invoiceInfo.type" placeholder="请选择发票类型">
                        <el-option label="个人" value="personal" />
                        <el-option label="企业" value="company" />
                      </el-select>
                    </el-form-item>
                    
                    <el-form-item label="发票抬头" prop="title">
                      <el-input
                        v-model="invoiceInfo.title"
                        placeholder="请输入发票抬头"
                        clearable
                      />
                    </el-form-item>
                    
                    <el-form-item label="税号" prop="taxNumber" v-if="invoiceInfo.type === 'company'">
                      <el-input
                        v-model="invoiceInfo.taxNumber"
                        placeholder="请输入纳税人识别号"
                        clearable
                      />
                    </el-form-item>
                    
                    <el-form-item label="收票邮箱" prop="email">
                      <el-input
                        v-model="invoiceInfo.email"
                        placeholder="请输入收票邮箱"
                        clearable
                      />
                    </el-form-item>
                  </el-form>
                </div>
              </div>

              <!-- 导航按钮 -->
              <div class="step-actions">
                <el-button @click="prevStep">上一步</el-button>
                <el-button
                  type="primary"
                  @click="nextStep"
                  :disabled="!canProceedStep2"
                >
                  下一步：确认支付
                </el-button>
              </div>
            </div>

            <!-- 步骤3：确认支付 -->
            <div v-else-if="currentStep === 3" class="step-content">
              <h2 class="step-title">确认订单并支付</h2>
              
              <!-- 订单信息确认 -->
              <div class="order-summary">
                <h3 class="section-title">订单信息</h3>
                
                <div class="order-details">
                  <div class="order-item">
                    <span class="order-label">民宿名称：</span>
                    <span class="order-value">{{ homestay.name }}</span>
                  </div>
                  
                  <div class="order-item">
                    <span class="order-label">入住日期：</span>
                    <span class="order-value">{{ formatDate(reservation.checkInDate) }}</span>
                  </div>
                  
                  <div class="order-item">
                    <span class="order-label">退房日期：</span>
                    <span class="order-value">{{ formatDate(reservation.checkOutDate) }}</span>
                  </div>
                  
                  <div class="order-item">
                    <span class="order-label">入住晚数：</span>
                    <span class="order-value">{{ nights }} 晚</span>
                  </div>
                  
                  <div class="order-item">
                    <span class="order-label">房客信息：</span>
                    <span class="order-value">
                      {{ reservation.adults }} 位成人
                      <span v-if="reservation.children > 0">, {{ reservation.children }} 位儿童</span>
                      <span v-if="reservation.infants > 0">, {{ reservation.infants }} 位婴儿</span>
                    </span>
                  </div>
                  
                  <div class="order-item">
                    <span class="order-label">入住人：</span>
                    <span class="order-value">{{ guestInfo.name }}</span>
                  </div>
                  
                  <div class="order-item" v-if="reservation.specialRequests">
                    <span class="order-label">特殊需求：</span>
                    <span class="order-value">{{ reservation.specialRequests }}</span>
                  </div>
                </div>
              </div>

              <!-- 价格明细 -->
              <div class="price-details-section">
                <h3 class="section-title">价格明细</h3>
                
                <div class="price-details">
                  <div class="price-row">
                    <span>¥{{ homestay.price }} × {{ nights }}晚</span>
                    <span>¥{{ subtotal }}</span>
                  </div>
                  
                  <div class="price-row">
                    <span>清洁费</span>
                    <span>¥{{ homestay.cleaningFee }}</span>
                  </div>
                  
                  <div class="price-row">
                    <span>服务费</span>
                    <span>¥{{ serviceFee }}</span>
                  </div>
                  
                  <!-- 优惠券 -->
                  <div class="coupon-section">
                    <div class="coupon-header">
                      <span>优惠券</span>
                      <el-button type="text" @click="showCouponDialog = true">
                        {{ selectedCoupon ? '已选择优惠券' : '选择优惠券' }}
                      </el-button>
                    </div>
                    
                    <div class="coupon-info" v-if="selectedCoupon">
                      <span class="coupon-name">{{ selectedCoupon.name }}</span>
                      <span class="coupon-discount">-¥{{ selectedCoupon.discount }}</span>
                    </div>
                  </div>
                  
                  <div class="price-row total">
                    <span>总计</span>
                    <span class="total-price">¥{{ totalPrice }}</span>
                  </div>
                </div>
              </div>

              <!-- 支付方式 -->
              <div class="payment-methods">
                <h3 class="section-title">选择支付方式</h3>
                
                <div class="method-list">
                  <div
                    v-for="method in paymentMethods"
                    :key="method.id"
                    :class="['method-item', { active: paymentMethod === method.id }]"
                    @click="paymentMethod = method.id"
                  >
                    <div class="method-icon">
                      <el-icon :size="24">
                        <component :is="method.icon" />
                      </el-icon>
                    </div>
                    <div class="method-info">
                      <div class="method-name">{{ method.name }}</div>
                      <div class="method-desc">{{ method.description }}</div>
                    </div>
                    <div class="method-check">
                      <el-radio :model-value="paymentMethod" :label="method.id" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 预订政策确认 -->
              <div class="policy-confirm">
                <el-checkbox v-model="agreePolicy">
                  我已阅读并同意
                  <el-link type="primary" :underline="false">《预订政策》</el-link>、
                  <el-link type="primary" :underline="false">《取消政策》</el-link>和
                  <el-link type="primary" :underline="false">《隐私政策》</el-link>
                </el-checkbox>
              </div>

              <!-- 导航按钮 -->
              <div class="step-actions">
                <el-button @click="prevStep">上一步</el-button>
                <el-button
                  type="primary"
                  @click="handlePayment"
                  :loading="paying"
                  :disabled="!canProceedStep3"
                >
                  {{ paying ? '支付中...' : `确认支付 ¥${totalPrice}` }}
                </el-button>
              </div>
            </div>

            <!-- 步骤4：预订成功 -->
            <div v-else class="step-content">
              <div class="success-content">
                <div class="success-icon">
                  <el-icon :size="80" color="#67c23a">
                    <CircleCheck />
                  </el-icon>
                </div>
                
                <h2 class="success-title">预订成功！</h2>
                
                <div class="success-message">
                  <p>您的订单已提交成功，订单号：<strong>{{ orderNo }}</strong></p>
                  <p>我们已向您的邮箱发送确认邮件，请注意查收。</p>
                  <p>房东确认后，您将收到入住指引。</p>
                </div>
                
                <div class="success-details">
                  <div class="detail-card">
                    <h3>订单信息</h3>
                    <div class="detail-item">
                      <span>订单号：</span>
                      <span>{{ orderNo }}</span>
                    </div>
                    <div class="detail-item">
                      <span>民宿名称：</span>
                      <span>{{ homestay.name }}</span>
                    </div>
                    <div class="detail-item">
                      <span>入住日期：</span>
                      <span>{{ formatDate(reservation.checkInDate) }}</span>
                    </div>
                    <div class="detail-item">
                      <span>退房日期：</span>
                      <span>{{ formatDate(reservation.checkOutDate) }}</span>
                    </div>
                    <div class="detail-item">
                      <span>支付金额：</span>
                      <span class="payment-amount">¥{{ totalPrice }}</span>
                    </div>
                    <div class="detail-item">
                      <span>支付方式：</span>
                      <span>{{ getPaymentMethodName() }}</span>
                    </div>
                  </div>
                  
                  <div class="detail-card">
                    <h3>入住指引</h3>
                    <div class="guidance-list">
                      <div class="guidance-item">
                        <el-icon><Message /></el-icon>
                        <span>房东确认订单后，您将收到入住指引邮件</span>
                      </div>
                      <div class="guidance-item">
                        <el-icon><Key /></el-icon>
                        <span>入住前1天会发送门锁密码到您的手机</span>
                      </div>
                      <div class="guidance-item">
                        <el-icon><Clock /></el-icon>
                        <span>入住时间：14:00后，退房时间：12:00前</span>
                      </div>
                      <div class="guidance-item">
                        <el-icon><Phone /></el-icon>
                        <span>如有问题，请联系房东或客服</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="success-actions">
                  <el-button @click="viewOrderDetail">查看订单详情</el-button>
                  <el-button type="primary" @click="goToHome">返回首页</el-button>
                  <el-button type="success" @click="downloadInvoice" v-if="needInvoice">
                    下载电子发票
                  </el-button>
                </div>
                
                <div class="success-tips">
                  <el-alert
                    title="温馨提示"
                    type="info"
                    :closable="false"
                    description="请保持手机畅通，以便接收入住信息。如需更改或取消预订，请在订单详情页面操作。"
                  />
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 右侧：价格摘要 -->
        <div class="summary-right">
          <!-- 价格摘要卡片 -->
          <el-card class="summary-card">
            <div class="summary-header">
              <h3>价格摘要</h3>
            </div>
            
            <div class="summary-dates">
              <div class="date-info">
                <div class="date-label">入住</div>
                <div class="date-value">{{ formatDate(reservation.checkInDate) || '选择日期' }}</div>
              </div>
              <div class="date-separator">→</div>
              <div class="date-info">
                <div class="date-label">退房</div>
                <div class="date-value">{{ formatDate(reservation.checkOutDate) || '选择日期' }}</div>
              </div>
            </div>
            
            <div class="summary-guests" v-if="totalGuests > 0">
              <div class="guest-label">房客</div>
              <div class="guest-value">{{ totalGuests }} 位</div>
            </div>
            
            <div class="summary-price">
              <div class="price-breakdown">
                <div class="price-item">
                  <span>¥{{ homestay.price }} × {{ nights || 1 }}晚</span>
                  <span>¥{{ subtotal }}</span>
                </div>
                
                <div class="price-item" v-if="nights > 0">
                  <span>清洁费</span>
                  <span>¥{{ homestay.cleaningFee }}</span>
                </div>
                
                <div class="price-item" v-if="nights > 0">
                  <span>服务费</span>
                  <span>¥{{ serviceFee }}</span>
                </div>
                
                <div class="price-item discount" v-if="selectedCoupon">
                  <span>优惠券</span>
                  <span class="discount-amount">-¥{{ selectedCoupon.discount }}</span>
                </div>
              </div>
              
              <div class="price-total" v-if="nights > 0">
                <span>总计</span>
                <span class="total-amount">¥{{ totalPrice }}</span>
              </div>
            </div>
            
            <!-- 取消政策 -->
            <div class="cancellation-policy">
              <h4>取消政策</h4>
              <p>入住前7天取消，可获全额退款。</p>
              <el-link type="primary" :underline="false">查看详情</el-link>
            </div>
          </el-card>

          <!-- 客服信息 -->
          <div class="customer-service">
            <h4>需要帮助？</h4>
            <p>我们的客服团队随时为您服务</p>
            <div class="contact-info">
              <el-icon><Phone /></el-icon>
              <span>400-123-4567</span>
            </div>
            <div class="contact-info">
              <el-icon><Message /></el-icon>
              <span>support@homestay.com</span>
            </div>
            <el-button type="text" icon="ChatLineRound">在线客服</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 优惠券选择对话框 -->
    <el-dialog
      v-model="showCouponDialog"
      title="选择优惠券"
      width="500px"
    >
      <div class="coupon-dialog">
        <div class="coupon-list">
          <div
            v-for="coupon in availableCoupons"
            :key="coupon.id"
            :class="['coupon-item', { active: selectedCoupon?.id === coupon.id }]"
            @click="selectCoupon(coupon)"
          >
            <div class="coupon-left">
              <div class="coupon-amount">¥{{ coupon.discount }}</div>
              <div class="coupon-type">{{ coupon.type === 'full' ? '满减券' : '折扣券' }}</div>
            </div>
            <div class="coupon-right">
              <div class="coupon-name">{{ coupon.name }}</div>
              <div class="coupon-condition">{{ coupon.condition }}</div>
              <div class="coupon-expiry">有效期至：{{ coupon.expiryDate }}</div>
            </div>
          </div>
        </div>
        
        <div class="coupon-empty" v-if="availableCoupons.length === 0">
          <el-empty description="暂无可用优惠券" />
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCouponDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmCoupon">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Location,
  CircleCheck,
  Message,
  Key,
  Clock,
  Phone,
  ChatLineRound,
  Wallet,
  CreditCard,
  Alipay,
  Wechat
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 当前步骤
const currentStep = ref(1)

// 民宿数据
const homestay = reactive({
  id: route.query.homestayId || 1,
  name: '西湖边温馨民宿',
  coverImage: 'https://via.placeholder.com/300x200/667eea/ffffff?text=民宿',
  rating: 4.8,
  reviewCount: 128,
  address: '杭州市西湖区龙井路88号',
  price: 398,
  cleaningFee: 80,
  maxGuests: 4
})

// 预约信息
const reservation = reactive({
  homestayId: homestay.id,
  checkInDate: route.query.checkIn || '',
  checkOutDate: route.query.checkOut || '',
  adults: parseInt(route.query.adults) || 2,
  children: parseInt(route.query.children) || 0,
  infants: parseInt(route.query.infants) || 0,
  specialRequests: '',
  messageToHost: ''
})

// 入住人信息
const guestInfo = reactive({
  name: userStore.realName || '',
  phone: userStore.phone || '',
  email: '',
  idCard: ''
})

// 表单引用
const guestFormRef = ref(null)

// 发票信息
const needInvoice = ref(false)
const invoiceInfo = reactive({
  type: 'personal',
  title: '',
  taxNumber: '',
  email: ''
})

// 验证规则
const guestRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, 
      message: '身份证号格式不正确', trigger: 'blur' }
  ]
}

const invoiceRules = {
  title: [
    { required: true, message: '请输入发票抬头', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入收票邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  taxNumber: [
    { required: invoiceInfo.type === 'company', message: '请输入税号', trigger: 'blur' }
  ]
}

// 计算属性
const nights = computed(() => {
  if (!reservation.checkInDate || !reservation.checkOutDate) return 0
  const diff = new Date(reservation.checkOutDate) - new Date(reservation.checkInDate)
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const totalGuests = computed(() => {
  return reservation.adults + reservation.children + reservation.infants
})

const subtotal = computed(() => homestay.price * (nights.value || 1))

const serviceFee = computed(() => {
  return Math.round(subtotal.value * 0.1)
})

const totalPrice = computed(() => {
  let total = subtotal.value + homestay.cleaningFee + serviceFee.value
  if (selectedCoupon.value) {
    total -= selectedCoupon.value.discount
  }
  return Math.max(total, 0)
})

// 步骤控制
const canProceedStep1 = computed(() => {
  return reservation.checkInDate && 
         reservation.checkOutDate && 
         nights.value > 0 &&
         totalGuests.value > 0 &&
         totalGuests.value <= homestay.maxGuests
})

const canProceedStep2 = computed(() => {
  return guestInfo.name && 
         guestInfo.phone && 
         guestInfo.email && 
         guestInfo.idCard
})

const canProceedStep3 = computed(() => {
  return agreePolicy.value && paymentMethod.value
})

// 支付相关
const paymentMethod = ref('balance')
const paying = ref(false)
const agreePolicy = ref(false)

// 优惠券相关
const showCouponDialog = ref(false)
const selectedCoupon = ref(null)
const availableCoupons = ref([
  {
    id: 1,
    name: '新客专享',
    type: 'full',
    discount: 50,
    condition: '满300元可用',
    expiryDate: '2024-12-31'
  },
  {
    id: 2,
    name: '周末特惠',
    type: 'discount',
    discount: 30,
    condition: '周五至周日入住',
    expiryDate: '2024-12-31'
  }
])

// 支付方式
const paymentMethods = ref([
  { id: 'balance', name: '余额支付', icon: Wallet, description: '使用账户余额支付' },
  { id: 'alipay', name: '支付宝', icon: Alipay, description: '推荐支付宝用户使用' },
  { id: 'wechat', name: '微信支付', icon: Wechat, description: '推荐微信用户使用' },
  { id: 'card', name: '银行卡', icon: CreditCard, description: '支持储蓄卡/信用卡' }
])

// 订单号
const orderNo = ref('HS' + Date.now())

// 方法
const disabledCheckInDate = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

const disabledCheckOutDate = (date) => {
  if (reservation.checkInDate) {
    return date <= reservation.checkInDate
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

const handleDateChange = () => {
  if (reservation.checkInDate && reservation.checkOutDate) {
    if (reservation.checkOutDate <= reservation.checkInDate) {
      ElMessage.warning('退房日期必须晚于入住日期')
      reservation.checkOutDate = ''
    }
  }
}

const updateGuestCount = () => {
  if (totalGuests.value > homestay.maxGuests) {
    ElMessage.warning(`最多可住 ${homestay.maxGuests} 人`)
  }
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

const nextStep = async () => {
  if (currentStep.value === 2) {
    // 验证表单
    if (!guestFormRef.value) return
    
    try {
      await guestFormRef.value.validate()
    } catch (error) {
      ElMessage.warning('请填写完整的入住人信息')
      return
    }
  }
  
  currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const selectCoupon = (coupon) => {
  selectedCoupon.value = coupon
}

const confirmCoupon = () => {
  showCouponDialog.value = false
  if (selectedCoupon.value) {
    ElMessage.success(`已选择优惠券：${selectedCoupon.value.name}`)
  }
}

const handlePayment = () => {
  if (!canProceedStep3.value) {
    ElMessage.warning('请同意预订政策并选择支付方式')
    return
  }
  
  paying.value = true
  
  // 模拟支付过程
  setTimeout(() => {
    paying.value = false
    currentStep.value = 4
    ElMessage.success('支付成功！')
    
    // 记录订单
    const order = {
      id: orderNo.value,
      homestay: { ...homestay },
      reservation: { ...reservation },
      guestInfo: { ...guestInfo },
      payment: {
        method: paymentMethod.value,
        amount: totalPrice.value,
        time: new Date().toISOString()
      }
    }
    
    // 保存到本地存储（模拟）
    localStorage.setItem(`order_${orderNo.value}`, JSON.stringify(order))
  }, 2000)
}

const getPaymentMethodName = () => {
  const method = paymentMethods.value.find(m => m.id === paymentMethod.value)
  return method ? method.name : ''
}

const viewOrderDetail = () => {
  router.push(`/order/${orderNo.value}`)
}

const goToHome = () => {
  router.push('/')
}

const downloadInvoice = () => {
  ElMessage.info('发票下载功能开发中')
}

// 生命周期
onMounted(() => {
  // 初始化用户信息
  if (userStore.isLoggedIn) {
    guestInfo.name = userStore.realName || userStore.userName
    guestInfo.phone = userStore.phone
  }
  
  // 如果有路由参数，自动填充
  if (route.query.checkIn && route.query.checkOut) {
    currentStep.value = 2
  }
})
</script>

<style scoped>
.reservation-container {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 进度条 */
.progress-section {
  background: white;
  padding: 24px 0;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
}

.progress-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 主内容区 */
.reservation-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

.main-content {
  display: flex;
  gap: 40px;
}

/* 左侧表单 */
.form-left {
  flex: 1;
  min-width: 0;
}

.form-card {
  border-radius: 12px;
}

.step-content {
  padding: 32px;
}

.step-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 32px 0;
  text-align: center;
}

/* 房源摘要 */
.homestay-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.summary-image {
  width: 120px;
  height: 90px;
  border-radius: 8px;
  flex-shrink: 0;
}

.summary-info {
  flex: 1;
}

.summary-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.summary-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.rating-text {
  font-size: 14px;
  color: #666;
}

.summary-address {
  font-size: 14px;
  color: #666;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 日期选择 */
.date-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.date-field label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.nights-info {
  margin-bottom: 24px;
}

/* 房客信息 */
.guest-selection {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.guest-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 16px;
}

.guest-field label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.guest-total {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #333;
}

.total-count {
  font-weight: 600;
  color: #409eff;
}

.capacity-info {
  color: #f56c6c;
  font-size: 14px;
}

/* 步骤操作按钮 */
.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

/* 入住人信息 */
.guest-info-section {
  margin-bottom: 32px;
}

/* 特殊需求和留言 */
.special-requests,
.message-to-host {
  margin-bottom: 32px;
}

/* 发票信息 */
.invoice-section {
  margin-bottom: 32px;
}

.invoice-form {
  margin-top: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

/* 订单信息确认 */
.order-summary {
  margin-bottom: 32px;
}

.order-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.order-item {
  display: flex;
  margin-bottom: 12px;
  font-size: 14px;
}

.order-item:last-child {
  margin-bottom: 0;
}

.order-label {
  width: 100px;
  color: #666;
  flex-shrink: 0;
}

.order-value {
  flex: 1;
  color: #333;
  font-weight: 500;
}

/* 价格明细 */
.price-details-section {
  margin-bottom: 32px;
}

.price-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}

.price-row.total {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ddd;
  font-weight: 600;
  font-size: 18px;
}

.total-price {
  color: #ff6b6b;
  font-size: 24px;
}

/* 优惠券 */
.coupon-section {
  margin: 20px 0;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px dashed #ddd;
}

.coupon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.coupon-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 6px;
}

.coupon-name {
  font-weight: 500;
}

.coupon-discount {
  font-size: 18px;
  font-weight: 700;
}

/* 支付方式 */
.payment-methods {
  margin-bottom: 32px;
}

.method-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.method-item:hover {
  border-color: #409eff;
  background: #f0f7ff;
}

.method-item.active {
  border-color: #409eff;
  background: #f0f7ff;
}

.method-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  color: #409eff;
}

.method-info {
  flex: 1;
}

.method-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.method-desc {
  font-size: 12px;
  color: #666;
}

.method-check {
  margin-left: auto;
}

/* 政策确认 */
.policy-confirm {
  margin-bottom: 32px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

/* 成功页面 */
.success-content {
  text-align: center;
  padding: 40px 0;
}

.success-icon {
  margin-bottom: 24px;
}

.success-title {
  font-size: 32px;
  font-weight: 700;
  color: #67c23a;
  margin: 0 0 16px 0;
}

.success-message {
  font-size: 16px;
  color: #333;
  margin-bottom: 40px;
  line-height: 1.6;
}

.success-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.detail-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 24px;
  text-align: left;
}

.detail-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.payment-amount {
  color: #ff6b6b;
  font-weight: 600;
  font-size: 18px;
}

.guidance-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guidance-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #333;
}

.guidance-item .el-icon {
  color: #409eff;
}

.success-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
}

.success-tips {
  max-width: 600px;
  margin: 0 auto;
}

/* 右侧摘要 */
.summary-right {
  width: 360px;
}

.summary-card {
  border-radius: 12px;
  margin-bottom: 24px;
}

.summary-header {
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.summary-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.summary-dates {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.date-info {
  text-align: center;
}

.date-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.date-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.date-separator {
  color: #999;
}

.summary-guests {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.guest-label {
  font-size: 14px;
  color: #666;
}

.guest-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.summary-price {
  margin-bottom: 24px;
}

.price-breakdown {
  margin-bottom: 20px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}

.price-item.discount {
  color: #67c23a;
}

.discount-amount {
  font-weight: 600;
}

.price-total {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid #eee;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.total-amount {
  color: #ff6b6b;
  font-size: 24px;
}

.cancellation-policy {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.cancellation-policy h4 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.cancellation-policy p {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

/* 客服信息 */
.customer-service {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.customer-service h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.customer-service p {
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}

/* 优惠券对话框 */
.coupon-dialog {
  max-height: 400px;
  overflow-y: auto;
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-item {
  display: flex;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.coupon-item:hover {
  border-color: #409eff;
}

.coupon-item.active {
  border-color: #409eff;
  background: #f0f7ff;
}

.coupon-left {
  width: 80px;
  text-align: center;
  padding-right: 16px;
  border-right: 1px dashed #ddd;
}

.coupon-amount {
  font-size: 24px;
  font-weight: 700;
  color: #ff6b6b;
  margin-bottom: 4px;
}

.coupon-type {
  font-size: 12px;
  color: #666;
}

.coupon-right {
  flex: 1;
  padding-left: 16px;
}

.coupon-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.coupon-condition {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.coupon-expiry {
  font-size: 12px;
  color: #999;
}

.coupon-empty {
  padding: 40px 0;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .main-content {
    flex-direction: column;
  }
  
  .summary-right {
    width: 100%;
  }
  
  .date-selection {
    grid-template-columns: 1fr;
  }
  
  .guest-fields {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .step-content {
    padding: 20px;
  }
  
  .homestay-summary {
    flex-direction: column;
    text-align: center;
  }
  
  .summary-image {
    width: 100%;
    height: 200px;
  }
  
  .success-details {
    grid-template-columns: 1fr;
  }
}
</style>