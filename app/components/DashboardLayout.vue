<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')

const scrollRef = ref<HTMLElement | null>(null)
provide('scrollContainer', scrollRef)
</script>

<template>
  <UDashboardPanel>
    <template v-if="isMobile" #header>
      <UDashboardNavbar :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <slot name="actions" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="!isMobile" class="absolute top-0 left-0 right-0 h-(--ui-header-height) flex items-center justify-between border-b border-(--ui-border) px-4 sm:px-6 bg-(--ui-bg) z-10">
        <div class="flex items-center gap-4">
          <UDashboardSidebarCollapse />
          <AutoBreadcrumb />
        </div>
        <slot name="actions" />
      </div>

      <div ref="scrollRef" class="dashboard-scroll-body pt-(--ui-header-height)">
        <slot />
      </div>

      <ScrollAnchor />
    </template>
  </UDashboardPanel>
</template>

<style scoped>
.dashboard-scroll-body {
  height: 100%;
  overflow-y: auto;
}
</style>
