<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  modelValue?: string
  placeholder?: string
  minHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入内容',
  minHeight: '200px'
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  extensions: [StarterKit],
  content: props.modelValue,
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
  }
})

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value && newValue !== editor.value.getHTML()) {
      editor.value.commands.setContent(newValue || '', {
        parseOptions: {},
        emitUpdate: false
      })
    }
  }
)
</script>

<template>
  <div v-if="editor" class="rich-text-editor rounded-lg border border-(--ui-border) overflow-hidden">
    <div class="toolbar border-b border-(--ui-border) bg-(--ui-bg-elevated) px-3 py-2 flex gap-1 flex-wrap">
      <button
        v-for="btn in [
          { action: () => editor!.chain().focus().toggleBold().run(), active: editor.isActive('bold'), label: 'B', cls: 'font-bold' },
          { action: () => editor!.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), label: 'I', cls: 'italic' },
          { action: () => editor!.chain().focus().toggleStrike().run(), active: editor.isActive('strike'), label: 'S', cls: 'line-through' }
        ]"
        :key="btn.label"
        type="button"
        class="toolbar-btn"
        :class="{ active: btn.active }"
        @click="btn.action"
      >
        <span :class="btn.cls">{{ btn.label }}</span>
      </button>

      <div class="toolbar-divider" />

      <button
        v-for="level in [1, 2, 3]"
        :key="level"
        type="button"
        class="toolbar-btn"
        :class="{ active: editor.isActive('heading', { level }) }"
        @click="editor!.chain().focus().toggleHeading({ level: level as any }).run()"
      >
        H{{ level }}
      </button>

      <div class="toolbar-divider" />

      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: editor.isActive('bulletList') }"
        @click="editor!.chain().focus().toggleBulletList().run()"
      >
        &bull; 列表
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: editor.isActive('orderedList') }"
        @click="editor!.chain().focus().toggleOrderedList().run()"
      >
        1. 列表
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: editor.isActive('blockquote') }"
        @click="editor!.chain().focus().toggleBlockquote().run()"
      >
        引用
      </button>

      <div class="toolbar-divider" />

      <button
        type="button"
        class="toolbar-btn"
        @click="editor!.chain().focus().setHorizontalRule().run()"
      >
        分割线
      </button>
    </div>
    <div class="editor-content p-4" :style="{ minHeight: minHeight }">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<style scoped>
.toolbar-btn {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;
  color: var(--ui-text-muted);
}

.toolbar-btn:hover {
  background-color: rgba(var(--ui-bg-elevated), 0.8);
}

.toolbar-btn.active {
  background-color: var(--ui-primary);
  color: var(--ui-bg);
}

.toolbar-divider {
  width: 1px;
  background-color: var(--ui-border);
  margin: 0 0.25rem;
}

.editor-content :deep(.ProseMirror) {
  outline: none;
}

.editor-content :deep(.ProseMirror) h1 {
  font-size: 2em;
  font-weight: bold;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
}

.editor-content :deep(.ProseMirror) h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
}

.editor-content :deep(.ProseMirror) h3 {
  font-size: 1.17em;
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 1em;
}

.editor-content :deep(.ProseMirror) p {
  margin: 1em 0;
}

.editor-content :deep(.ProseMirror) ul,
.editor-content :deep(.ProseMirror) ol {
  padding-left: 2em;
  margin: 1em 0;
}

.editor-content :deep(.ProseMirror) ul {
  list-style-type: disc;
}

.editor-content :deep(.ProseMirror) ol {
  list-style-type: decimal;
}

.editor-content :deep(.ProseMirror) li {
  margin: 0.5em 0;
}

.editor-content :deep(.ProseMirror) blockquote {
  border-left: 3px solid var(--ui-border);
  padding-left: 1em;
  margin-left: 0;
  font-style: italic;
  color: var(--ui-text-muted);
}

.editor-content :deep(.ProseMirror) hr {
  border: none;
  border-top: 2px solid var(--ui-border);
  margin: 2em 0;
}

.editor-content :deep(.ProseMirror) strong {
  font-weight: bold;
}

.editor-content :deep(.ProseMirror) em {
  font-style: italic;
}

.editor-content :deep(.ProseMirror) s {
  text-decoration: line-through;
}
</style>
