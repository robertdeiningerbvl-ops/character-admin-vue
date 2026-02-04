<script setup lang="ts">
import * as z from 'zod'
import { omit } from '@nuxt/ui/utils'
import { useAuthStore, useRouteStore } from '@/store'

useSeoMeta({
  title: '青丘山 - 管理员登录'
})

const loading = ref(false)
const passwordVisibility = ref(false)
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const routeStore = useRouteStore()
const appConfig: any = useAppConfig()
const colorMode = useColorMode()

// 动画挂载状态
const mounted = ref(false)
onMounted(() => {
  setTimeout(() => {
    mounted.value = true
  }, 100)
})

const fields = [{
  name: 'email',
  type: 'text' as const,
  size: 'lg' as const,
  placeholder: '请输入账号',
  required: true
}, {
  name: 'password',
  size: 'lg' as const,
  type: 'password' as const,
  placeholder: '请输入密码',
  required: true
}]

const schema = z.object({
  email: z.string().min(1, '账号不能为空'),
  password: z.string().min(6, '至少包含6个字符')
})

async function onSubmit(payload: any) {
  loading.value = true
  auth
    .login({ ...payload.data })
    .then(async () => {
      await routeStore.initAuthRoute()

      loading.value = false
      if (route.query?.redirect) {
        router.push({ path: route.query.redirect as string })
      } else {
        router.push({ path: '/' })
      }
    })
    .catch(() => {
      loading.value = false
    })
}
</script>

<template>
  <div class="login-container">
    <!-- 左侧表单区域 -->
    <div class="left-panel" :class="{ 'active': mounted }">
      <div class="form-wrapper">
        <!-- 头部 -->
        <div class="form-header">
          <div class="header-top">
            <div class="status-indicator">
              <span class="status-dot" />
              <span class="status-text">SYSTEM ONLINE</span>
            </div>
            <UColorModeButton class="theme-btn" />
          </div>

          <div class="brand-section">
            <h1 class="brand-name">青丘山</h1>
            <p class="brand-desc">ADMIN CONTROL SYSTEM</p>
            <div class="divider-line" />
          </div>
        </div>

        <!-- 表单 -->
        <div class="form-content">
          <UAuthForm
            :loading="loading"
            :fields="fields"
            :schema="schema"
            :submit="{
              label: '登录系统',
              size: 'lg',
              trailingIcon: 'i-lucide-arrow-right',
              ui: {
                base: 'login-btn',
                trailingIcon: 'size-5'
              }
            }"
            @submit="onSubmit"
          >
            <template #email-field="{ state, field }:any">
              <div class="input-group">
                <label class="input-label">
                  <UIcon name="i-lucide-user" class="label-icon" />
                  <span>账号</span>
                </label>
                <UInput
                  v-model.trim="state[field.name]"
                  v-bind="omit(field, ['label', 'description', 'help', 'hint', 'size', 'required', 'defaultValue'])"
                  :ui="{ root: 'w-full', trailing: 'pe-1' }"
                  class="form-input"
                >
                  <template #trailing>
                    <UButton
                      v-if="state[field.name]"
                      color="neutral"
                      variant="link"
                      size="sm"
                      icon="i-lucide-x"
                      tabindex="-1"
                      @click="state[field.name] = ''"
                    />
                  </template>
                </UInput>
              </div>
            </template>

            <template #password-field="{ state, field }: any">
              <div class="input-group">
                <label class="input-label">
                  <UIcon name="i-lucide-lock" class="label-icon" />
                  <span>密码</span>
                </label>
                <UInput
                  v-model.trim="state[field.name]"
                  :type="passwordVisibility ? 'text' : 'password'"
                  v-bind="omit(field, ['label', 'description', 'help', 'hint', 'size', 'type', 'required', 'defaultValue'])"
                  :ui="{ root: 'w-full', trailing: 'pe-1' }"
                  class="form-input"
                >
                  <template #trailing>
                    <UButton
                      v-if="state[field.name]"
                      color="neutral"
                      variant="link"
                      size="sm"
                      icon="i-lucide-x"
                      tabindex="-1"
                      @click="state[field.name] = ''"
                    />
                    <UButton
                      color="neutral"
                      variant="link"
                      size="sm"
                      :icon="passwordVisibility ? appConfig.ui.icons.eyeOff : appConfig.ui.icons.eye"
                      tabindex="-1"
                      @click="passwordVisibility = !passwordVisibility"
                    />
                  </template>
                </UInput>
              </div>
            </template>
          </UAuthForm>
        </div>

        <!-- 底部 -->
        <div class="form-footer">
          <div class="security-badges">
            <div class="badge-item">
              <UIcon name="i-lucide-shield-check" />
              <span>安全加密</span>
            </div>
            <div class="badge-item">
              <UIcon name="i-lucide-fingerprint" />
              <span>身份验证</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧3D展示区域 -->
    <div class="right-panel" :class="{ 'active': mounted }">
      <!-- 动态背景 -->
      <div class="bg-effects">
        <div class="gradient-orb orb-1" />
        <div class="gradient-orb orb-2" />
        <div class="gradient-orb orb-3" />
      </div>

      <!-- 网格背景 -->
      <div class="grid-pattern" />

      <!-- 3D几何体 -->
      <div class="geometry-container">
        <!-- 旋转立方体 -->
        <div class="shape-wrapper cube-wrapper">
          <div class="rotating-cube">
            <div class="cube-face front" />
            <div class="cube-face back" />
            <div class="cube-face left" />
            <div class="cube-face right" />
            <div class="cube-face top" />
            <div class="cube-face bottom" />
          </div>
        </div>

        <!-- 环形 -->
        <div class="shape-wrapper rings-wrapper">
          <div class="ring ring-1" />
          <div class="ring ring-2" />
          <div class="ring ring-3" />
        </div>

        <!-- 球体 -->
        <div class="shape-wrapper sphere-wrapper">
          <div class="sphere">
            <div v-for="i in 15" :key="i" class="sphere-line" :style="{ '--i': i }" />
          </div>
        </div>
      </div>

      <!-- 粒子效果 -->
      <div class="particles-layer">
        <div v-for="i in 60" :key="i" class="particle" :style="{ '--i': i }" />
      </div>

      <!-- 扫描线 -->
      <div class="scan-lines">
        <div class="scan-line" />
        <div class="scan-line delay-1" />
      </div>

      <!-- 数据流 -->
      <div class="data-flow">
        <div v-for="i in 6" :key="i" class="flow-line" :style="{ '--i': i }">
          <div class="flow-dot" />
          <div class="flow-dot" />
          <div class="flow-dot" />
        </div>
      </div>

      <!-- 信息面板 -->
      <div class="info-panels">
        <div class="info-card">
          <div class="card-icon">
            <UIcon name="i-lucide-shield" />
          </div>
          <div class="card-content">
            <div class="card-label">安全等级</div>
            <div class="card-value">99.9%</div>
          </div>
        </div>
        <div class="info-card">
          <div class="card-icon">
            <UIcon name="i-lucide-zap" />
          </div>
          <div class="card-content">
            <div class="card-label">响应速度</div>
            <div class="card-value">0.2ms</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ==================== 基础布局 ==================== */
