<script setup lang="ts">
const nuxtApp = useNuxtApp()

const isLoading = ref(true)

const unsubscribe = nuxtApp.hook('page:finish', () => {
  unsubscribe()
  isLoading.value = false
})
</script>

<template>
  <div v-if="isLoading" class="fixed top-0 left-0 w-screen h-screen bg-white dark:bg-gray-900 flex justify-center items-center z-[9999]">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
</template>
