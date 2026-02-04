/**
 * 根据用户权限过滤路由
 * @param routes - 权限路由
 * @param permission - 权限
 */
export function filterAuthRoutesByUserPermission(routes: string[], permission: string[]) {
  return routes.map(route => filterAuthRouteByUserPermission(route, permission)).flat(1)
}

/**
 * 根据用户权限过滤单个路由
 * @param route - 单个权限路由
 * @param permission - 权限
 */
function filterAuthRouteByUserPermission(route: any, permission: string[]): string[] {
  const filterRoute = { ...route }
  const hasPermission
    = !route.meta.permissions
      || route.meta.permissions.length === 0
      || route.meta.permissions.some((item: any) => permission.includes(item))

  if (filterRoute.children) {
    const filterChildren = filterRoute.children.map((item: any) => filterAuthRouteByUserPermission(item, permission)).flat(1)
    Object.assign(filterRoute, { children: filterChildren })
  }
  return hasPermission ? [filterRoute] : []
}
