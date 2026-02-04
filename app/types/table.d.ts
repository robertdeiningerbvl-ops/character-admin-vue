import type { TableColumn } from '@nuxt/ui'

type ColumnType<T> = TableColumn<T>

export type FormSchema = {
  /** 字段名 */
  field?: string
  // Label name
  label?: string
  /** 搜索表单项排序 */
  order?: number
  /** 表单项对应的组件，eg: Select */
  component?: 'Select' | 'DateInput'
  /** 表单组件属性 */
  componentProps?: {
    options?: any[]
  }
  /** 默认值 */
  defaultValue?: any
}

export type DataTableColumn<T = Common.Recordable> = ColumnType<T> & {
  accessorKey?: keyof T
  /** 指定搜索的字段 */
  searchField?: string
  /** 在 Table 中不展示此列 */
  hideInTable?: boolean | ((params: any) => boolean)
  /** 在查询表单中展示此项 */
  searchPlaceholder?: string
  /** 传递给搜索表单 Form.Item 的配置,可以配置 rules */
  formItemProps?: Partial<FormSchema>
}
