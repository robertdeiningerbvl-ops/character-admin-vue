import type { RouteRecordRaw } from 'vue-router'
import icons from './icons'

/**
 * 将API路由转换成权限路由
 * @param routes - API路由
 */
export function transformAPIRouteToAuthRoutes(
  routes: ApiRoute.Route[],
  parentRoute: ApiRoute.Route | null = null,
  lastNamePath: string[] = []
): any[] {
  const parentId = parentRoute?.id === undefined ? 0 : parentRoute?.id
  return routes
    .filter(item => item.ty !== 2 && item.pid === parentId)
    .map((item) => {
      const { router, name, sort, keepalive } = item
      let fullPath = ''
      const pathPrefix = lastNamePath.slice(-1)[0] || ''
      if (isUrl(router)) {
        fullPath = router
      } else {
        fullPath = router.startsWith('/') ? router : `/${router}`
        fullPath = router.startsWith(pathPrefix) ? fullPath : pathPrefix + fullPath
        fullPath = [...new Set(uniqueSlash(fullPath).split('/'))].join('/')
      }

      let realRoutePath: any = router
      if (parentRoute) {
        if (!isUrl(parentRoute.router) && !isUrl(router)) {
          realRoutePath = router
        }
      }

      const routeName = (realRoutePath.startsWith('/') ? realRoutePath.slice(1) : realRoutePath)
        .split('/:')[0]
        .split('/')
        .join('_') as any
      // 路由数据
      const route: Partial<any> = {
        name: routeName,
        path: realRoutePath as any,
        component: 'self',
        meta: {
          requiresAuth: true,
          order: sort,
          title: name,
          permissions: [],
          icon: item.icon || (routeName === '' ? icons['home'] : icons[routeName]) || icons.empty,
          hide: item.is_show !== 1,
          keepAlive: keepalive === 1
        }
      }
      if (item.ty === 0) {
        // 如果是目录
        const children = transformAPIRouteToAuthRoutes(routes, item, lastNamePath.concat(fullPath))
        if (children?.length) {
          route.children = children
          if (parentId) {
            route.component = 'multi'
          } else {
            route.component = 'basic'
          }
        }
        return route
      } else if (item.ty === 1) {
        // 全部api出来的权限进行过滤对应模块下的权限
        const perms = routes.filter(n => n.pid === item.id).flatMap(n => n.perms?.split(','))
        if (route.meta && perms) {
          // 设置当前页面所拥有的权限
          route.meta.permissions = perms
        }

        return route
      }
      return undefined
    })
    .filter((item): item is any => Boolean(item))
}

/**
 * 将权限路由转换成vue路由
 * @param routes - 权限路由
 * @description 所有多级路由都会被转换成二级路由
 */
export function transformAuthRouteToVueRoutes(routes: any[]) {
  return routes.map(route => transformAuthRouteToVueRoute(route)).flat(1)
}

/**
 * 将单个权限路由转换成vue路由
 * @param item - 单个权限路由
 */
export function transformAuthRouteToVueRoute(item: any) {
  const resultRoute: RouteRecordRaw[] = []

  const itemRoute = { ...item } as RouteRecordRaw

  // 动态path
  if (hasDynamicPath(item)) {
    Object.assign(itemRoute, { path: item.meta.dynamicPath })
  }

  // 注意：单独路由没有children
  if (isSingleRoute(item)) {
    if (hasChildren(item)) {
      window.console.error('单独路由不应该有子路由: ', item)
    }
  }

  // 子路由
  if (hasChildren(item)) {
    const children = (item.children as any[]).map(child => transformAuthRouteToVueRoute(child)).flat()

    // 找出第一个不为多级路由中间级的子路由路径作为重定向路径
    const redirectPath = (children.find(v => !v.meta?.multi)?.path || '/') as string

    if (redirectPath === '/') {
      window.console.error('该多级路由没有有效的子路径', item)
    }

    if (item.component === 'multi') {
      // 多级路由，将子路由提取出来变成同级
      resultRoute.push(...children)
      delete itemRoute.children
    } else {
      itemRoute.children = children
    }
    itemRoute.redirect = redirectPath
  }

  resultRoute.push(itemRoute)

  return resultRoute
}

/**
 * 是否有动态路由path
 * @param item - 权限路由
 */
function hasDynamicPath(item: any) {
  return Boolean(item.meta.dynamicPath)
}

/**
 * 是否有子路由
 * @param item - 权限路由
 */
function hasChildren(item: any) {
  return Boolean(item.children && item.children.length)
}

/**
 * 是否是单层级路由
 * @param item - 权限路由
 */
function isSingleRoute(item: any) {
  return Boolean(item.meta.singleLayout)
}