.login-container {
  display: flex;
  min-height: 100vh;
  overflow: hidden;
}

/* ==================== 左侧表单区域 ==================== */
.left-panel {
  flex: 0 0 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
  position: relative;
  z-index: 10;
  opacity: 0;
  transform: translateX(-50px);
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.left-panel.active {
  opacity: 1;
  transform: translateX(0);
}

:global(.dark .left-panel) {
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
}

.form-wrapper {
  width: 100%;
  max-width: 480px;
}

/* ==================== 表单头部 ==================== */
.form-header {
  margin-bottom: 3rem;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.3);
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #4f46e5;
}

:global(.dark .status-indicator) {
  background: rgba(0, 170, 255, 0.15);
  border-color: rgba(0, 170, 255, 0.4);
  color: #00aaff;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4f46e5;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 10px #4f46e5;
}

:global(.dark .status-dot) {
  background: #00aaff;
  box-shadow: 0 0 15px #00aaff;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

.theme-btn {
  padding: 0.6rem !important;
  border-radius: 12px !important;
  background: rgba(79, 70, 229, 0.1) !important;
  border: 1px solid rgba(79, 70, 229, 0.3) !important;
  transition: all 0.3s ease !important;
}

.theme-btn:hover {
  transform: rotate(180deg) scale(1.1);
  background: rgba(79, 70, 229, 0.2) !important;
}

:global(.dark .theme-btn) {
  background: rgba(0, 170, 255, 0.15) !important;
  border-color: rgba(0, 170, 255, 0.3) !important;
}

:global(.dark .theme-btn:hover) {
  background: rgba(0, 170, 255, 0.25) !important;
}

/* 品牌部分 */
.brand-section {
  text-align: center;
}

.brand-name {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
}

:global(.dark .brand-name) {
  background: linear-gradient(135deg, #00d4ff, #00aaff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 10px rgba(0, 170, 255, 0.5));
}

.brand-desc {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(79, 70, 229, 0.7);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

:global(.dark .brand-desc) {
  color: rgba(0, 170, 255, 0.8);
}

.divider-line {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4f46e5, transparent);
  margin: 0 auto;
}

:global(.dark .divider-line) {
  background: linear-gradient(90deg, transparent, #00aaff, transparent);
}

/* ==================== 表单内容 ==================== */
.form-content {
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4f46e5;
  text-transform: uppercase;
  letter-spacing: 1px;
}

:global(.dark .input-label) {
  color: #00aaff;
}

.label-icon {
  font-size: 1rem;
}

:global(.form-input) {
  background: rgba(255, 255, 255, 0.9) !important;
  border: 2px solid rgba(79, 70, 229, 0.3) !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

:global(.form-input input) {
  color: #1a202c !important;
  font-weight: 500 !important;
  background: transparent !important;
}

:global(.form-input input::placeholder) {
  color: rgba(26, 32, 44, 0.5) !important;
}

:global(.form-input:focus-within) {
  border-color: #4f46e5 !important;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
  transform: translateY(-2px);
}

:global(.dark .form-input) {
  background: rgba(15, 23, 42, 0.8) !important;
  border-color: rgba(0, 170, 255, 0.4) !important;
}

:global(.dark .form-input input) {
  color: #ffffff !important;
}

:global(.dark .form-input input::placeholder) {
  color: rgba(255, 255, 255, 0.4) !important;
}

:global(.dark .form-input:focus-within) {
  border-color: #00aaff !important;
  box-shadow: 0 0 0 4px rgba(0, 170, 255, 0.15), 0 0 20px rgba(0, 170, 255, 0.3) !important;
}

/* 登录按钮 */
:global(.login-btn) {
  width: 100%;
  margin-top: 1rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 2px !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 1rem !important;
  transition: all 0.3s ease !important;
}

:global(.login-btn:hover) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.4);
}

:global(.dark .login-btn) {
  background: linear-gradient(135deg, #0088ff, #00aaff) !important;
}

:global(.dark .login-btn:hover) {
  box-shadow: 0 10px 30px rgba(0, 170, 255, 0.5);
}

/* 表单底部 */
.form-footer {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(79, 70, 229, 0.2);
}

:global(.dark .form-footer) {
  border-top-color: rgba(0, 170, 255, 0.2);
}

.security-badges {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  color: rgba(79, 70, 229, 0.8);
  font-weight: 600;
  text-transform: uppercase;
}

.badge-item svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #4f46e5;
}

:global(.dark .badge-item) {
  color: rgba(0, 170, 255, 0.8);
}

:global(.dark .badge-item svg) {
  color: #00aaff;
}

/* ==================== 右侧3D展示区域 ==================== */
.right-panel {
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%);
  overflow: hidden;
  opacity: 0;
  transform: translateX(50px);
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
}

.right-panel.active {
  opacity: 1;
  transform: translateX(0);
}

:global(.dark .right-panel) {
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%);
}

