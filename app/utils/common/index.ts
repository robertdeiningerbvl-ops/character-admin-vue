export * from './validate'
export * from './date'

// 判断是否是URL
export function isUrl(path: string): boolean {
  return /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/.test(
    path
  )
}

/**
 * 将路径中重复的正斜杆替换成单个斜杆隔开的字符串
 * @param path 要处理的路径
 * @returns {string} 将/去重后的结果
 */
export const uniqueSlash = (path: string) => path.replace(/(?<!:)\/{2,}/g, '/')

/**
 * 渲染菜单至树形控件
 * @param {Array} menus 所有菜单
 * @param {Number | null} parentId 父级菜单ID
 * @param {number[]|string[]} keyPath ID路径
 */
export const formatMenu2Tree = (
  menus: ApiMenu.MenuListResult,
  parentId: number | null = null,
  keyPath: (string | number)[] = [],
  level: number = 0
): any[] => {
  const pid = parentId === null ? 0 : parentId
  const childrenLevel = level + 1
  return menus
    .filter(item => item.pid === pid)
    .map((item) => {
      const _keyPath = keyPath.concat(pid || [])
      const arr = formatMenu2Tree(menus, item.id, _keyPath, childrenLevel)
      return Object.assign(item, {
        level,
        keyPath: _keyPath,
        label: item.name,
        key: item.id,
        value: item.id,
        children: arr.length ? arr : null
      })
    })
}

/**
 * 等待
 * @param {number} delay 等待时间
 */
export const sleep = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))

/**
 * 生成随机字符串
 * @param {number} length 字符串长度
 */
export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
