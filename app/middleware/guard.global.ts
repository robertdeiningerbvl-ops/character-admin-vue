import { useRouteStore } from '@/store'

// 防止重复初始化的标志
let isInitializing = false

export default defineNuxtRouteMiddleware(async (to) => {
  const isLogin = Boolean(localStg.get('token'))

  if (isLogin && to.name === 'login') {
    return navigateTo('/')
  } else if (!isLogin && to.name !== 'login') {
    return navigateTo(`/login?redirect=${to.fullPath}`)
  } else if (to.name !== 'login') {
    const route = useRouteStore()
    if (!route.isInitAuthRoute && !isInitializing) {
      isInitializing = true
      try {
        await route.initAuthRoute()
      } finally {
        isInitializing = false
      }
    }
  }
})