/* 背景效果 */
.bg-effects {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.5;
  animation: orbFloat 20s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
  top: -10%;
  right: -10%;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.4), transparent);
  bottom: -10%;
  left: -10%;
  animation-delay: 7s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.35), transparent);
  top: 50%;
  left: 50%;
  animation-delay: 14s;
}

:global(.dark .orb-1) {
  background: radial-gradient(circle, rgba(0, 255, 255, 0.2), transparent);
}

:global(.dark .orb-2) {
  background: radial-gradient(circle, rgba(255, 0, 255, 0.15), transparent);
}

:global(.dark .orb-3) {
  background: radial-gradient(circle, rgba(0, 255, 136, 0.18), transparent);
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-30px, 30px) scale(0.9); }
}

/* 网格背景 */
.grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: 2;
  animation: gridMove 20s linear infinite;
}

:global(.dark .grid-pattern) {
  background-image:
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* 3D几何体容器 */
.geometry-container {
  position: absolute;
  inset: 0;
  z-index: 3;
  perspective: 1200px;
  transform-style: preserve-3d;
}

.shape-wrapper {
  position: absolute;
  transform-style: preserve-3d;
}

/* 立方体 */
.cube-wrapper {
  top: 20%;
  left: 20%;
  animation: float1 15s ease-in-out infinite;
}

@keyframes float1 {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(30px, -30px, 50px); }
}

.rotating-cube {
  width: 150px;
  height: 150px;
  position: relative;
  transform-style: preserve-3d;
  animation: cubeRotate 20s linear infinite;
}

@keyframes cubeRotate {
  0% { transform: rotateX(0deg) rotateY(0deg); }
  100% { transform: rotateX(360deg) rotateY(360deg); }
}

