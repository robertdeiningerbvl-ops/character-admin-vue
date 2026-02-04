<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() =>
  colorMode.value === 'dark' ? '#111827' : 'white'
)

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png',
      media: '(prefers-color-scheme: light)'
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon-dark.png',
      media: '(prefers-color-scheme: dark)'
    }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const description = `角色卡后台`
useSeoMeta({
  titleTemplate: '角色卡总后台',
  description,
  ogDescription: description,
  ogImage: '/img/social-card.webp',
  twitterImage: '/img/social-card.webp',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="#0f172b" />

    <SplashScreen />

    <NuxtLayout>
      <NuxtPage :keepalive="{ exclude: ['login'] }" />
    </NuxtLayout>
  </UApp>
</template>
