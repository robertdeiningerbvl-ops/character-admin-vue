<script setup lang="ts">
import { useRouteStore } from '@/store'

const route = useRoute()
const routeStore = useRouteStore()

interface BreadcrumbItem {
  label: string
  to?: string
  icon?: string
}

// 获取路由的所有父级菜单
const getMenuParents = (menus: any[], targetPath: string, parents: any[] = []): any[] => {
  for (const menu of menus) {
    if (menu.to === targetPath) {
      return [...parents, menu]
    }
    if (menu.children && menu.children.length > 0) {
      const found = getMenuParents(menu.children, targetPath, [...parents, menu])
      if (found.length > 0) return found
    }
  }
  return []
}

// 根据路由路径生成面包屑
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    { label: '首页', to: '/', icon: 'lucide:home' }
  ]

  // 如果是首页，只显示首页
  if (route.path === '/') {
    return items
  }

  // 从菜单中查找当前路由
  const menus = routeStore.menus
  const menuParents = getMenuParents(menus, route.path)

  if (menuParents.length > 0) {
    // 跳过第一个（首页已经添加）
    menuParents.forEach((menu, index) => {
      if (menu.to !== '/' && menu.label) {
        items.push({
          label: menu.label,
          to: index < menuParents.length - 1 ? menu.to : undefined,
          icon: index === 0 ? menu.icon : undefined
        })
      }
    })
  } else {
    // 如果在菜单中找不到，使用路径作为标签
    const pathSegments = route.path.split('/').filter(Boolean)
    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1]
      const label = (route.meta.title as string) || lastSegment || '未知页面'
      items.push({
        label
      })
    }
  }

  return items
})
</script>

<template>
  <nav class="flex items-center gap-2 text-sm">
    <template v-for="(item, index) in breadcrumbs" :key="index">
      <div class="flex items-center gap-2">
        <UIcon
          v-if="item.icon"
          :name="item.icon"
          class="w-4 h-4 text-gray-500 dark:text-gray-400"
        />
        <NuxtLink
          v-if="item.to && index < breadcrumbs.length - 1"
          :to="item.to"
          class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
        <span
          v-else
          class="font-medium"
          :class="index === breadcrumbs.length - 1
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-600 dark:text-gray-400'"
        >
          {{ item.label }}
        </span>
      </div>
      <UIcon
        v-if="index < breadcrumbs.length - 1"
        name="i-lucide-chevron-right"
        class="w-4 h-4 text-gray-400 dark:text-gray-600"
      />
    </template>
  </nav>
</template>
