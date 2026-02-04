import type { RouteRecordRaw } from 'vue-router'

function toCamelCaseAdvanced(str: string, firstLower = false) {
  const words = str.replaceAll('-', '_').split('_').filter(word => word)
  return words.map((word, index) => {
    if (index === 0 && firstLower) {
      return word.toLowerCase()
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  }).join('')
}

/**
 * 获取缓存的路由对应组件的名称
 * @param routes - 转换后的vue路由
 */
export function getCacheRoutes(routes: RouteRecordRaw[]) {
  const cacheNames: string[] = []
  routes.forEach((route) => {
    if (hasChildren(route)) {
      (route.children as RouteRecordRaw[]).forEach((item) => {
        if (isKeepAlive(item)) {
          cacheNames.push('App' + toCamelCaseAdvanced(item.name as string))
        }
      })
    } else if (isKeepAlive(route)) {
      cacheNames.push('App' + toCamelCaseAdvanced(route.name as string))
    }
  })
  return cacheNames
}

/**
 * 路由是否缓存
 * @param route
 */
function isKeepAlive(route: RouteRecordRaw) {
  return Boolean(route?.meta?.keepAlive)
}
/**
 * 是否有二级路由
 * @param route
 */
function hasChildren(route: RouteRecordRaw) {
  return Boolean(route.children && route.children.length)
}
