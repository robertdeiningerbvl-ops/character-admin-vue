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
      class="sidebar-container"
      :ui="{
        header: 'px-4 py-5',
        footer: 'lg:border-t lg:border-gray-200/60 dark:lg:border-gray-700/60 py-4 footer-custom-padding',
        body: 'px-3 py-4'
      }"
    >
      <template #header="{ collapsed }">
        <div
          v-if="collapsed"
          class="m-auto"
        >
          <img
            v-if="colorMode.value === 'dark'"
            src="@/assets/img/logo-dark.png"
            class="w-auto h-8"
          >
          <img
            v-else
            src="@/assets/img/logo.png"
            class="w-auto h-8"
          >
        </div>
        <template v-else>
          <div class="px-2">
            <img
              v-if="colorMode.value === 'dark'"
              src="@/assets/img/title-logo-dark.png"
              class="w-auto h-8"
            >
            <img
              v-else
              src="@/assets/img/logo.png"
              class="w-auto h-8"
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
            item: 'mb-0.5',
            link: 'group rounded-lg px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors duration-150',
            linkLeadingIcon: 'size-5 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150',
            linkLabel: 'text-gray-700 dark:text-gray-200 text-sm font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-150',
            linkLabelActive: 'text-primary-600 dark:text-primary-400 font-semibold',
            linkActive: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600',
            linkLeadingIconActive: 'text-primary-600 dark:text-primary-400',
            childList: 'ml-4 mt-1 space-y-0.5 border-l border-gray-200 dark:border-gray-700 pl-3',
            childItem: ''
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
.sidebar-container {
  background: linear-gradient(180deg, #fafbfc 0%, #f5f6f8 100%);
}

:deep(.dark) .sidebar-container,
.dark .sidebar-container {
  background: linear-gradient(180deg, #1a1b1e 0%, #141517 100%);
}

@media (max-width: 1250px) {
  .footer-custom-padding {
    padding-inline: calc(var(--spacing) * 1);
  }
}

/* 侧边栏滚动条 */
:deep(.overflow-y-auto)::-webkit-scrollbar {
  width: 4px;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.dark :deep(.overflow-y-auto)::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

.dark :deep(.overflow-y-auto)::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
