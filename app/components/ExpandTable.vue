<script setup lang="ts">
withDefaults(defineProps<{
  data?: any
  columns?: any
  scrollX?: string
}>(), {
  data: [] as any,
  columns: [] as any,
  scrollX: ''
})
</script>

<template>
  <UTable
    class="shrink-0"
    :data="data"
    :columns="columns"
    :ui="{
      base: `table-fixed border-separate border-spacing-0 w-full ${scrollX}`,
      thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
      tbody: '[&>tr]:last:[&>td]:border-b-0',
      th: 'py-1 first:rounded-l-[calc(var(--ui-radius)*2)] last:rounded-r-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r',
      td: 'border-b border-(--ui-border) whitespace-normal',
      tr: 'data-[expanded=true]:bg-(--ui-bg-elevated)/50'
    }"
  >
    <template #expanded="{ row }:any">
      <ExpandTable v-if="row.original.children" :data="row.original.children" :columns="columns" />
    </template>
  </UTable>
</template>
