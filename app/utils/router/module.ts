/**
 * 权限路由排序
 * @param routes - 权限路由
 */
export function sortRoutes(routes: any[]) {
  return routes
    .sort(
      (next, pre) => (next.meta?.order ? Number(next.meta.order) : 0) - (pre.meta?.order ? Number(pre.meta.order) : 0)
    )
    .map((i) => {
      if (i.children) sortRoutes(i.children)
      return i
    })
}
