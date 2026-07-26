# 代理渠道属性统计页面设计文档

## 1. 概述

### 1.1 目标
创建一个新的代理渠道属性统计页面，用于展示和分析代理渠道的消耗金额和利润数据。页面支持汇总统计和每日明细两种数据维度的查看，并提供图表可视化功能。

### 1.2 背景
后台管理系统需要对接两个新的业务接口：
- `/admin/agent-channel-attrs`：代理渠道属性列表（汇总统计）
- `/admin/agent-channel-attrs-day`：代理渠道每日属性列表（每日明细）

两个接口返回的数据结构一致，但维度不同。需要设计一个页面将两种维度的数据融合展示。

### 1.3 关键需求
- 创建独立的新页面
- 使用标签页切换汇总统计和每日明细两种视图
- 支持筛选条件：代理编码、渠道ID、日期范围
- 使用表格形式展示数据
- 支持分页功能
- 提供图表可视化功能，展示时间序列趋势

## 2. 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Vant UI
- **样式**: TailwindCSS v4
- **HTTP请求**: Alova
- **图表库**: Apache ECharts 5.x + echarts-for-vue
- **API规范**: 遵循项目现有的API调用模式

## 3. 架构设计

### 3.1 文件组织结构

```
app/
├── pages/
│   └── agent/
│       └── channel-attrs.vue          # 主页面组件
├── components/
│   └── agent/
│       └── channel-attrs/
│           ├── columns.tsx             # 表格列定义
│           ├── SummaryTab.vue          # 汇总统计标签页
│           ├── DailyTab.vue            # 每日明细标签页
│           ├── ChartModal.vue          # 图表弹窗组件
│           └── FilterForm.vue          # 筛选表单组件
└── api/
    └── modules/
        └── agent.ts                    # Agent相关API接口
```

### 3.2 页面布局

```
┌─────────────────────────────────────────┐
│  页面标题：代理渠道属性统计              │
├─────────────────────────────────────────┤
│  筛选区域                                │
│  [代理编码] [渠道ID] [日期范围] [查询]  │
├─────────────────────────────────────────┤
│  标签页切换                              │
│  [汇总统计] [每日明细]                  │
├─────────────────────────────────────────┤
│  数据表格                                │
│  ID | 代理编码 | 渠道 | 消耗 | 利润 | 图表│
│  ...                              [📊]  │
├─────────────────────────────────────────┤
│  分页器                                  │
│  [上一页] 1 2 3 ... [下一页]            │
└─────────────────────────────────────────┘
```

## 4. 组件设计

### 4.1 主页面组件 (channel-attrs.vue)

**职责**：
- 管理整体页面状态
- 协调子组件交互
- 处理标签页切换逻辑

**核心状态**：
```typescript
const state = reactive({
  // 当前激活的标签页
  activeTab: 'summary', // 'summary' | 'daily'
  
  // 共享的筛选参数
  filters: {
    agent_code: '',
    channel_id: '',
    start_time: '',
    end_time: ''
  },
  
  // 汇总统计数据
  summaryData: {
    list: [],
    count: 0,
    loading: false,
    pagination: { page: 1, pagesize: 10 }
  },
  
  // 每日明细数据
  dailyData: {
    list: [],
    count: 0,
    loading: false,
    pagination: { page: 1, pagesize: 10 }
  },
  
  // 图表弹窗
  chartModal: {
    open: false,
    currentRow: null,
    loading: false,
    data: []
  }
})
```

### 4.2 表格列设计 (columns.tsx)

**汇总统计标签页的列配置**：

| 列名 | 字段 | 数据类型 | 说明 | 宽度 |
|------|------|---------|------|------|
| ID | id | number | 记录唯一标识 | 80px |
| 代理编码 | agent_code | string | 代理的唯一编码 | 150px |
| 渠道ID | channel_id | number | 渠道唯一标识 | 120px |
| 消耗金额 | consume_amount | number | 格式化显示，带货币符号¥ | 150px |
| 利润 | profit | number | 格式化显示，带货币符号¥ | 150px |
| 创建时间 | created_at | string | 格式化为 YYYY-MM-DD HH:mm:ss | 180px |
| 操作 | - | - | 查看图表按钮 | 100px |

**每日明细标签页的列配置**：

| 列名 | 字段 | 数据类型 | 说明 | 宽度 |
|------|------|---------|------|------|
| ID | id | number | 记录唯一标识 | 80px |
| 代理编码 | agent_code | string | 代理的唯一编码 | 150px |
| 渠道ID | channel_id | number | 渠道唯一标识 | 120px |
| 统计日期 | day_time | string | 格式化为 YYYY-MM-DD | 150px |
| 消耗金额 | consume_amount | number | 格式化显示，带货币符号¥ | 150px |
| 利润 | profit | number | 格式化显示，带货币符号¥ | 150px |
| 操作 | - | - | 查看图表按钮 | 100px |

**关键差异**：
- 每日明细标签页多了"统计日期"列（day_time）
- 每日明细标签页不显示 created_at 列

