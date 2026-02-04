<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useAuthStore } from '@/store'

defineProps<{
  collapsed?: boolean
}>()

const dialog = useDialog()
const auth = useAuthStore()
const colorMode = useColorMode()

const user = computed(() => {
  return {
    name: auth.userInfo.username || auth.userInfo.email,
    avatar: {
      src: auth.userInfo.avatar,
      alt: auth.userInfo.username || auth.userInfo.email
    }
  }
})

const items = computed<DropdownMenuItem[][]>(() => ([[{
  label: '模式',
  icon: 'i-lucide-sun-moon',
  children: [{
    label: '浅色',
    icon: 'i-lucide-sun',
    type: 'checkbox',
    checked: colorMode.value === 'light',
    onSelect(e: Event) {
      e.preventDefault()

      colorMode.preference = 'light'
    }
  }, {
    label: '深色',
    icon: 'i-lucide-moon',
    type: 'checkbox',
    checked: colorMode.value === 'dark',
    onUpdateChecked(checked: boolean) {
      if (checked) {
        colorMode.preference = 'dark'
      }
    },
    onSelect(e: Event) {
      e.preventDefault()
    }
  }]
}], [{
  label: '退出登录',
  icon: 'i-lucide-log-out',
  onSelect() {
    dialog.open({
      color: 'error',
      title: '退出登录',
      description: '您确定要退出吗？',
      onPositiveClick() {
        auth.resetAuthStore()
      }
    })
  }
}]]))
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        trailingIcon: collapsed ? undefined : 'line-md:chevron-down'
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-(--ui-bg-elevated) text-left"
      :ui="{
        base: collapsed ? 'hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent' : '',
        trailingIcon: 'text-(--ui-text-dimmed)'
      }"
    >
      <UUser
        v-bind="{
          name: collapsed ? undefined : user.name,
          avatar: {
            src: user.avatar.src,
            alt: user.avatar.alt
          },
          size: 'xl'
        }"
        :ui="{ root: collapsed ? 'gap-0' : '' }"
      />
    </UButton>
  </UDropdownMenu>
</template>
