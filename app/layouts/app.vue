<script setup lang="ts">
import { useRouteStore } from '@/store'

useSeoMeta({
  title: 'App',
  ogTitle: 'App'
})

const routeStore = useRouteStore()
const colorMode = useColorMode()
const open = ref(false)

const links = routeStore.menus as any
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      v-model:open="open"
      resizable
      collapsible
      :min-size="10"
      :max-size="20"
      :default-size="15"
      :ui="{
        header: 'px-0 gap-0 py-4 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-950/30',
        footer: 'lg:border-t lg:border-(--ui-border) py-3 footer-custom-padding bg-gradient-to-t from-gray-50/80 to-transparent dark:from-gray-900/80 backdrop-blur-sm',
        body: 'py-2'
      }"
    >
      <template #header="{ collapsed }">
        <div
          v-if="collapsed"
          class="m-auto transition-all duration-300 hover:scale-110"
        >
          <img
            v-if="colorMode.value === 'dark'"
            src="@/assets/img/logo-dark.png"
            class="w-auto h-8 drop-shadow-lg"
          >
          <img
            v-else
            src="@/assets/img/logo.png"
            class="w-auto h-8 drop-shadow-lg"
          >
        </div>
        <template v-else>
          <div class="ml-6.5 transition-all duration-300 hover:scale-105">
            <img
              v-if="colorMode.value === 'dark'"
              src="@/assets/img/title-logo-dark.png"
              class="w-auto h-8 drop-shadow-lg"
            >
            <img
              v-else
              src="@/assets/img/logo.png"
              class="w-auto h-8 drop-shadow-lg"
            >
          </div>
        </template>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links"
          orientation="vertical"
          :ui="{
            item: 'mb-1 transition-all duration-200',
            link: 'group relative overflow-hidden',
            linkLeadingIcon: 'size-5 text-(--ui-text-muted) group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200',
            linkLabel: 'text-(--ui-text-highlighted) font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-200',
            childList: 'ms-6 border-s-2 border-(--ui-border) dark:border-gray-700',
            childItem: 'ps-4 -ms-px relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-px before:bg-(--ui-border) dark:before:bg-gray-700'
          }"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>

<style scoped>
@media (max-width: 1250px) {
  .footer-custom-padding {
    padding-inline: calc(var(--spacing) * 1);
  }
}

/* 菜单项悬停动画 */
:deep(.group:hover) {
  transform: translateX(2px);
}

/* 激活菜单项的脉冲效果 */
:deep([data-active="true"]) {
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% {
    border-left-color: rgb(var(--color-primary-600));
  }
  50% {
    border-left-color: rgb(var(--color-primary-400));
  }
}

/* 侧边栏滚动条美化 */
:deep(.overflow-y-auto)::-webkit-scrollbar {
  width: 6px;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
  transition: background 0.2s;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* 深色模式滚动条 */
:deep(.dark .overflow-y-auto)::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
}

:deep(.dark .overflow-y-auto)::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}

/* 菜单项图标旋转效果 */
:deep(.group:hover .linkLeadingIcon) {
  transform: scale(1.1) rotate(5deg);
  transition: transform 0.2s ease-in-out;
}

/* 子菜单连接线动画 */
:deep(.childList) {
  position: relative;
}

:deep(.childList::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom,
    transparent 0%,
    rgb(var(--color-primary-200)) 10%,
    rgb(var(--color-primary-200)) 90%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s;
}

:deep(.childList:hover::before) {
  opacity: 1;
}
</style>