.cube-face {
  position: absolute;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

:global(.dark .cube-face) {
  background: rgba(0, 255, 255, 0.05);
  border-color: rgba(0, 255, 255, 0.4);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
}

.cube-face.front { transform: translateZ(75px); }
.cube-face.back { transform: rotateY(180deg) translateZ(75px); }
.cube-face.left { transform: rotateY(-90deg) translateZ(75px); }
.cube-face.right { transform: rotateY(90deg) translateZ(75px); }
.cube-face.top { transform: rotateX(90deg) translateZ(75px); }
.cube-face.bottom { transform: rotateX(-90deg) translateZ(75px); }

/* 环形 */
.rings-wrapper {
  top: 50%;
  left: 50%;
  animation: float2 18s ease-in-out infinite;
}

@keyframes float2 {
  0%, 100% { transform: translate3d(-50%, -50%, 0); }
  50% { transform: translate3d(-50%, -50%, 30px) rotate(180deg); }
}

.ring {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: ringRotate 10s linear infinite;
}

:global(.dark .ring) {
  border-color: rgba(0, 255, 255, 0.4);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
}

.ring-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  left: -100px;
}

.ring-2 {
  width: 280px;
  height: 280px;
  top: -140px;
  left: -140px;
  animation-direction: reverse;
  animation-duration: 15s;
}

.ring-3 {
  width: 360px;
  height: 360px;
  top: -180px;
  left: -180px;
  animation-duration: 20s;
}

@keyframes ringRotate {
  0% { transform: rotateX(60deg) rotateZ(0deg); }
  100% { transform: rotateX(60deg) rotateZ(360deg); }
}

/* 球体 */
.sphere-wrapper {
  bottom: 20%;
  right: 15%;
  animation: float3 12s ease-in-out infinite;
}

@keyframes float3 {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(-20px, 20px, 40px); }
}

.sphere {
  width: 120px;
  height: 120px;
  position: relative;
  transform-style: preserve-3d;
  animation: sphereRotate 15s linear infinite;
}

@keyframes sphereRotate {
  0% { transform: rotateY(0deg) rotateX(0deg); }
  100% { transform: rotateY(360deg) rotateX(360deg); }
}

.sphere-line {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: rotateY(calc(var(--i) * 24deg));
}

:global(.dark .sphere-line) {
  border-color: rgba(255, 0, 255, 0.3);
}

/* 粒子效果 */
.particles-layer {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  left: calc(var(--i) * 1.67%);
  top: calc(var(--i) * 1.67%);
  animation: particleFloat 12s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.2s);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

:global(.dark .particle) {
  background: rgba(0, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
}

@keyframes particleFloat {
  0%, 100% {
    transform: translate3d(0, 0, 0);
    opacity: 0.3;
  }
  50% {
    transform: translate3d(
      calc(sin(var(--i)) * 60px),
      calc(cos(var(--i)) * 60px),
      40px
    );
    opacity: 1;
  }
}

/* 扫描线 */
.scan-lines {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.scan-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  animation: scanMove 8s linear infinite;
}

:global(.dark .scan-line) {
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), transparent);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
}

.scan-line.delay-1 {
  animation-delay: 4s;
}

@keyframes scanMove {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* 数据流 */
.data-flow {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

.flow-line {
  position: absolute;
  width: 2px;
  height: 100%;
  left: calc(var(--i) * 16.67%);
  animation: flowMove 6s linear infinite;
  animation-delay: calc(var(--i) * -1s);
}

.flow-dot {
  position: absolute;
  width: 100%;
  height: 30px;
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  margin-bottom: 50px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

:global(.dark .flow-dot) {
  background: linear-gradient(180deg, transparent, rgba(0, 255, 255, 0.8), transparent);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
}

@keyframes flowMove {
  0% { transform: translateY(-100%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}

/* 信息面板 */
.info-panels {
  position: absolute;
  bottom: 3rem;
  right: 3rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  animation: cardSlideIn 0.6s ease-out both;
}

.info-card:nth-child(1) { animation-delay: 1s; }
.info-card:nth-child(2) { animation-delay: 1.2s; }

@keyframes cardSlideIn {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

:global(.dark .info-card) {
  background: rgba(15, 23, 42, 0.8);
  border-color: rgba(0, 170, 255, 0.4);
}

.card-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1.25rem;
}

:global(.dark .card-icon) {
  background: rgba(0, 170, 255, 0.2);
  color: #00aaff;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

:global(.dark .card-label) {
  color: rgba(255, 255, 255, 0.7);
}

.card-value {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px;
}

:global(.dark .card-value) {
  color: #00aaff;
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 1024px) {
  .left-panel {
    flex: 0 0 50%;
  }

  .geometry-container {
    opacity: 0.7;
  }

  .info-panels {
    bottom: 2rem;
    right: 2rem;
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .left-panel {
    flex: 1;
    min-height: 100vh;
  }

  .right-panel {
    display: none;
  }

  .form-wrapper {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .left-panel {
    padding: 2rem 1.5rem;
  }

  .brand-name {
    font-size: 2rem;
  }

  .brand-desc {
    font-size: 0.65rem;
  }

  .security-badges {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
