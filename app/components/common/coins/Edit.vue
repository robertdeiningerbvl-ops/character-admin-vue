<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { updateCommonCoins, addCommonCoins } from '@/api'

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentForm?: any
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
  title: z.string().nonempty(),
  content: z.string().nonempty(),
  coins: z.number().min(0),
  amount: z.number().min(0),
  state: z.number().min(0)
})

const stateOptions = [
  {
    label: '启用',
    value: 2
  },
  {
    label: '已删除',
    value: 1
  }
]

const state = reactive({
  loading: false,
  avatarLoading: false,
  form: {} as any
})

const toast = useToast()
async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)
  console.log('postForm', postForm)
  const { error } = await (postForm.id ? updateCommonCoins : addCommonCoins)(postForm)
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
        <UFormField label="标题" name="title" required>
          <UInput
            v-model.trim="state.form.title"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                v-if="state.form.title"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                @click="state.form.title = ''"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField label="能量数" name="coins" required>
          <UInput
            v-model.trim="state.form.coins"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
            type="number"
            min="0"
          >
            <template #trailing>
              <UButton
                v-if="state.form.coins"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                @click="state.form.coins = ''"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField label="原价" name="amount" required>
          <UInput
            v-model.trim="state.form.amount"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
            type="number"
            min="0"
          >
            <template #trailing>
              <UButton
                v-if="state.form.amount"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                @click="state.form.amount = ''"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField label="排序" name="sort">
          <UInput
            v-model.trim="state.form.sort"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                v-if="state.form.sort"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                @click="state.form.sort = ''"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField label="描述" name="content">
          <UInput
            v-model.trim="state.form.content"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                v-if="state.form.content"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                @click="state.form.content = ''"
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField label="状态" name="state" required>
          <USelect
            v-model="state.form.state"
            :items="stateOptions"
            placeholder="请选择"
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
        variant="solid"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
