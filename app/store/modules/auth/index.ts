import { defineStore } from 'pinia'
import { getToken, getUserInfo, clearAuthStorage } from './helpers'
import { login, rbacAdminGroup } from '@/api'

interface AuthState {
  /** 用户token */
  token: string
  /** 用户信息 */
  userInfo: ApiAccount.Info
  /** 权限组 */
  perms: string[]
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    userInfo: getUserInfo(),
    perms: []
  }),
  getters: {
    /** 是否登录 */
    isLogin(state) {
      return Boolean(state.token)
    }
  },
  actions: {
    /** 重置auth状态 */
    resetAuthStore() {
      clearAuthStorage()
      this.$reset()
      const router = useRouter()
      router.push({ path: '/login' })
    },
    /** 登录开始 */
    async login(params: ApiAuth.LoginParams) {
      const { error, data } = await login(params)
      if (error) {
        return Promise.reject(error)
      }
      if (!data || !data.token) {
        return Promise.reject({ type: 'backend', code: 'NO_TOKEN', msg: 'Login failed: no token received' })
      }
      this.token = data.token
      localStg.set('token', data.token)
      this.setUserInfo(data.user)
      return {}
    },
    /** 登录成功之后, 获取权限路由 */
    async afterLogin() {
      const { error, data } = await rbacAdminGroup()
      if (error) {
        return Promise.reject(error)
      }
      const { menus, permission } = data
      this.perms = permission

      return { menus, permission }
    },
    /** 保存用户数据 */
    setUserInfo(info: ApiAccount.Info) {
      this.userInfo = info ?? {}
      localStg.set('userInfo', info)
    }
  }
})
