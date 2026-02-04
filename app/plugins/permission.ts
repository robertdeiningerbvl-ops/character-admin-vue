import { usePermission } from '@/composables/permission'

export default defineNuxtPlugin((nuxtApp) => {
  const { hasPermission } = usePermission()

  function updateElVisible(el: HTMLElement, permission: string | string[]) {
    if (!permission) {
      throw new Error(`need roles: like v-permission="'admin'", v-permission="['admin', 'test]"`)
    }
    if (!hasPermission(permission)) {
      el.parentElement?.removeChild(el)
    }
  }

  nuxtApp.vueApp.directive('permission', {
    mounted(el, binding) {
      updateElVisible(el, binding.value)
    },
    beforeUpdate(el, binding) {
      updateElVisible(el, binding.value)
    }
  })
})
