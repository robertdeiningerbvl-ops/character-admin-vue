<script setup lang="ts">
import * as z from 'zod'
import { updateGroupMenu } from '@/api'

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentForm?: any
  menu?: any
}>(), {
  dialog: false,
  currentForm: () => ({}),
  menu: () => ([])
})

const emit = defineEmits(['update:dialog', 'refresh'])

const drawerVisible = computed({
  get() {
    return props.dialog
  },
  set(visible) {
    emit('update:dialog', visible)
  }
})

const closeModal = () => {
  drawerVisible.value = false
}

const formRef = useTemplateRef('formRef')

const schema = z.object({
  name: z.string().nonempty(),
  group_id: z.string().nonempty()
})

const state = reactive({
  loading: false,
  form: {} as any
})

const getCheckedKeys = (menu: any[], total = []): any => {
  return menu.reduce<number[]>((prev, curr) => {
    if (curr.checked) {
      prev.push(curr.value)
    }
    if (curr.children?.length) {
      getCheckedKeys(curr.children, total)
    }
    return prev
  }, total)
}

const toast = useToast()
async function onSubmit() {
  state.loading = true
  const { error } = await updateGroupMenu({
    ...state.form,
    menus: [...getCheckedKeys(props.menu)].join(',')
  })
  if (!error) {
    toast.add({ title: `操作成功`, color: 'success' })
    emit('refresh')
  }
  state.loading = false
}

watch(
  () => props.dialog,
  (newValue) => {
    if (newValue) {
      state.loading = false
      state.form = props.currentForm
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    title="分配权限"

    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm
        ref="formRef"
        :schema="schema"
        :state="state.form"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <UFormField label="名称" name="name" required>
          <UInput
            v-model.trim="state.form.name"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                v-if="state.form.name"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                @click="state.form.name = ''"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField label="标识" name="group_id" required>
          <UInput
            v-model.trim="state.form.group_id"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                v-if="state.form.group_id"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                @click="state.form.group_id = ''"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField label="分配权限">
          <CheckboxTree :menu="menu" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton
        label="取消"
        color="neutral"
        variant="outline"
        @click="closeModal"
      />
      <UButton
        :loading="state.loading"
        label="确认"
        variant="solid"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
