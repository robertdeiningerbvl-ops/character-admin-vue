/**
 * 将权限路由转换成菜单
 * @param routes - 路由
 */
export function transformAuthRouteToMenu(routes: any[]): any[] {
  const globalMenu: any[] = []
  routes.forEach((route) => {
    const { name, path, meta } = route
    const routeName = name as string

    if (hideInMenu(route)) {
      return
    }

    // 递归处理子菜单
    let menuChildren: any[] | undefined
    if (route.children && route.children.length > 0) {
      menuChildren = transformAuthRouteToMenu(route.children)
      if (menuChildren.length === 0) {
        menuChildren = undefined
      }
    }

    const menuItem: any = {
      key: routeName,
      label: meta.title,
      icon: meta.icon,
      i18nTitle: meta.i18nTitle
    }

    // 如果有子菜单，添加 children；否则添加路由跳转
    if (menuChildren && menuChildren.length > 0) {
      menuItem.children = menuChildren
    } else {
      menuItem.to = path
    }

    globalMenu.push(menuItem)
  })

  return globalMenu
}

/** 路由不转换菜单 */
function hideInMenu(route: any) {
  return Boolean(route.meta.hide)
}
