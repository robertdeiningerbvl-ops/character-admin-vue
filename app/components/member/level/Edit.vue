<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { uploadFile, updateMemberLevel } from '@/api'

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
const fileRef = ref<HTMLInputElement>()

const schema = z.object({
  name: z.string().nonempty(),
  remark: z.string().nonempty(),
  battery: z.number().min(0),
  divided: z.number().min(0),
  state: z.number().min(0),
  logo: z.string()
})

const stateOptions = [
  {
    label: '启用',
    value: 2
  },
  {
    label: '待审核',
    value: 1
  },
  {
    label: '已删除',
    value: 4
  }
]
const dividedOptions = [
  {
    label: '是',
    value: 1
  },
  {
    label: '否',
    value: 0
  }
]

const state = reactive({
  loading: false,
  avatarLoading: false,
  form: {} as any
})

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) {
    return
  }

  if (imageFormat(input.files[0])) {
    state.avatarLoading = true
    const { data } = await uploadFile({
      image: input.files[0]
    })
    if (data) {
      state.form.logo = data.uri
    }
    state.avatarLoading = false
  }
}

function onFileClick() {
  fileRef.value?.click()
}

const toast = useToast()
async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)
  // const { error } = await (postForm.id ? updateMemberLevel : addMemberLevel)(postForm)
  const { error } = await updateMemberLevel(postForm)
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
        <UFormField label="等级名称" name="name" required>
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
        <UFormField label="所需电量" name="battery" required>
          <UInput
            v-model.trim="state.form.battery"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
            type="number"
            min="0"
          >
            <template #trailing>
              <UButton
                v-if="state.form.battery"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                @click="state.form.battery = ''"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField label="参与分成?" name="divided" required>
          <USelect
            v-model="state.form.divided"
            :items="dividedOptions"
            placeholder="请选择"
            class="w-full"
          />
        </UFormField>
        <UFormField label="备注" name="remark">
          <UInput
            v-model.trim="state.form.remark"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                v-if="state.form.remark"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                @click="state.form.remark = ''"
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
        <UFormField
          label="icon"
          name="logo"
          description="JPG, JPEG or PNG. 1MB Max."
          class="flex max-sm:flex-col justify-between sm:items-center gap-4"
        >
          <div class="flex flex-wrap items-center gap-3">
            <UAvatar
              :src="state.form.logo"
              :alt="state.form.name"
              size="xl"
            />
            <UButton
              :loading="state.avatarLoading"
              label="上传"
              color="neutral"
              @click="onFileClick"
            />
            <input
              ref="fileRef"
              type="file"
              class="hidden"
              accept=".jpg, .jpeg, .png"
              @change="onFileChange"
            >
          </div>
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