### 4.3 筛选表单组件 (FilterForm.vue)

**布局结构**：
```
┌─────────────────────────────────────────┐
│  [代理编码输入框]  [渠道ID输入框]       │
│  [开始日期]  -  [结束日期]              │
│              [查询] [重置]              │
└─────────────────────────────────────────┘
```

**字段配置**：

1. **代理编码** (agent_code)
   - 组件：文本输入框
   - placeholder: "请输入代理编码"
   - 支持模糊查询

2. **渠道ID** (channel_id)
   - 组件：数字输入框
   - placeholder: "请输入渠道ID"
   - 类型限制：数字

3. **日期范围** (start_time, end_time)
   - 组件：日期范围选择器
   - 格式：YYYY-MM-DD
   - 支持快捷选择（今天、近7天、近30天）

4. **操作按钮**
   - 查询按钮：触发数据加载，调用当前标签页的API接口
   - 重置按钮：清空所有筛选条件，重置为初始状态并重新查询

### 4.4 图表弹窗组件 (ChartModal.vue)

**触发方式**：
- 每行数据的"操作"列有一个"📊 查看图表"按钮
- 点击后弹出模态框展示图表

**弹窗布局**：
```
┌─────────────────────────────────────────┐
│  代理渠道数据趋势图            [✕]      │
├─────────────────────────────────────────┤
│  代理编码: ABC123  | 渠道ID: 1          │
├─────────────────────────────────────────┤
│  日期筛选: [开始日期] - [结束日期] [查询]│
├─────────────────────────────────────────┤
│         📈 折线图区域                   │
│  消耗金额 ————                          │
│  利润     ————                          │
│                                         │
└─────────────────────────────────────────┘
```

**图表配置**：

1. **图表类型**：折线图 (Line Chart)

2. **展示指标**（双Y轴）：
   - 左Y轴：消耗金额（consume_amount）- 蓝色线条
   - 右Y轴：利润（profit）- 绿色线条

3. **X轴**：日期（day_time），按时间顺序排列

4. **交互功能**：
   - 支持图表缩放和拖拽
   - 鼠标悬停显示具体数值
   - 可以单独隐藏/显示某条线
   - 工具栏支持保存图片

5. **日期筛选**：
   - 弹窗内可以调整日期范围
   - 重新查询该代理渠道在新日期范围的数据
   - 支持快捷选择（近7天、近30天、近90天）

**数据获取逻辑**：

- **汇总统计标签页点击图表按钮**：
  - 调用 `agent-channel-attrs-day` 接口
  - 传入该行的 `agent_code` 和 `channel_id`
  - 获取该代理渠道的每日明细数据
  - 展示时间序列趋势

- **每日明细标签页点击图表按钮**：
  - 使用当前筛选条件下的该代理渠道的所有每日明细数据
  - 展示该代理渠道在筛选日期范围内的趋势

## 5. 数据流设计

### 5.1 状态管理策略

**筛选参数共享**：
- 两个标签页共享同一套筛选参数 (`filters`)
- 切换标签页时，筛选条件保持不变
- 修改筛选条件后点击查询，只刷新当前激活标签页的数据

**独立的数据和分页**：
- 汇总统计和每日明细各自维护独立的数据列表和分页状态
- 切换标签页时，显示对应标签页已加载的数据
- 避免不必要的重复请求

### 5.2 数据加载时机

1. **页面首次加载**：
   - 加载汇总统计数据（默认激活的标签页）
   - 使用默认分页参数 page=1, pagesize=10

2. **切换到每日明细标签页**：
   - 检查 dailyData 是否已加载
   - 如果未加载，自动调用 API 加载数据
   - 如果已加载，直接显示缓存数据

3. **点击查询按钮**：
   - 重置当前标签页的分页为第一页
   - 使用最新的筛选条件调用 API
   - 刷新当前标签页的数据

4. **切换分页**：
   - 使用当前筛选条件和新的页码调用 API
   - 刷新当前标签页的数据

5. **点击图表按钮**：
   - 调用 agent-channel-attrs-day 接口
   - 获取该代理渠道的每日明细数据用于图表展示

### 5.3 数据流程图

```
用户操作 → 更新状态 → 调用API → 更新数据 → 渲染视图
    ↓
[筛选/分页] → [state.filters] → [API请求] → [state.summaryData/dailyData] → [表格展示]
    ↓
[切换标签] → [state.activeTab] → [条件加载] → [显示对应数据] → [切换视图]
    ↓
[查看图表] → [state.chartModal] → [API请求] → [state.chartModal.data] → [图表展示]
```

## 6. API接口定义

### 6.1 获取代理渠道属性列表（汇总统计）

**接口路径**: `/admin/agent-channel-attrs`  
**请求方法**: `GET`  
**认证**: 需要Admin登录认证

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | string | 否 | 页码，默认1 |
| pagesize | string | 否 | 每页数量，默认10 |
| agent_code | string | 否 | 代理编码（支持模糊查询） |
| channel_id | string | 否 | 渠道ID |
| start_time | string | 否 | 开始时间（格式：YYYY-MM-DD） |
| end_time | string | 否 | 结束时间（格式：YYYY-MM-DD） |

