import { defineStore } from 'pinia'
import { useAuthStore } from '../auth'

interface RouteState {
  /** 是否初始化了权限路由 */
  isInitAuthRoute: boolean
  /** 菜单 */
  menus: any[]
  /** 缓存的路由名称 */
  cacheRoutes: string[]
}

export const useRouteStore = defineStore('route-store', {
  state: (): RouteState => ({
    isInitAuthRoute: false,
    menus: [],
    cacheRoutes: []
  }),
  actions: {
    /** 重置路由的store */
    resetRouteStore() {
      this.$reset()
    },

    /**
     * 处理权限路由
     * @param routes - 权限路由
     */
    handleAuthRoute(routes: string[]) {
      this.menus = transformAuthRouteToMenu(routes)
      this.cacheRoutes = getCacheRoutes(transformAuthRouteToVueRoutes(routes))
    },

    /** 初始化权限路由 */
    async initAuthRoute() {
      const auth = useAuthStore()
      await auth
        .afterLogin()
        .then(async (res) => {
          if (!res.menus.some((item: any) => item.router === '/')) {
            res.menus.push({
              id: 888,
              icon: '',
              is_show: 1,
              keepalive: 0,
              name: '首页',
              sort: 0,
              pid: 0,
              router: '/',
              perms: '',
              ty: 1
            } as any)
          }
          this.handleAuthRoute(filterAuthRoutesByUserPermission(sortRoutes(transformAPIRouteToAuthRoutes(res.menus)), res.permission))
          this.isInitAuthRoute = true
        })
        .catch(() => {
          auth.resetAuthStore()
        })
    },

    /** 添加某个缓存路由 */
    addCacheRoute(name: string) {
      const index = this.cacheRoutes.indexOf(name)
      if (index === -1) {
        this.cacheRoutes.push(name)
      }
    },

    /** 从缓存路由中去除某个路由 */
    removeCacheRoute(name: string) {
      const index = this.cacheRoutes.indexOf(name)
      if (index > -1) {
        this.cacheRoutes.splice(index, 1)
      }
    }
  }
})
