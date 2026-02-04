<script setup lang="ts">
const props = withDefaults(defineProps<{
  menu?: any
}>(), {
  menu: [] as any
})

const resetMenu = (routes: any[], parentRoute: any = null): any => {
  let checkedNum = 0
  routes.forEach((route) => {
    let menuChildren: any | undefined
    if (route.children && route.children.length > 0) {
      menuChildren = resetMenu(route.children, route)
    }

    route.checked = menuChildren ? menuChildren.checked : route.checked
    if (route.checked === true) {
      checkedNum++
    }
  })

  let _checked: boolean | 'indeterminate' = 'indeterminate'
  if (parentRoute) {
    if (checkedNum === routes.length) {
      _checked = true
    } else if (checkedNum === 0) {
      _checked = false
    }
  }

  return {
    checked: _checked,
    children: routes
  }
}

const rfSetStatus = (item: any, status: boolean) => {
  if (item) {
    item.forEach((subItem: any) => {
      subItem.checked = status
      rfSetStatus(subItem.children, status)
    })
  }
}

const handleChange = (item: any, e: boolean | 'indeterminate') => {
  item.checked = e
  if (e) {
    rfSetStatus(item.children, true)
  } else {
    rfSetStatus(item.children, false)
  }
  resetMenu(props.menu)
}
</script>

<template>
  <UNavigationMenu
    :items="menu"
    orientation="vertical"
    :ui="{ item: 'mb-1', linkLeadingIcon: 'text-(--ui-primary)', linkLabel: 'text-(--ui-primary)' }"
  >
    <template #item-leading="{ item }:any">
      <UCheckbox :model-value="item.checked" @update:model-value="(e: boolean | 'indeterminate') => handleChange(item, e)" @click.stop />
    </template>
  </UNavigationMenu>
</template>
