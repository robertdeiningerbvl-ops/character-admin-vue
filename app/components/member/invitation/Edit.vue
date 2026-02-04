<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { addMemberInvitationCodeGenerate } from '@/api'

/* ================= Props & Emits ================= */
interface Props {
  dialog?: boolean
  currentForm?: any
}

const props = withDefaults(defineProps<Props>(), {
  dialog: false,
  currentForm: () => ({})
})

const emit = defineEmits(['update:dialog', 'refresh'])

/* ================= Dialog Control ================= */
const drawerVisible = computed({
  get: () => props.dialog,
  set: visible => emit('update:dialog', visible)
})

const closeModal = () => {
  drawerVisible.value = false
}

/* ================= Form ================= */
const formRef = useTemplateRef('formRef')
const toast = useToast()

const schema = z.object({
  limit: z.number().min(0),
  num: z.number().min(0),
  coins: z.number().min(0),
  tm: z.string().nonempty()
})

const state = reactive({
  loading: false,
  form: {} as any
})

/* ================= Methods ================= */
async function onSubmit() {
  state.loading = true
  try {
    const postForm = cloneDeep(state.form)
    const { error } = await addMemberInvitationCodeGenerate(postForm)
    if (!error) {
      toast.add({ title: '操作成功', color: 'success' })
      closeModal()
      emit('refresh')
    }
  } finally {
    state.loading = false
  }
}

/* ================= Watchers ================= */
watch(
  () => props.dialog,
  (newValue) => {
    if (newValue) {
      state.form = cloneDeep(props.currentForm)
      state.loading = false
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    :title="currentForm.id ? '修改' : '新增'"
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
        <UFormField label="生成数量" name="num" required>
          <UInput
            v-model.trim="state.form.num"
            placeholder="请输入生成数量"
            type="number"
            class="w-full"
          />
        </UFormField>

        <UFormField label="限领次数" name="limit" required>
          <UInput
            v-model.trim="state.form.limit"
            placeholder="请输入限领次数"
            type="number"
            class="w-full"
          />
        </UFormField>

        <UFormField label="能量" name="coins" required>
          <UInput
            v-model.trim="state.form.coins"
            placeholder="请输入能量值"
            type="number"
            class="w-full"
          />
        </UFormField>

        <UFormField label="过期时间" name="tm" required>
          <UInput
            v-model.trim="state.form.tm"
            placeholder="请选择过期时间"
            type="datetime-local"
            class="w-full"
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
        color="primary"
        variant="solid"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
