<script setup lang="ts">
import * as z from 'zod'
import type { FormError } from '@nuxt/ui'
import { createMenu, updateMenu } from '@/api'
import { values } from '@/api/router'

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentForm?: any
  menu?: any
  pidOptions?: any
}>(), {
  dialog: false,
  currentForm: () => ({}),
  menu: () => ([]),
  pidOptions: () => ([])
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
  ty: z.number(),
  pid: z.number()
})

const validate = (state: any): FormError[] => {
  const errors: FormError[] = []

  if (!state.name) {
    errors.push({ name: 'name', message: 'Required' })
  }

  if ((state.ty === 0 || state.ty === 1) && !state.router) {
    errors.push({ name: 'router', message: 'Required' })
  }

  if ((state.ty === 1 || state.ty === 2) && (!state.perms || !state.perms.length)) {
    errors.push({ name: 'perms', message: 'Required' })
  }
  return errors
}

const state = reactive({
  loading: false,
  form: {} as any,
  tyOptions: [
    {
      label: '目录',
      value: 0
    },
    {
      label: '菜单',
      value: 1
    },
    {
      label: '权限',
      value: 2
    }
  ] as any,
  permOptions: values.map((item) => {
    return { value: item, label: item }
  }),
  isShowOptions: [
    {
      label: '显示',
      value: 1
    },
    {
      label: '不显示',
      value: 0
    }
  ] as any,
  popoverOpen: false
})

const pidChange = (e: number) => {
  state.form.pid = e
  state.popoverOpen = false
}

const toast = useToast()
const submitKeys = {
  0: ['id', 'ty', 'name', 'pid', 'router', 'icon', 'sort', 'is_show'],
  1: ['id', 'ty', 'name', 'pid', 'router', 'icon', 'perms', 'sort', 'keepalive', 'is_show'],
  2: ['id', 'ty', 'name', 'pid', 'perms']
} as any

