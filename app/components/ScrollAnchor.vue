<script setup lang="ts">
const route = useRoute()

const allowedRoutes = [
  '/member/list',
  '/member/feedback',
  '/amusement/list',
  '/amusement/category',
  '/system/config',
  '/common/tag'
]

const visible = computed(() => allowedRoutes.includes(route.path))

const scrollContainer = inject<Ref<HTMLElement | null>>('scrollContainer', ref(null))

const appConfig = useAppConfig()
const primaryColor = computed(() => (appConfig.ui as any)?.colors?.primary ?? '#0f172b')

const hovered = ref<'top' | 'bottom' | null>(null)
const colorMode = useColorMode()

const btnStyle = computed(() => {
  const color = primaryColor.value
  const isDark = colorMode.value === 'dark'
  return {
    '--btn-primary': isDark ? '#ffffff' : color,
    '--btn-hover-color': isDark ? '#1a1b1e' : '#ffffff',
    'border': isDark ? '1px solid rgba(255,255,255,0.25)' : `1px solid ${color}40`,
    'background': isDark ? 'rgba(30,32,40,0.85)' : 'rgba(255,255,255,0.85)',
    'color': isDark ? '#ffffff' : color
  }
})

function scrollTo(pos: 'top' | 'bottom') {
  const target = scrollContainer.value ?? document.documentElement
  target.scrollTo({
    top: pos === 'top' ? 0 : target.scrollHeight,
    behavior: 'smooth'
  })
}
</script>

<template>
  <Transition name="anchor-fade">
    <div v-if="visible" class="scroll-anchor">
      <button
        class="anchor-btn"
        :style="btnStyle"
        title="回到顶部"
        @mouseenter="hovered = 'top'"
        @mouseleave="hovered = null"
        @click="scrollTo('top')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
      <button
        class="anchor-btn"
        :style="btnStyle"
        title="跳到底部"
        @mouseenter="hovered = 'bottom'"
        @mouseleave="hovered = null"
        @click="scrollTo('bottom')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.scroll-anchor {
  position: fixed;
  right: 1.25rem;
  bottom: 2rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.anchor-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.anchor-btn:hover {
  background: var(--btn-primary) !important;
  border-color: var(--btn-primary) !important;
  color: var(--btn-hover-color, #fff) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--btn-primary) 40%, transparent);
}

.anchor-btn:active {
  transform: translateY(0);
}

.anchor-fade-enter-active,
.anchor-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.anchor-fade-enter-from,
.anchor-fade-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
</style>
