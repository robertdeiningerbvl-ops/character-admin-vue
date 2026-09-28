<script setup lang="ts">
definePageMeta({ layout: 'app' })

// VIP 套餐已迁移为独立一级 section，旧菜单路径保留跳转
await navigateTo('/vip', { replace: true })
</script>

<template>
  <div />
</template>