async function onSubmit() {
  state.loading = true
  const postForm = JSON.parse(JSON.stringify(state.form, submitKeys[state.form.ty]))
  postForm.perms = postForm.perms?.join(',')
  const { error } = await (postForm.id ? updateMenu : createMenu)(postForm)
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
    :title="currentForm.id ? '编辑菜单' : '新增菜单'"
    :dismissible="false"
    :ui="{
      content: 'sm:max-w-3xl',
      body: 'p-0',
      footer: 'justify-end bg-gray-50 dark:bg-gray-900'
    }"
  >
    <template #body>
      <div class="p-6">
        <UForm
          ref="formRef"
          :schema="schema"
          :state="state.form"
          :validate="validate"
          class="space-y-6"
          @submit="onSubmit"
        >
          <!-- 基本信息卡片 -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-5 space-y-5 border border-blue-100 dark:border-blue-900/50">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-material-symbols-info-outline" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 class="font-semibold text-gray-900 dark:text-white">
                基本信息
              </h4>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="类型" name="ty" required>
                <USelect
                  v-model="state.form.ty"
                  :items="state.tyOptions"
                  placeholder="请选择类型"
                  class="w-full"
                  size="lg"
                >
                  <template #leading>
                    <UIcon name="i-material-symbols-category-outline" class="w-5 h-5 text-gray-400" />
                  </template>
                </USelect>
              </UFormField>

              <UFormField label="名称" name="name" required>
                <UInput
                  v-model.trim="state.form.name"
                  placeholder="请输入菜单名称"
                  class="w-full"
                  size="lg"
                >
                  <template #leading>
                    <UIcon name="i-material-symbols-label-outline" class="w-5 h-5 text-gray-400" />
                  </template>
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
            </div>

            <UFormField label="上级节点" name="pid" required>
              <UPopover v-model:open="state.popoverOpen">
                <div @click="state.popoverOpen = true">
                  <USelect
                    v-model="state.form.pid"
                    :items="pidOptions"
                    placeholder="请选择上级节点"
                    class="w-full pointer-events-none"
                    size="lg"
                  >
                    <template #leading>
                      <UIcon name="i-material-symbols-account-tree" class="w-5 h-5 text-gray-400" />
                    </template>
                  </USelect>
                </div>

                <template #content>
                  <div class="w-[300px] max-h-[300px] overflow-y-auto">
                    <RadioTree :menu="menu" :value="state.form.pid" @change="pidChange" />
                  </div>
                </template>
              </UPopover>
            </UFormField>
          </div>

          <!-- 路由配置卡片 -->
          <div
            v-if="state.form.ty !== 2"
            class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-5 space-y-5 border border-green-100 dark:border-green-900/50"
          >
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-material-symbols-route" class="w-5 h-5 text-green-600 dark:text-green-400" />
              <h4 class="font-semibold text-gray-900 dark:text-white">
                路由配置
              </h4>
            </div>

            <UFormField label="节点路由" name="router" required>
              <UInput
                v-model.trim="state.form.router"
                placeholder="请输入路由路径，如：/system/menu"
                class="w-full"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-link" class="w-5 h-5 text-gray-400" />
                </template>
                <template #trailing>
                  <UButton
                    v-if="state.form.router"
                    color="neutral"
                    variant="link"
                    size="sm"
                    icon="i-lucide-circle-x"
                    @click="state.form.router = ''"
                  />
                </template>
              </UInput>
            </UFormField>
          </div>

          <!-- 权限配置卡片 -->
          <div
            v-if="state.form.ty !== 0"
            class="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-xl p-5 space-y-5 border border-purple-100 dark:border-purple-900/50"
          >
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-material-symbols-shield-lock-outline" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 class="font-semibold text-gray-900 dark:text-white">
                权限配置
              </h4>
            </div>

            <UFormField label="权限标识" name="perms" required>
              <div class="relative">
                <USelect
                  v-model="state.form.perms"
                  multiple
                  :items="state.permOptions"
                  placeholder="请选择权限标识"
                  class="w-full"
                  size="lg"
                >
                  <template #leading>
                    <UIcon name="i-material-symbols-key-outline" class="w-5 h-5 text-gray-400" />
                  </template>
                </USelect>
                <UButton
                  v-if="state.form.perms && state.form.perms.length"
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-circle-x"
                  class="absolute top-1/2 right-3 -translate-y-1/2"
                  @click="state.form.perms = []"
                />
              </div>
            </UFormField>
          </div>

          <!-- 显示设置卡片 -->
          <div
            v-if="state.form.ty !== 2"
            class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-5 space-y-5 border border-amber-100 dark:border-amber-900/50"
          >
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-material-symbols-display-settings-outline" class="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h4 class="font-semibold text-gray-900 dark:text-white">
                显示设置
              </h4>
            </div>

            <UFormField label="菜单图标" name="icon" description="选择菜单图标">
              <IconPicker v-model="state.form.icon" />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="排序" name="sort">
                <UInputNumber
                  v-model="state.form.sort"
                  :min="0"
                  placeholder="数字越小越靠前"
                  class="w-full"
                  size="lg"
                />
              </UFormField>

              <UFormField label="是否显示" name="is_show">
                <USelect
                  v-model="state.form.is_show"
                  :items="state.isShowOptions"
                  placeholder="请选择"
                  class="w-full"
                  size="lg"
                >
                  <template #leading>
                    <UIcon name="i-material-symbols-visibility-outline" class="w-5 h-5 text-gray-400" />
                  </template>
                </USelect>
              </UFormField>
            </div>
          </div>
        </UForm>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <UIcon name="i-material-symbols-info-outline" class="w-4 h-4" />
          <span>{{ currentForm.id ? '修改后将更新菜单配置' : '确认后将创建新的菜单项' }}</span>
        </div>
        <div class="flex gap-3">
          <UButton
            label="取消"
            color="neutral"
            variant="outline"
            size="lg"
            @click="closeModal"
          >
            <template #leading>
              <UIcon name="i-material-symbols-close" />
            </template>
          </UButton>
          <UButton
            :loading="state.loading"
            label="确认保存"
            variant="solid"
            size="lg"
            @click="formRef?.submit()"
          >
            <template #leading>
              <UIcon name="i-material-symbols-check" />
            </template>
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
