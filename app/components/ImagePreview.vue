<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  width?: string
  height?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '图片',
  width: 'w-16',
  height: 'h-16',
  class: ''
})

const isOpen = ref(false)

const openPreview = () => {
  isOpen.value = true
}

const closePreview = () => {
  isOpen.value = false
}

const thumbnailClass = computed(() => {
  return [
    props.width,
    props.height,
    'object-cover rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity',
    props.class
  ].filter(Boolean).join(' ')
})
</script>

<template>
  <div>
    <!-- 缩略图 -->
    <img
      :src="src"
      :alt="alt"
      :class="thumbnailClass"
      @click="openPreview"
    >

    <!-- 预览弹窗 -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpen"
          class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center cursor-pointer"
          @click="closePreview"
        >
          <div class="relative max-w-[90vw] max-h-[90vh] p-4">
            <button
              class="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-xl font-bold z-10 text-gray-900 dark:text-white"
              @click.stop="closePreview"
            >
              ✕
            </button>
            <img
              :src="src"
              :alt="alt"
              class="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
              @click.stop
            >
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
