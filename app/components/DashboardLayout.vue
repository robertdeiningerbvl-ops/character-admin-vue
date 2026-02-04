<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')
</script>

<template>
  <UDashboardPanel>
    <template v-if="isMobile" #header>
      <UDashboardNavbar :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="!isMobile" class="absolute top-0 left-0 right-0 h-(--ui-header-height) flex items-center justify-between border-b border-(--ui-border) px-4 sm:px-6 bg-(--ui-bg)">
        <div class="flex items-center gap-4">
          <UDashboardSidebarCollapse />
          <AutoBreadcrumb />
        </div>
      </div>

      <slot />
    </template>
  </UDashboardPanel>
</template>
