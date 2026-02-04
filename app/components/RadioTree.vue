<script setup lang="ts">
withDefaults(defineProps<{
  menu?: any
  value?: number
}>(), {
  menu: [] as any,
  value: 0
})

const emit = defineEmits(['change'])

const handleChange = (item: any, e: boolean | 'indeterminate') => {
  if (e) {
    emit('change', item.value)
  }
}
</script>

<template>
  <UNavigationMenu
    :items="menu"
    orientation="vertical"
    :ui="{ item: 'mb-1', linkLeadingIcon: 'text-(--ui-primary)', linkLabel: 'text-(--ui-primary)' }"
  >
    <template #item-leading="{ item }:any">
      <UCheckbox :default-value="item.value === value" @update:model-value="(e: boolean | 'indeterminate') => handleChange(item, e)" @click.stop />
    </template>
  </UNavigationMenu>
</template>