**响应格式**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "agent_code": "ABC123",
        "channel_id": 1,
        "consume_amount": 10000,
        "profit": 500,
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T10:00:00Z"
      }
    ],
    "count": 30
  }
}
```

### 6.2 获取代理渠道每日属性列表（每日明细）

**接口路径**: `/admin/agent-channel-attrs-day`  
**请求方法**: `GET`  
**认证**: 需要Admin登录认证

**请求参数**: 同 6.1

**响应格式**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "agent_code": "ABC123",
        "channel_id": 1,
        "consume_amount": 1000,
        "profit": 50,
        "day_time": "2024-01-01T00:00:00Z",
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T10:00:00Z"
      }
    ],
    "count": 100
  }
}
```

**关键差异**: 每日明细响应多了 `day_time` 字段

## 7. 实现细节

### 7.1 API封装 (api/modules/agent.ts)

```typescript
import { alova } from '@/api/request'

// 获取代理渠道属性列表（汇总统计）
export const getAgentChannelAttrs = (params: any) => {
  return alova.Get('/admin/agent-channel-attrs', { params })
}

// 获取代理渠道每日属性列表（每日明细）
export const getAgentChannelAttrsDay = (params: any) => {
  return alova.Get('/admin/agent-channel-attrs-day', { params })
}
```

### 7.2 路由配置

在 `app/router/index.ts` 中添加路由：

```typescript
{
  path: '/agent/channel-attrs',
  name: 'AgentChannelAttrs',
  component: () => import('@/pages/agent/channel-attrs.vue'),
  meta: {
    title: '代理渠道属性统计',
    requiresAuth: true
  }
}
```

### 7.3 菜单配置

在菜单配置中添加新菜单项（具体位置根据项目菜单结构确定）：

```typescript
{
  id: 'agent-channel-attrs',
  title: '代理渠道属性',
  icon: 'i-lucide-bar-chart',
  path: '/agent/channel-attrs'
}
```

### 7.4 关键实现要点

**1. 标签页切换逻辑**：
```typescript
const handleTabChange = (tab: string) => {
  state.activeTab = tab
  // 如果切换到的标签页数据未加载，自动加载
  if (tab === 'daily' && state.dailyData.list.length === 0) {
    loadDailyData()
  }
}
```

**2. 数据格式化**：
- 金额字段：使用 `¥` 符号 + 千分位格式化
- 日期时间：使用 `formatToDateTime` 工具函数
- 日期：使用 `formatToDate` 工具函数

**3. 图表数据处理**：
```typescript
const processChartData = (data: any[]) => {
  return {
    dates: data.map(item => formatToDate(item.day_time)),
    consumeAmounts: data.map(item => item.consume_amount),
    profits: data.map(item => item.profit)
  }
}
```

## 8. 测试计划

### 8.1 功能测试

**筛选功能**：
- [ ] 代理编码模糊查询是否正常工作
- [ ] 渠道ID精确查询是否正常工作
- [ ] 日期范围筛选是否正常工作
- [ ] 重置按钮是否清空所有筛选条件
- [ ] 查询按钮是否触发数据加载

**标签页切换**：
- [ ] 切换标签页时筛选条件是否保持
- [ ] 首次切换到每日明细时是否自动加载数据
- [ ] 切换标签页时分页状态是否独立

**分页功能**：
- [ ] 分页器是否正确显示总页数
- [ ] 切换页码是否正确加载对应页数据
- [ ] 两个标签页的分页是否独立

**图表功能**：
- [ ] 点击图表按钮是否弹出图表弹窗
- [ ] 图表数据是否正确展示
- [ ] 图表日期筛选是否正常工作
- [ ] 图表交互功能是否正常（缩放、悬停等）

### 8.2 UI/UX测试

- [ ] 页面布局是否合理，响应式是否正常
- [ ] 加载状态是否显示（loading）
- [ ] 空数据状态是否友好提示
- [ ] 错误状态是否有错误提示

### 8.3 性能测试

- [ ] 大数据量时表格渲染是否流畅
- [ ] 图表渲染是否流畅
- [ ] 标签页切换是否有明显延迟

## 9. 总结

本设计文档详细描述了代理渠道属性统计页面的完整设计方案，包括：

1. **页面架构**：清晰的文件组织和组件划分
2. **功能设计**：标签页切换、筛选、分页、图表可视化
3. **数据流**：完整的状态管理和数据加载策略
4. **API接口**：明确的接口定义和参数说明
5. **实现细节**：关键代码实现要点

该方案满足以下关键需求：
- ✅ 融合两个不同维度的数据（汇总统计 vs 每日明细）
- ✅ 提供清晰的数据筛选功能
- ✅ 支持图表可视化展示
- ✅ 遵循项目现有的代码规范和技术栈
- ✅ 提供良好的用户体验

下一步将根据此设计文档创建详细的实现计划。

