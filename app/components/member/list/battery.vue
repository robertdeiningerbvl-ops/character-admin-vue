<script setup lang="ts">
import * as z from 'zod'
import { updateBatteryMember } from '@/api'

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentForm?: any
  factoryOwnerOptions?: any
}>(), {
  dialog: false,
  currentForm: () => ({})
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
  id: z.number(),
  battery: z.number()
})

const state = reactive({
  loading: false,
  form: {
    id: undefined,
    battery: undefined
  }
})

const toast = useToast()
async function onSubmit() {
  state.loading = true

  const postForm = {
    uid: state.form.id,
    battery: Number(state.form.battery)
  }

  const { error } = await updateBatteryMember(postForm)

  if (!error) {
    toast.add({ title: '操作成功', color: 'success' })
    emit('refresh')
  }

  state.loading = false
}

watch(
  () => props.dialog,
  (val) => {
    if (val) {
      state.loading = false
      state.form = {
        id: props.currentForm.id,
        battery: undefined
      }
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    :title="'充值'"
    :dismissible="false"
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
        <UFormField label="电量" name="battery" required>
          <UInput
            v-model.trim="state.form.battery"
            placeholder="请输入"
            type="number"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          />
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
