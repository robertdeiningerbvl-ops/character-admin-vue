declare namespace ApiBase {
  /** 列表数据 */
  interface List<T = any> {
    count?: number
    page?: number
    pagesize?: number
    list: T
  }

  /** 表格分页请求参数 */
  type PageParams<T = any> = {
    pagesize?: number
    page?: number
  } & {
    [P in keyof T]?: T[P];
  }
}

declare namespace ApiAuth {
  /** 配置信息 */
  type Config = {
    name: string
  }

  /** 登录参数 */
  interface LoginParams {
    email: string
    password: string
    ty: number
  }

  /** 登录成功结果 */
  type LoginResult = {
    token: string
    user: ApiAccount.Info
  }
}

declare namespace ApiAccount {
  type PermMenu = {
    menus: ApiRoute.Route[]
    permission: string[]
  }

  type Info = {
    create_at?: string
    update_at?: string
    salt?: string
    id?: number
    group_id?: number
    email?: string
    username?: string
    ip?: string
    state?: number
    avatar?: string
    key?: string
    price?: number
  }

  interface UpdatePasswordParams {
    password: string
    new_password: string
  }

  type AddUserParams = {
    username?: string
    password?: string
    state?: string
    avatar?: string
  }

  type UpdateUserParams = AddUserParams & {
    id?: number
  }
}

declare namespace ApiRoute {
  /** 权限列表 */
  interface Route {
    id: number
    pid: number
    name: string
    router: string
    perms: string
    ty: 0 | 1 | 2
    icon: string
    keepalive: number
    is_show: number
    sort: number
    lang_code: string
  }
}

declare namespace ApiMenu {
  type MenuListItem = {
    id: number
    pid: number
    name: string
    router: string
    perms: string
    ty: number
    icon: string
    keepalive: number
    is_show: number
    sort: number // 排序
    keyPath?: number[]
  }

  type MenuListResult = MenuListItem[]

  type MenuAddParams = {
    ty: number
    pid: number
    name: string
    router: string
    is_show: number
    keepalive: number
    icon: string
    perms: string
    sort: number
  }

  type MenuInfoResult = {
    menu: {
      id: number
      pid: number
      name: string
      router: string
      perms: string
      ty: number
      icon: string
      keepalive: number
      is_show: number
    }
    parentMenu: {
      id: number
      pid: number
      name: string
      router: string
      perms: string
      ty: number
      icon: string
      keepalive: boolean
      is_show: boolean
    }
  }
}
