<template>
  <div class="profile-container">
    <!-- 页面头部 -->
    <div class="profile-header">
      <div class="header-content">
        <h1 class="page-title">个人中心</h1>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人中心</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <div class="profile-main">
      <div class="main-content">
        <!-- 左侧：侧边栏菜单 -->
        <div class="sidebar-left">
          <el-card class="sidebar-card" shadow="hover">
            <!-- 用户信息摘要 -->
            <div class="user-summary">
              <div class="user-avatar">
                <el-avatar :size="80" :src="userInfo.avatar">
                  {{ userInfo.name?.charAt(0) }}
                </el-avatar>
                <el-upload
                  class="avatar-uploader"
                  :action="uploadAvatarUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <el-button type="primary" size="small" icon="Upload">
                    更换头像
                  </el-button>
                </el-upload>
              </div>
              
              <div class="user-info">
                <h2 class="user-name">{{ userInfo.name || '未设置姓名' }}</h2>
                <div class="user-role">
                  <el-tag :type="roleTagType">{{ userInfo.roleName }}</el-tag>
                  <el-tag :type="statusTagType">{{ userInfo.statusName }}</el-tag>
                </div>
                <p class="user-id">用户ID: {{ userInfo.id }}</p>
              </div>
            </div>

            <!-- 侧边栏菜单 -->
            <el-menu
              :default-active="activeMenu"
              class="sidebar-menu"
              @select="handleMenuSelect"
            >
              <el-menu-item index="profile">
                <el-icon><User /></el-icon>
                <span>个人信息</span>
              </el-menu-item>
              
              <el-menu-item index="security">
                <el-icon><Lock /></el-icon>
                <span>账户安全</span>
              </el-menu-item>
              
              <el-menu-item index="realname">
                <el-icon><Document /></el-icon>
                <span>实名认证</span>
                <el-tag v-if="userInfo.isRealNameVerified" type="success" size="small">
                  已认证
                </el-tag>
                <el-tag v-else type="warning" size="small">
                  未认证
                </el-tag>
              </el-menu-item>
              
              <el-menu-item index="notification">
                <el-icon><Bell /></el-icon>
                <span>消息通知</span>
                <el-badge :value="unreadCount" :max="99" class="badge" />
              </el-menu-item>
              
              <el-menu-item index="privacy">
                <el-icon><Setting /></el-icon>
                <span>隐私设置</span>
              </el-menu-item>
              
              <el-menu-item index="orders">
                <el-icon><Tickets /></el-icon>
                <span>我的订单</span>
              </el-menu-item>
              
              <el-menu-item index="collections">
                <el-icon><Star /></el-icon>
                <span>我的收藏</span>
              </el-menu-item>
              
              <el-menu-item index="reviews">
                <el-icon><ChatLineSquare /></el-icon>
                <span>我的评价</span>
              </el-menu-item>
              
              <el-divider />
              
              <el-menu-item index="wallet">
                <el-icon><Wallet /></el-icon>
                <span>我的钱包</span>
                <span class="balance">¥{{ userInfo.balance || '0.00' }}</span>
              </el-menu-item>
              
              <el-menu-item index="coupons">
                <el-icon><Discount /></el-icon>
                <span>优惠券</span>
                <el-tag type="info" size="small">{{ userInfo.couponCount || 0 }}张</el-tag>
              </el-menu-item>
              
              <el-divider />
              
              <el-menu-item index="help">
                <el-icon><QuestionFilled /></el-icon>
                <span>帮助中心</span>
              </el-menu-item>
              
              <el-menu-item index="settings">
                <el-icon><Tools /></el-icon>
                <span>系统设置</span>
              </el-menu-item>
              
              <el-menu-item index="logout" class="logout-item">
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-menu-item>
            </el-menu>
          </el-card>
        </div>

        <!-- 右侧：内容区域 -->
        <div class="content-right">
          <!-- 个人信息 -->
          <el-card v-if="activeMenu === 'profile'" class="content-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <h3 class="card-title">
                  <el-icon><User /></el-icon>
                  个人信息
                </h3>
                <el-button
                  type="primary"
                  :icon="editMode ? 'Close' : 'Edit'"
                  @click="toggleEditMode"
                >
                  {{ editMode ? '取消编辑' : '编辑信息' }}
                </el-button>
              </div>
            </template>
            
            <el-form
              ref="profileFormRef"
              :model="profileForm"
              :rules="profileRules"
              label-width="100px"
              :disabled="!editMode"
            >
              <div class="form-section">
                <h4 class="section-title">基本信息</h4>
                <div class="form-grid">
                  <el-form-item label="用户名" prop="username">
                    <el-input
                      v-model="profileForm.username"
                      placeholder="请输入用户名"
                      :readonly="!editMode"
                    />
                    <div class="form-tip" v-if="!editMode">用户名不可修改</div>
                  </el-form-item>
                  
                  <el-form-item label="真实姓名" prop="realName">
                    <el-input
                      v-model="profileForm.realName"
                      placeholder="请输入真实姓名"
                    />
                  </el-form-item>
                  
                  <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="profileForm.gender">
                      <el-radio label="male">男</el-radio>
                      <el-radio label="female">女</el-radio>
                      <el-radio label="secret">保密</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  
                  <el-form-item label="出生日期" prop="birthday">
                    <el-date-picker
                      v-model="profileForm.birthday"
                      type="date"
                      placeholder="选择出生日期"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </div>
              </div>
              
              <div class="form-section">
                <h4 class="section-title">联系信息</h4>
                <div class="form-grid">
                  <el-form-item label="手机号" prop="phone">
                    <el-input
                      v-model="profileForm.phone"
                      placeholder="请输入手机号"
                      maxlength="11"
                    />
                    <el-button
                      v-if="editMode"
                      type="text"
                      @click="showPhoneVerify = true"
                    >
                      验证手机
                    </el-button>
                  </el-form-item>
                  
                  <el-form-item label="邮箱" prop="email">
                    <el-input
                      v-model="profileForm.email"
                      placeholder="请输入邮箱"
                      type="email"
                    />
                    <el-button
                      v-if="editMode && !profileForm.emailVerified"
                      type="text"
                      @click="verifyEmail"
                    >
                      {{ profileForm.emailVerified ? '已验证' : '验证邮箱' }}
                    </el-button>
                    <el-tag v-else-if="profileForm.emailVerified" type="success" size="small">
                      已验证
                    </el-tag>
                  </el-form-item>
                  
                  <el-form-item label="微信号" prop="wechat">
                    <el-input
                      v-model="profileForm.wechat"
                      placeholder="请输入微信号"
                    />
                  </el-form-item>
                  
                  <el-form-item label="QQ号" prop="qq">
                    <el-input
                      v-model="profileForm.qq"
                      placeholder="请输入QQ号"
                    />
                  </el-form-item>
                </div>
              </div>
              
              <div class="form-section">
                <h4 class="section-title">个人简介</h4>
                <el-form-item label="个人简介" prop="bio">
                  <el-input
                    v-model="profileForm.bio"
                    type="textarea"
                    :rows="4"
                    placeholder="介绍一下你自己吧~"
                    maxlength="200"
                    show-word-limit
                  />
                </el-form-item>
              </div>
              
              <div class="form-section">
                <h4 class="section-title">地址信息</h4>
                <div class="form-grid">
                  <el-form-item label="所在地区" prop="region">
                    <el-cascader
                      v-model="profileForm.region"
                      :options="regionOptions"
                      placeholder="请选择地区"
                      style="width: 100%;"
                    />
                  </el-form-item>
                  
                  <el-form-item label="详细地址" prop="address">
                    <el-input
                      v-model="profileForm.address"
                      placeholder="请输入详细地址"
                    />
                  </el-form-item>
                </div>
              </div>
              
              <div class="form-actions" v-if="editMode">
                <el-button @click="cancelEdit">取消</el-button>
                <el-button type="primary" @click="saveProfile" :loading="saving">
                  保存修改
                </el-button>
              </div>
            </el-form>
          </el-card>

          <!-- 账户安全 -->
          <el-card v-else-if="activeMenu === 'security'" class="content-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <h3 class="card-title">
                  <el-icon><Lock /></el-icon>
                  账户安全
                </h3>
                <div class="security-score">
                  <span>安全评分：</span>
                  <el-rate v-model="securityScore" disabled show-score text-color="#ff9900" />
                </div>
              </div>
            </template>
            
            <div class="security-items">
              <!-- 登录密码 -->
              <div class="security-item">
                <div class="item-info">
                  <div class="item-header">
                    <el-icon class="item-icon"><Key /></el-icon>
                    <div class="item-title">
                      <h4>登录密码</h4>
                      <p class="item-desc">定期更换密码可以让账户更安全</p>
                    </div>
                  </div>
                  <el-tag v-if="userInfo.hasPassword" type="success">已设置</el-tag>
                  <el-tag v-else type="danger">未设置</el-tag>
                </div>
                <el-button type="primary" text @click="showPasswordDialog = true">
                  修改
                </el-button>
              </div>
              
              <!-- 手机验证 -->
              <div class="security-item">
                <div class="item-info">
                  <div class="item-header">
                    <el-icon class="item-icon"><Iphone /></el-icon>
                    <div class="item-title">
                      <h4>手机验证</h4>
                      <p class="item-desc">已绑定手机：{{ userInfo.phoneMasked }}</p>
                    </div>
                  </div>
                  <el-tag v-if="userInfo.phoneVerified" type="success">已验证</el-tag>
                  <el-tag v-else type="warning">未验证</el-tag>
                </div>
                <el-button type="primary" text @click="bindPhone">
                  {{ userInfo.phoneVerified ? '更换' : '绑定' }}
                </el-button>
              </div>
              
              <!-- 邮箱验证 -->
              <div class="security-item">
                <div class="item-info">
                  <div class="item-header">
                    <el-icon class="item-icon"><Message /></el-icon>
                    <div class="item-title">
                      <h4>邮箱验证</h4>
                      <p class="item-desc">已绑定邮箱：{{ userInfo.emailMasked }}</p>
                    </div>
                  </div>
                  <el-tag v-if="userInfo.emailVerified" type="success">已验证</el-tag>
                  <el-tag v-else type="warning">未验证</el-tag>
                </div>
                <el-button type="primary" text @click="bindEmail">
                  {{ userInfo.emailVerified ? '更换' : '绑定' }}
                </el-button>
              </div>
              
              <!-- 登录设备 -->
              <div class="security-item">
                <div class="item-info">
                  <div class="item-header">
                    <el-icon class="item-icon"><Monitor /></el-icon>
                    <div class="item-title">
                      <h4>登录设备管理</h4>
                      <p class="item-desc">管理您的登录设备，移除陌生设备</p>
                    </div>
                  </div>
                  <el-tag>{{ userInfo.deviceCount }}台设备</el-tag>
                </div>
                <el-button type="primary" text @click="manageDevices">
                  管理
                </el-button>
              </div>
              
              <!-- 登录记录 -->
              <div class="security-item">
                <div class="item-info">
                  <div class="item-header">
                    <el-icon class="item-icon"><Histogram /></el-icon>
                    <div class="item-title">
                      <h4>登录记录</h4>
                      <p class="item-desc">查看最近的登录活动</p>
                    </div>
                  </div>
                  <span class="last-login">最后登录：{{ userInfo.lastLogin }}</span>
                </div>
                <el-button type="primary" text @click="viewLoginHistory">
                  查看
                </el-button>
              </div>
              
              <!-- 账户保护 -->
              <div class="security-item">
                <div class="item-info">
                  <div class="item-header">
                    <el-icon class="item-icon"><Bell /></el-icon>
                    <div class="item-title">
                      <h4>账户保护</h4>
                      <p class="item-desc">开启后，异常登录时会通知您</p>
                    </div>
                  </div>
                  <el-switch v-model="securitySettings.accountProtection" />
                </div>
                <el-button type="primary" text @click="setupAccountProtection">
                  设置
                </el-button>
              </div>
              
              <!-- 两步验证 -->
              <div class="security-item">
                <div class="item-info">
                  <div class="item-header">
                    <el-icon class="item-icon"><UserFilled /></el-icon>
                    <div class="item-title">
                      <h4>两步验证</h4>
                      <p class="item-desc">为账户添加额外的安全层</p>
                    </div>
                  </div>
                  <el-tag v-if="securitySettings.twoFactorAuth" type="success">已开启</el-tag>
                  <el-tag v-else type="info">未开启</el-tag>
                </div>
                <el-button type="primary" text @click="setupTwoFactorAuth">
                  {{ securitySettings.twoFactorAuth ? '管理' : '开启' }}
                </el-button>
              </div>
            </div>
            
            <div class="security-tips">
              <el-alert
                title="安全提示"
                type="info"
                :closable="false"
                description="为了您的账户安全，请定期修改密码，不要将密码告诉他人。如发现异常，请立即修改密码并联系客服。"
              />
            </div>
          </el-card>

          <!-- 实名认证 -->
          <el-card v-else-if="activeMenu === 'realname'" class="content-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <h3 class="card-title">
                  <el-icon><Document /></el-icon>
                  实名认证
                </h3>
                <el-tag :type="userInfo.isRealNameVerified ? 'success' : 'warning'" size="large">
                  {{ userInfo.isRealNameVerified ? '已实名认证' : '未实名认证' }}
                </el-tag>
              </div>
            </template>
            
            <div v-if="!userInfo.isRealNameVerified" class="realname-guide">
              <div class="guide-header">
                <h4>为什么要实名认证？</h4>
                <p>实名认证后，您可以享受以下权益：</p>
              </div>
              
              <div class="benefits">
                <div class="benefit-item">
                  <el-icon color="#409eff"><Check /></el-icon>
                  <span>预订民宿无需重复填写身份信息</span>
                </div>
                <div class="benefit-item">
                  <el-icon color="#409eff"><Check /></el-icon>
                  <span>优先享受平台优惠活动</span>
                </div>
                <div class="benefit-item">
                  <el-icon color="#409eff"><Check /></el-icon>
                  <span>提升房东对您的信任度</span>
                </div>
                <div class="benefit-item">
                  <el-icon color="#409eff"><Check /></el-icon>
                  <span>保障交易安全</span>
                </div>
              </div>
              
              <!-- 认证表单 -->
              <el-form
                ref="realnameFormRef"
                :model="realnameForm"
                :rules="realnameRules"
                label-width="100px"
                class="realname-form"
              >
                <div class="form-section">
                  <h4 class="section-title">身份信息</h4>
                  <div class="form-grid">
                    <el-form-item label="真实姓名" prop="realName">
                      <el-input
                        v-model="realnameForm.realName"
                        placeholder="请输入与身份证一致的真实姓名"
                      />
                    </el-form-item>
                    
                    <el-form-item label="身份证号" prop="idCard">
                      <el-input
                        v-model="realnameForm.idCard"
                        placeholder="请输入18位身份证号码"
                        maxlength="18"
                      />
                    </el-form-item>
                    
                    <el-form-item label="有效期" prop="idCardExpiry">
                      <el-date-picker
                        v-model="realnameForm.idCardExpiry"
                        type="date"
                        placeholder="选择身份证有效期"
                        style="width: 100%;"
                      />
                    </el-form-item>
                  </div>
                </div>
                
                <div class="form-section">
                  <h4 class="section-title">身份证照片</h4>
                  <p class="upload-tip">请上传清晰的身份证正反面照片，确保信息清晰可见</p>
                  
                  <div class="idcard-upload">
                    <div class="upload-item">
                      <div class="upload-label">身份证正面</div>
                      <el-upload
                        class="avatar-uploader"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :on-success="handleIdCardFrontSuccess"
                        :before-upload="beforeIdCardUpload"
                      >
                        <img v-if="realnameForm.idCardFront" :src="realnameForm.idCardFront" class="idcard-image" />
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                      </el-upload>
                      <p class="upload-example">示例：包含姓名、身份证号的一面</p>
                    </div>
                    
                    <div class="upload-item">
                      <div class="upload-label">身份证反面</div>
                      <el-upload
                        class="avatar-uploader"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :on-success="handleIdCardBackSuccess"
                        :before-upload="beforeIdCardUpload"
                      >
                        <img v-if="realnameForm.idCardBack" :src="realnameForm.idCardBack" class="idcard-image" />
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                      </el-upload>
                      <p class="upload-example">示例：包含有效期、签发机关的一面</p>
                    </div>
                  </div>
                </div>
                
                <div class="form-section">
                  <h4 class="section-title">手持身份证照片</h4>
                  <div class="handheld-upload">
                    <el-upload
                      class="handheld-uploader"
                      :action="uploadUrl"
                      :show-file-list="false"
                      :on-success="handleHandheldSuccess"
                      :before-upload="beforeHandheldUpload"
                    >
                      <img v-if="realnameForm.handheldPhoto" :src="realnameForm.handheldPhoto" class="handheld-image" />
                      <div v-else class="handheld-placeholder">
                        <el-icon><Camera /></el-icon>
                        <p>请上传手持身份证照片</p>
                        <p class="placeholder-tip">确保脸部清晰，身份证信息可见</p>
                      </div>
                    </el-upload>
                  </div>
                </div>
                
                <div class="form-agreement">
                  <el-checkbox v-model="agreeRealnameAgreement">
                    我已阅读并同意
                    <el-link type="primary" :underline="false">《实名认证协议》</el-link>
                    和
                    <el-link type="primary" :underline="false">《个人信息保护政策》</el-link>
                  </el-checkbox>
                </div>
                
                <div class="form-actions">
                  <el-button @click="resetRealnameForm">重置</el-button>
                  <el-button
                    type="primary"
                    @click="submitRealname"
                    :loading="submittingRealname"
                    :disabled="!agreeRealnameAgreement"
                  >
                    提交认证
                  </el-button>
                </div>
              </el-form>
            </div>
            
            <div v-else class="realname-success">
              <div class="success-content">
                <el-icon color="#67c23a" :size="60"><CircleCheck /></el-icon>
                <h3>实名认证成功！</h3>
                <p>您的账户已通过实名认证</p>
                
                <div class="certified-info">
                  <div class="info-item">
                    <span class="info-label">真实姓名：</span>
                    <span class="info-value">{{ userInfo.realName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">身份证号：</span>
                    <span class="info-value">{{ userInfo.idCardMasked }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">认证时间：</span>
                    <span class="info-value">{{ userInfo.realnameTime }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">认证状态：</span>
                    <el-tag type="success" size="small">已验证</el-tag>
                  </div>
                </div>
                
                <div class="success-tips">
                  <el-alert
                    title="温馨提示"
                    type="info"
                    :closable="false"
                    description="实名信息一旦认证成功无法修改，请确保信息准确。如有疑问请联系客服。"
                  />
                </div>
              </div>
            </div>
          </el-card>

          <!-- 其他菜单内容占位 -->
          <el-card v-else class="content-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <h3 class="card-title">
                  <el-icon>
                    <component :is="menuIcon" />
                  </el-icon>
                  {{ menuTitle }}
                </h3>
              </div>
            </template>
            
            <div class="coming-soon">
              <el-empty :description="`${menuTitle}功能开发中`" />
              <p class="coming-soon-text">该功能正在全力开发中，敬请期待！</p>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="showPasswordDialog"
      title="修改密码"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码（6-20位）"
            show-password
          />
          <div class="password-tips">
            <p>密码应包含：</p>
            <ul>
              <li :class="{ 'valid': passwordStrength.length }">至少6个字符</li>
              <li :class="{ 'valid': passwordStrength.upper && passwordStrength.lower }">包含大小写字母</li>
              <li :class="{ 'valid': passwordStrength.number }">包含数字</li>
              <li :class="{ 'valid': passwordStrength.special }">包含特殊字符</li>
            </ul>
          </div>
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPasswordDialog = false">取消</el-button>
          <el-button type="primary" @click="changePassword" :loading="changingPassword">
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Lock,
  Document,
  Bell,
  Setting,
  Tickets,
  Star,
  ChatLineSquare,
  Wallet,
  Discount,
  QuestionFilled,
  Tools,
  SwitchButton,
  Upload,
  Key,
  Iphone,
  Message,
  Monitor,
  Histogram,
  UserFilled,
  Check,
  Plus,
  Camera,
  CircleCheck,
  Edit,
  Close
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 当前激活的菜单
const activeMenu = ref('profile')

// 用户信息
const userInfo = reactive({
  id: '10001',
  name: '张三',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  role: 0,
  roleName: '普通用户',
  status: 1,
  statusName: '正常',
  realName: '张三',
  phone: '13800138000',
  phoneMasked: '138****8000',
  phoneVerified: true,
  email: 'zhangsan@example.com',
  emailMasked: 'zhan****@example.com',
  emailVerified: true,
  isRealNameVerified: false,
  idCardMasked: '1101**********1234',
  realnameTime: '2024-11-15 14:30:22',
  balance: '1250.50',
  couponCount: 3,
  deviceCount: 2,
  lastLogin: '2024-12-02 10:30:22',
  hasPassword: true
})

// 计算属性
const roleTagType = computed(() => {
  switch (userInfo.role) {
    case 0: return 'info'
    case 1: return 'warning'
    case 2: return 'danger'
    default: return 'info'
  }
})

const statusTagType = computed(() => {
  return userInfo.status === 1 ? 'success' : 'danger'
})

const menuIcon = computed(() => {
  const iconMap = {
    notification: Bell,
    privacy: Setting,
    orders: Tickets,
    collections: Star,
    reviews: ChatLineSquare,
    wallet: Wallet,
    coupons: Discount,
    help: QuestionFilled,
    settings: Tools,
    logout: SwitchButton
  }
  return iconMap[activeMenu.value] || Setting
})

const menuTitle = computed(() => {
  const titleMap = {
    profile: '个人信息',
    security: '账户安全',
    realname: '实名认证',
    notification: '消息通知',
    privacy: '隐私设置',
    orders: '我的订单',
    collections: '我的收藏',
    reviews: '我的评价',
    wallet: '我的钱包',
    coupons: '优惠券',
    help: '帮助中心',
    settings: '系统设置',
    logout: '退出登录'
  }
  return titleMap[activeMenu.value] || '未知菜单'
})

// 个人信息编辑
const editMode = ref(false)
const saving = ref(false)
const profileFormRef = ref(null)

const profileForm = reactive({
  username: 'zhangsan',
  realName: '张三',
  gender: 'male',
  birthday: '1990-01-01',
  phone: '13800138000',
  email: 'zhangsan@example.com',
  emailVerified: true,
  wechat: 'zhangsan_wechat',
  qq: '123456789',
  bio: '热爱旅行，喜欢体验不同的民宿文化。',
  region: ['浙江省', '杭州市', '西湖区'],
  address: '西湖区文三路123号'
})

const profileRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

// 地区选项
const regionOptions = ref([
  {
    value: '浙江省',
    label: '浙江省',
    children: [
      {
        value: '杭州市',
        label: '杭州市',
        children: [
          { value: '西湖区', label: '西湖区' },
          { value: '上城区', label: '上城区' },
          { value: '下城区', label: '下城区' },
          { value: '江干区', label: '江干区' },
          { value: '拱墅区', label: '拱墅区' },
          { value: '滨江区', label: '滨江区' }
        ]
      }
    ]
  }
])

// 安全相关
const securityScore = ref(4.5)
const showPasswordDialog = ref(false)
const changingPassword = ref(false)

const securitySettings = reactive({
  accountProtection: true,
  twoFactorAuth: false
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 实名认证
const realnameFormRef = ref(null)
const submittingRealname = ref(false)
const agreeRealnameAgreement = ref(false)

const realnameForm = reactive({
  realName: '',
  idCard: '',
  idCardExpiry: '',
  idCardFront: '',
  idCardBack: '',
  handheldPhoto: ''
})

const realnameRules = {
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, 
      message: '身份证号格式不正确', trigger: 'blur' }
  ]
}

// 其他状态
const unreadCount = ref(5)
const showPhoneVerify = ref(false)

// 上传相关
const uploadAvatarUrl = ref('/api/user/upload-avatar')
const uploadUrl = ref('/api/upload')

// 方法
const handleMenuSelect = (index) => {
  if (index === 'logout') {
    handleLogout()
  } else {
    activeMenu.value = index
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

const toggleEditMode = () => {
  if (editMode.value) {
    // 取消编辑，恢复原数据
    resetProfileForm()
  }
  editMode.value = !editMode.value
}

const resetProfileForm = () => {
  // 这里应该从API重新加载数据
  profileForm.username = 'zhangsan'
  profileForm.realName = '张三'
  // ... 其他字段重置
}

const saveProfile = async () => {
  if (!profileFormRef.value) return
  
  try {
    const valid = await profileFormRef.value.validate()
    if (!valid) return
    
    saving.value = true
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('个人信息更新成功')
    editMode.value = false
    
    // 更新用户信息
    userInfo.name = profileForm.realName
    userInfo.realName = profileForm.realName
    userInfo.phone = profileForm.phone
    userInfo.email = profileForm.email
    
  } catch (error) {
    ElMessage.error('更新失败：' + error.message)
  } finally {
    saving.value = false
  }
}

const cancelEdit = () => {
  resetProfileForm()
  editMode.value = false
}

const validatePassword = (rule, value, callback) => {
  const hasUpper = /[A-Z]/.test(value)
  const hasLower = /[a-z]/.test(value)
  const hasNumber = /\d/.test(value)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value)
  
  if (value.length < 6) {
    callback(new Error('密码至少6个字符'))
  } else if (!hasUpper || !hasLower) {
    callback(new Error('密码应包含大小写字母'))
  } else if (!hasNumber) {
    callback(new Error('密码应包含数字'))
  } else if (!hasSpecial) {
    callback(new Error('密码应包含特殊字符'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const changePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    const valid = await passwordFormRef.value.validate()
    if (!valid) return
    
    changingPassword.value = true
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('密码修改成功')
    showPasswordDialog.value = false
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
  } catch (error) {
    ElMessage.error('密码修改失败：' + error.message)
  } finally {
    changingPassword.value = false
  }
}

const bindPhone = () => {
  showPhoneVerify.value = true
}

const bindEmail = () => {
  ElMessage.info('邮箱绑定功能开发中')
}

const manageDevices = () => {
  ElMessage.info('设备管理功能开发中')
}

const viewLoginHistory = () => {
  ElMessage.info('登录记录功能开发中')
}

const setupAccountProtection = () => {
  ElMessage.info('账户保护设置功能开发中')
}

const setupTwoFactorAuth = () => {
  ElMessage.info('两步验证功能开发中')
}

const handleAvatarSuccess = (response, file) => {
  if (response.code === 200) {
    userInfo.avatar = response.data.url
    ElMessage.success('头像上传成功')
  }
}

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }
  return true
}

const submitRealname = async () => {
  if (!realnameFormRef.value) return
  
  try {
    const valid = await realnameFormRef.value.validate()
    if (!valid) return
    
    if (!agreeRealnameAgreement.value) {
      ElMessage.warning('请同意实名认证协议')
      return
    }
    
    if (!realnameForm.idCardFront || !realnameForm.idCardBack || !realnameForm.handheldPhoto) {
      ElMessage.warning('请上传完整的身份证照片')
      return
    }
    
    submittingRealname.value = true
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('实名认证提交成功，审核中...')
    
    // 更新用户状态
    userInfo.isRealNameVerified = true
    userInfo.realName = realnameForm.realName
    userInfo.idCardMasked = realnameForm.idCard.replace(/(\d{4})\d{10}(\w{4})/, '$1**********$2')
    userInfo.realnameTime = new Date().toLocaleString()
    
  } catch (error) {
    ElMessage.error('提交失败：' + error.message)
  } finally {
    submittingRealname.value = false
  }
}

const resetRealnameForm = () => {
  realnameForm.realName = ''
  realnameForm.idCard = ''
  realnameForm.idCardExpiry = ''
  realnameForm.idCardFront = ''
  realnameForm.idCardBack = ''
  realnameForm.handheldPhoto = ''
}

const handleIdCardFrontSuccess = (response, file) => {
  if (response.code === 200) {
    realnameForm.idCardFront = response.data.url
    ElMessage.success('身份证正面上传成功')
  }
}

const handleIdCardBackSuccess = (response, file) => {
  if (response.code === 200) {
    realnameForm.idCardBack = response.data.url
    ElMessage.success('身份证反面上传成功')
  }
}

const handleHandheldSuccess = (response, file) => {
  if (response.code === 200) {
    realnameForm.handheldPhoto = response.data.url
    ElMessage.success('手持身份证照片上传成功')
  }
}

const beforeIdCardUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片格式!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('上传图片大小不能超过 5MB!')
    return false
  }
  return true
}

const beforeHandheldUpload = (file) => {
  return beforeIdCardUpload(file)
}

// 密码强度检查
const passwordStrength = computed(() => {
  const password = passwordForm.newPassword
  return {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
})

// 监听密码变化，显示强度
watch(() => passwordForm.newPassword, (newVal) => {
  if (newVal.length > 0) {
    const strength = passwordStrength.value
    const validCount = Object.values(strength).filter(v => v).length
    // 可以根据强度给出提示
  }
})

// 生命周期
onMounted(() => {
  // 加载用户信息
  if (userStore.isLoggedIn) {
    // 这里应该从API加载用户详细信息
    console.log('加载用户信息')
  }
})
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 页面头部 */
.profile-header {
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
.profile-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

.main-content {
  display: flex;
  gap: 24px;
}

/* 侧边栏 */
.sidebar-left {
  width: 280px;
  flex-shrink: 0;
}

.sidebar-card {
  border-radius: 12px;
}

.user-summary {
  text-align: center;
  padding: 24px 0;
  border-bottom: 1px solid #eee;
}

.user-avatar {
  position: relative;
  margin-bottom: 16px;
}

.avatar-uploader {
  margin-top: 12px;
}

.user-info {
  padding: 0 16px;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.user-role {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.user-id {
  font-size: 12px;
  color: #999;
  margin: 0;
}

/* 侧边栏菜单 */
.sidebar-menu {
  border-right: none;
  padding: 16px 0;
}

.sidebar-menu .el-menu-item {
  height: 50px;
  margin: 0;
  border-radius: 0;
  display: flex;
  align-items: center;
}

.sidebar-menu .el-menu-item.is-active {
  color: #409eff;
  background-color: #f0f7ff;
  border-right: 3px solid #409eff;
}

.sidebar-menu .el-icon {
  margin-right: 12px;
  font-size: 18px;
}

.badge {
  margin-left: 8px;
}

.balance {
  margin-left: auto;
  color: #ff6b6b;
  font-weight: 600;
}

.logout-item {
  color: #f56c6c !important;
}

.logout-item .el-icon {
  color: #f56c6c;
}

.logout-item:hover {
  background-color: #fef0f0 !important;
}

/* 内容区域 */
.content-right {
  flex: 1;
  min-width: 0;
}

.content-card {
  border-radius: 12px;
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 表单部分 */
.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.form-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  padding-left: 8px;
  border-left: 4px solid #409eff;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

/* 安全项目 */
.security-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #eee;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-icon {
  font-size: 24px;
  color: #409eff;
}

.item-title h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.item-desc {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.last-login {
  font-size: 14px;
  color: #666;
}

.security-score {
  display: flex;
  align-items: center;
  gap: 12px;
}

.security-tips {
  margin-top: 32px;
}

/* 实名认证 */
.realname-guide {
  padding: 20px 0;
}

.guide-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.guide-header p {
  color: #666;
  margin: 0 0 24px 0;
}

.benefits {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f0f7ff;
  border-radius: 6px;
}

.benefit-item span {
  font-size: 14px;
  color: #333;
}

.upload-tip {
  color: #666;
  margin: 0 0 20px 0;
}

.idcard-upload {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.upload-item {
  text-align: center;
}

.upload-label {
  font-weight: 500;
  margin-bottom: 12px;
}

.idcard-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.upload-example {
  font-size: 12px;
  color: #999;
  margin: 8px 0 0 0;
}

.handheld-upload {
  margin-bottom: 32px;
}

.handheld-uploader {
  width: 100%;
  height: 300px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.handheld-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.handheld-placeholder {
  text-align: center;
  color: #999;
}

.handheld-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.placeholder-tip {
  font-size: 12px;
  margin-top: 8px;
}

.form-agreement {
  margin-bottom: 32px;
}

.realname-success {
  text-align: center;
  padding: 40px 0;
}

.success-content {
  max-width: 600px;
  margin: 0 auto;
}

.certified-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 24px;
  margin: 24px 0;
  text-align: left;
}

.info-item {
  display: flex;
  margin-bottom: 16px;
  font-size: 14px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  width: 100px;
  color: #666;
  flex-shrink: 0;
}

.info-value {
  flex: 1;
  color: #333;
  font-weight: 500;
}

.success-tips {
  max-width: 500px;
  margin: 0 auto;
}

/* 密码强度提示 */
.password-tips {
  margin-top: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.password-tips p {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px 0;
}

.password-tips ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.password-tips li {
  font-size: 12px;
  color: #f56c6c;
  margin-bottom: 4px;
  position: relative;
  padding-left: 16px;
}

.password-tips li.valid {
  color: #67c23a;
}

.password-tips li:before {
  content: '×';
  position: absolute;
  left: 0;
  color: #f56c6c;
}

.password-tips li.valid:before {
  content: '✓';
  color: #67c23a;
}

/* 即将上线 */
.coming-soon {
  text-align: center;
  padding: 60px 0;
}

.coming-soon-text {
  color: #666;
  margin-top: 16px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .main-content {
    flex-direction: column;
  }
  
  .sidebar-left {
    width: 100%;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .idcard-upload {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .item-info {
    width: 100%;
    justify-content: space-between;
  }
  
  .security-score {
    margin-top: 12px;
  }
}

/* 上传组件样式 */
:deep(.avatar-uploader .el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: #409eff;
}

:deep(.avatar-uploader-icon) {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

:deep(.idcard-image) {
  width: 178px;
  height: 178px;
  display: block;
}
</style>