import { useAuthStore } from '@/store'

export function usePermission() {
  const auth = useAuthStore()

  function hasPermission(permission: string | string[]) {
    let has = false
    if (isArray(permission)) {
      has = permission.some(item => auth.perms.includes(item))
    }
    if (isString(permission)) {
      has = auth.perms.includes(permission)
    }
    return has
  }

  return {
    hasPermission
  }
}
