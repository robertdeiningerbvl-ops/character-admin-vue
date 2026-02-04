<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
}>(), {
  modelValue: ''
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const selectedIcon = ref(props.modelValue)

// 常用的 Material Symbols 图标列表
const iconList = [
  // 导航和常用
  'i-material-symbols-home',
  'i-material-symbols-home-outline',
  'i-material-symbols-dashboard',
  'i-material-symbols-dashboard-outline',
  'i-material-symbols-menu',
  'i-material-symbols-menu-open',
  'i-material-symbols-apps',
  'i-material-symbols-grid-view',
  'i-material-symbols-view-module',
  'i-material-symbols-view-list',
  'i-material-symbols-view-agenda',

  // 用户和账户
  'i-material-symbols-person',
  'i-material-symbols-person-outline',
  'i-material-symbols-account-circle',
  'i-material-symbols-account-circle-outline',
  'i-material-symbols-group',
  'i-material-symbols-group-outline',
  'i-material-symbols-supervisor-account',
  'i-material-symbols-badge',
  'i-material-symbols-badge-outline',

  // 设置和工具
  'i-material-symbols-settings',
  'i-material-symbols-settings-outline',
  'i-material-symbols-tune',
  'i-material-symbols-build',
  'i-material-symbols-build-circle',
  'i-material-symbols-construction',
  'i-material-symbols-engineering',

  // 搜索和查找
  'i-material-symbols-search',
  'i-material-symbols-search-outline',
  'i-material-symbols-filter-list',
  'i-material-symbols-filter-alt',
  'i-material-symbols-sort',
  'i-material-symbols-zoom-in',
  'i-material-symbols-zoom-out',

  // 编辑和操作
  'i-material-symbols-edit',
  'i-material-symbols-edit-outline',
  'i-material-symbols-edit-square',
  'i-material-symbols-edit-square-outline',
  'i-material-symbols-delete',
  'i-material-symbols-delete-outline',
  'i-material-symbols-delete-forever',
  'i-material-symbols-add',
  'i-material-symbols-add-circle',
  'i-material-symbols-add-circle-outline',
  'i-material-symbols-remove',
  'i-material-symbols-remove-circle',
  'i-material-symbols-remove-circle-outline',
  'i-material-symbols-close',
  'i-material-symbols-cancel',
  'i-material-symbols-cancel-outline',

  // 保存和文件
  'i-material-symbols-save',
  'i-material-symbols-save-outline',
  'i-material-symbols-save-as',
  'i-material-symbols-upload',
  'i-material-symbols-upload-file',
  'i-material-symbols-download',
  'i-material-symbols-cloud-upload',
  'i-material-symbols-cloud-download',
  'i-material-symbols-file-copy',
  'i-material-symbols-content-copy',
  'i-material-symbols-content-paste',

  // 文件和文件夹
  'i-material-symbols-folder',
  'i-material-symbols-folder-outline',
  'i-material-symbols-folder-open',
  'i-material-symbols-folder-special',
  'i-material-symbols-description',
  'i-material-symbols-description-outline',
  'i-material-symbols-insert-drive-file',
  'i-material-symbols-note',
  'i-material-symbols-article',
  'i-material-symbols-draft',

  // 图片和媒体
  'i-material-symbols-image',
  'i-material-symbols-image-outline',
  'i-material-symbols-photo',
  'i-material-symbols-photo-camera',
  'i-material-symbols-camera-alt',
  'i-material-symbols-videocam',
  'i-material-symbols-video-library',
  'i-material-symbols-play-circle',
  'i-material-symbols-play-arrow',
  'i-material-symbols-pause',
  'i-material-symbols-pause-circle',
  'i-material-symbols-stop',
  'i-material-symbols-stop-circle',

  // 音频
  'i-material-symbols-volume-up',
  'i-material-symbols-volume-down',
  'i-material-symbols-volume-off',
  'i-material-symbols-volume-mute',
  'i-material-symbols-music-note',
  'i-material-symbols-audiotrack',
  'i-material-symbols-headphones',
  'i-material-symbols-mic',
  'i-material-symbols-mic-off',

  // 通讯
  'i-material-symbols-mail',
  'i-material-symbols-mail-outline',
  'i-material-symbols-email',
  'i-material-symbols-drafts',
  'i-material-symbols-send',
  'i-material-symbols-chat',
  'i-material-symbols-chat-outline',
  'i-material-symbols-forum',
  'i-material-symbols-message',
  'i-material-symbols-comment',
  'i-material-symbols-phone',
  'i-material-symbols-call',
  'i-material-symbols-smartphone',

  // 通知和提醒
  'i-material-symbols-notifications',
  'i-material-symbols-notifications-outline',
  'i-material-symbols-notifications-active',
  'i-material-symbols-notifications-off',
  'i-material-symbols-alarm',
  'i-material-symbols-alarm-on',
  'i-material-symbols-alarm-add',
  'i-material-symbols-schedule',
  'i-material-symbols-event',
  'i-material-symbols-event-note',
  'i-material-symbols-calendar-today',
  'i-material-symbols-calendar-month',

  // 收藏和标记
  'i-material-symbols-star',
  'i-material-symbols-star-outline',
  'i-material-symbols-star-half',
  'i-material-symbols-favorite',
  'i-material-symbols-favorite-outline',
  'i-material-symbols-bookmark',
  'i-material-symbols-bookmark-outline',
  'i-material-symbols-bookmark-added',
  'i-material-symbols-flag',
  'i-material-symbols-flag-outline',
  'i-material-symbols-label',
  'i-material-symbols-label-outline',
  'i-material-symbols-tag',

  // 安全和隐私
  'i-material-symbols-lock',
  'i-material-symbols-lock-outline',
  'i-material-symbols-lock-open',
  'i-material-symbols-security',
  'i-material-symbols-shield',
  'i-material-symbols-verified',
  'i-material-symbols-verified-user',
  'i-material-symbols-key',
  'i-material-symbols-vpn-key',
  'i-material-symbols-fingerprint',

  // 可见性
  'i-material-symbols-visibility',
  'i-material-symbols-visibility-outline',
  'i-material-symbols-visibility-off',
  'i-material-symbols-remove-red-eye',
  'i-material-symbols-preview',

  // 商务和购物
  'i-material-symbols-shopping-cart',
  'i-material-symbols-shopping-cart-outline',
  'i-material-symbols-shopping-bag',
  'i-material-symbols-store',
  'i-material-symbols-storefront',
  'i-material-symbols-credit-card',
  'i-material-symbols-payment',
  'i-material-symbols-wallet',
  'i-material-symbols-receipt',
  'i-material-symbols-receipt-long',

  // 金融
  'i-material-symbols-attach-money',
  'i-material-symbols-monetization-on',
  'i-material-symbols-currency-yuan',
  'i-material-symbols-currency-exchange',
  'i-material-symbols-savings',
  'i-material-symbols-account-balance',
  'i-material-symbols-account-balance-wallet',
  'i-material-symbols-trending-up',
  'i-material-symbols-trending-down',
  'i-material-symbols-trending-flat',

  // 数据和图表
  'i-material-symbols-analytics',
  'i-material-symbols-analytics-outline',
  'i-material-symbols-bar-chart',
  'i-material-symbols-pie-chart',
  'i-material-symbols-donut-large',
  'i-material-symbols-leaderboard',
  'i-material-symbols-insights',
  'i-material-symbols-query-stats',
  'i-material-symbols-data-usage',

  // 位置和地图
  'i-material-symbols-location-on',
  'i-material-symbols-location-off',
  'i-material-symbols-place',
  'i-material-symbols-pin-drop',
  'i-material-symbols-map',
  'i-material-symbols-explore',
  'i-material-symbols-navigation',
  'i-material-symbols-directions',

  // 时间
  'i-material-symbols-access-time',
  'i-material-symbols-timer',
  'i-material-symbols-hourglass-empty',
  'i-material-symbols-history',
  'i-material-symbols-update',
  'i-material-symbols-restore',

  // 天气
  'i-material-symbols-wb-sunny',
  'i-material-symbols-nightlight',
  'i-material-symbols-cloud',
  'i-material-symbols-water-drop',
  'i-material-symbols-air',
  'i-material-symbols-thunderstorm',

  // 网络和连接
  'i-material-symbols-wifi',
  'i-material-symbols-wifi-off',
  'i-material-symbols-signal-cellular-alt',
  'i-material-symbols-bluetooth',
  'i-material-symbols-bluetooth-disabled',
  'i-material-symbols-language',
  'i-material-symbols-public',
  'i-material-symbols-share',
  'i-material-symbols-link',
  'i-material-symbols-link-off',

  // 设备
  'i-material-symbols-computer',
  'i-material-symbols-laptop',
  'i-material-symbols-tablet',
  'i-material-symbols-phone-android',
  'i-material-symbols-phone-iphone',
  'i-material-symbols-watch',
  'i-material-symbols-tv',
  'i-material-symbols-headset',
  'i-material-symbols-keyboard',
  'i-material-symbols-mouse',
  'i-material-symbols-battery-full',
  'i-material-symbols-battery-charging-full',
  'i-material-symbols-power',
  'i-material-symbols-print',

  // 代码和开发
  'i-material-symbols-code',
  'i-material-symbols-code-blocks',
  'i-material-symbols-terminal',
  'i-material-symbols-database',
  'i-material-symbols-storage',
  'i-material-symbols-api',
  'i-material-symbols-bug-report',
  'i-material-symbols-integration-instructions',

  // 状态和反馈
  'i-material-symbols-check',
  'i-material-symbols-check-circle',
  'i-material-symbols-check-circle-outline',
  'i-material-symbols-done',
  'i-material-symbols-done-all',
  'i-material-symbols-error',
  'i-material-symbols-error-outline',
  'i-material-symbols-warning',
  'i-material-symbols-warning-outline',
  'i-material-symbols-info',
  'i-material-symbols-info-outline',
  'i-material-symbols-help',
  'i-material-symbols-help-outline',
  'i-material-symbols-priority-high',
  'i-material-symbols-new-releases',

  // 箭头和方向
  'i-material-symbols-arrow-upward',
  'i-material-symbols-arrow-downward',
  'i-material-symbols-arrow-back',
  'i-material-symbols-arrow-forward',
  'i-material-symbols-arrow-back-ios',
  'i-material-symbols-arrow-forward-ios',
  'i-material-symbols-expand-more',
  'i-material-symbols-expand-less',
  'i-material-symbols-chevron-left',
  'i-material-symbols-chevron-right',
  'i-material-symbols-unfold-more',
  'i-material-symbols-unfold-less',
  'i-material-symbols-first-page',
  'i-material-symbols-last-page',

  // 其他常用
  'i-material-symbols-refresh',
  'i-material-symbols-sync',
  'i-material-symbols-sync-alt',
  'i-material-symbols-cached',
  'i-material-symbols-swap-horiz',
  'i-material-symbols-swap-vert',
  'i-material-symbols-fullscreen',
  'i-material-symbols-fullscreen-exit',
  'i-material-symbols-open-in-new',
  'i-material-symbols-open-in-full',
  'i-material-symbols-launch',
  'i-material-symbols-lightbulb',
  'i-material-symbols-lightbulb-outline',
  'i-material-symbols-tips-and-updates',
  'i-material-symbols-psychology',
  'i-material-symbols-emoji-objects',
  'i-material-symbols-gift',
  'i-material-symbols-celebration',
  'i-material-symbols-local-activity',
  'i-material-symbols-local-offer',
  'i-material-symbols-loyalty'
]

const filteredIcons = computed(() => {
  if (!searchQuery.value) {
    return iconList
  }
  return iconList.filter(icon =>
    icon.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectIcon = (icon: string) => {
  selectedIcon.value = icon
  emit('update:modelValue', icon)
  isOpen.value = false
}

const clearIcon = () => {
  selectedIcon.value = ''
  emit('update:modelValue', '')
}

watch(() => props.modelValue, (newVal) => {
  selectedIcon.value = newVal
})
</script>

<template>
  <div class="w-full">
    <div class="flex gap-2">
      <UInput
        :model-value="selectedIcon"
        placeholder="选择图标"
        readonly
        class="flex-1 cursor-pointer"
        @click="isOpen = true"
      >
        <template #leading>
          <UIcon
            v-if="selectedIcon"
            :name="selectedIcon"
            class="w-5 h-5"
          />
          <UIcon
            v-else
            name="i-lucide-search"
            class="w-5 h-5 text-gray-400"
          />
        </template>
        <template #trailing>
          <UButton
            v-if="selectedIcon"
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-circle-x"
            @click.stop="clearIcon"
          />
        </template>
      </UInput>
      <UButton
        icon="i-lucide-gallery-horizontal"
        color="neutral"
        variant="outline"
        @click="isOpen = true"
      />
    </div>

    <UModal v-model:open="isOpen" title="选择图标">
      <template #body>
        <div class="flex flex-col gap-4">
          <UInput
            v-model="searchQuery"
            placeholder="搜索图标..."
            icon="i-lucide-search"
          >
            <template #trailing>
              <UButton
                v-if="searchQuery"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                @click="searchQuery = ''"
              />
            </template>
          </UInput>

          <div class="grid grid-cols-8 gap-2 max-h-[400px] overflow-y-auto p-2">
            <button
              v-for="icon in filteredIcons"
              :key="icon"
              :title="icon"
              class="flex items-center justify-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-primary-500 transition-all cursor-pointer"
              :class="{
                'bg-primary-50 dark:bg-primary-900/20 border-primary-500': selectedIcon === icon
              }"
              @click="selectIcon(icon)"
            >
              <UIcon :name="icon" class="w-6 h-6" />
            </button>
          </div>

          <div v-if="filteredIcons.length === 0" class="text-center py-8 text-gray-500">
            未找到匹配的图标
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-between items-center w-full">
          <span class="text-sm text-gray-500">
            共 {{ filteredIcons.length }} 个图标
          </span>
          <UButton
            label="关闭"
            color="neutral"
            variant="outline"
            @click="isOpen = false"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
