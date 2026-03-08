/**
 * SillyTavern 兼容渲染器
 * 参考: https://github.com/N0VI028/JS-Slash-Runner
 */

import { marked } from 'marked';

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true
});

// ============ 内容类型检测 ============
// 参考: https://github.com/N0VI028/JS-Slash-Runner/src/util/is_frontend.ts

/**
 * 检测是否为前端代码（完整 HTML 文档）
 * 与 JS-Slash-Runner 的 isFrontend() 保持一致
 */
export function isFrontendCode(content: string): boolean {
  if (!content || typeof content !== 'string') return false;
  // JS-Slash-Runner 使用的标签检测
  return ['html>', '<head>', '<body'].some(tag => content.includes(tag));
}

/**
 * 检测 HTML 元素是否为前端元素（需要 iframe 渲染）
 * 与 JS-Slash-Runner 的 isFrontendElement() 保持一致
 * @param element - DOM 元素或 HTML 字符串
 */
export function isFrontendElement(element: HTMLElement | string | null): boolean {
  if (!element) return false;

  // 如果是字符串，检测是否包含前端代码标记
  if (typeof element === 'string') {
    // 检查是否有 TH-render 类
    if (/class="[^"]*TH-render[^"]*"/i.test(element)) {
      return true;
    }
    // 检查是否包含前端代码
    return isFrontendCode(element);
  }

  // 检查是否有 TH-render 类
  if (element.classList && element.classList.contains('TH-render')) {
    return true;
  }

  // 检查是否是 <pre> 标签且包含前端代码
  if (element.tagName === 'PRE') {
    const text = element.textContent || element.innerText || '';
    return isFrontendCode(text);
  }

  return false;
}

/**
 * 检测元素是否包含前端元素（嵌套检测）
 * 与 JS-Slash-Runner 的 containsFrontendElement() 保持一致
 * @param element - DOM 元素或 HTML 字符串
 */
export function containsFrontendElement(content: string): boolean {
  if (!content) return false;

  // 首先检查自身
  if (isFrontendElement(content)) return true;

  // 检查是否包含 .TH-render 元素
  if (/<div[^>]*class="[^"]*TH-render[^"]*"[^>]*>/i.test(content)) {
    return true;
  }

  // 检查是否包含 <pre> 标签内的前端代码
  const preMatch = content.match(/<pre[^>]*>([\s\S]*?)<\/pre>/gi);
  if (preMatch) {
    for (const pre of preMatch) {
      const inner = pre.replace(/<\/?pre[^>]*>/gi, '');
      if (isFrontendCode(inner)) return true;
    }
  }

  return false;
}

/**
 * 检测 pre 标签内是否包含前端代码（兼容旧 API）
 */
export function containsPreFrontend(content: string): boolean {
  if (!content) return false;
  const preMatch = content.match(/<pre[^>]*>([\s\S]*?)<\/pre>/gi);
  if (!preMatch) return false;
  return preMatch.some(pre => {
    const inner = pre.replace(/<\/?pre[^>]*>/gi, '');
    return isFrontendCode(inner);
  });
}

/**
 * 提取 pre 标签中的前端代码
 */
export function extractPreFrontend(content: string): Array<{ full: string; html: string }> {
  if (!content) return [];
  const results: Array<{ full: string; html: string }> = [];
  const preRegex = /<pre[^>]*>([\s\S]*?)<\/pre>/gi;
  let match;
  while ((match = preRegex.exec(content)) !== null) {
    const inner = match[1];
    if (isFrontendCode(inner)) {
      results.push({
        full: match[0],
        html: inner.replace(/<\/?code[^>]*>/gi, '').trim()
      });
    }
  }
  return results;
}

/**
 * 提取 .TH-render 元素
 */
export function extractTHRenderElements(content: string): Array<{ full: string; html: string }> {
  if (!content) return [];
  const results: Array<{ full: string; html: string }> = [];
  const regex = /<div[^>]*class="[^"]*TH-render[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    results.push({
      full: match[0],
      html: match[1].trim()
    });
  }
  return results;
}

/**
 * 检测是否包含 HTML 标签
 */
export function containsHTML(content: string): boolean {
  if (!content) return false;
  return /<[a-z][\s\S]*>/i.test(content);
}

/**
 * 检测是否为 Markdown 内容
 */
export function isMarkdownContent(content: string): boolean {
  if (!content || typeof content !== 'string') return false;
  const patterns = [
    /^#{1,6}\s+/m,           // 标题
    /\*\*[^*]+\*\*/,         // 粗体
    /\*[^*]+\*/,             // 斜体
    /^\s*[-*+]\s+/m,         // 无序列表
    /^\s*\d+\.\s+/m,         // 有序列表
    /\[.+\]\(.+\)/,          // 链接
    /!\[.*\]\(.+\)/,         // 图片
    /^>\s+/m,                // 引用
    /`[^`]+`/,               // 行内代码
    /^\|.+\|$/m,             // 表格
  ];
  return patterns.some(p => p.test(content));
}

/**
 * 检测是否包含危险标签（需要 iframe 隔离）
 */
export function hasDangerousTags(content: string): boolean {
  if (!content) return false;
  return /<(script|iframe|audio|video|object|embed|form|input|button)[^>]*>/i.test(content);
}

// ============ 内容提取 ============

/**
 * 提取 ```html 代码块中的内容
 */
export function extractHtmlCodeBlock(content: string): string | null {
  if (!content) return null;

  // 匹配 ```html ... ``` 代码块
  const match = content.match(/```html\s*\n?([\s\S]*?)```/i);
  if (match && match[1]) {
    let html = match[1].trim();
    // 截断到 </html>
    const endMatch = html.match(/<\/html>/i);
    if (endMatch && endMatch.index !== undefined) {
      html = html.slice(0, endMatch.index + 7);
    }
    return html;
  }
  return null;
}

/**
 * 提取裸 HTML 文档
 */
export function extractRawHtmlDoc(content: string): string | null {
  if (!content) return null;

  const match = content.match(/(<!DOCTYPE[\s\S]*?<\/html>|<html[\s\S]*?<\/html>)/i);
  if (match && match[1]) return match[1];
  return null;
}

/**
 * 提取 HTML 文档之前的文本部分
 */
export function extractTextBeforeHtml(content: string): string {
  if (!content) return '';

  // 查找 ```html 代码块
  const codeBlockMatch = content.match(/```html\s*\n?/i);
  if (codeBlockMatch) {
    return content.slice(0, codeBlockMatch.index)
      .replace(/```\w*\s*/g, '')
      .replace(/<\/?maintext>/gi, '')
      .trim();
  }

  // 查找裸 HTML 文档
  const htmlMatch = content.match(/(<!DOCTYPE|<html)/i);
  if (htmlMatch && htmlMatch.index! > 0) {
    return content.slice(0, htmlMatch.index)
      .replace(/```\w*\s*/g, '')
      .replace(/<\/?maintext>/gi, '')
      .trim();
  }

  return content.replace(/```\w*\s*/g, '').trim();
}

// ============ 内容清理 ============

/**
 * 清理选项标签
 */
export function cleanChoiceTags(content: string): string {
  if (!content) return content;
  return content
    .replace(/\[\[CHOICE_START\]\][\s\S]*?\[\[CHOICE_END\]\]/g, '')
    .replace(/\[\[CHOICE_START\]\][\s\S]*$/g, '') // 未闭合的
    .trim();
}

/**
 * 清理不完整的代码块
 */
export function cleanIncompleteCodeBlocks(content: string): string {
  if (!content) return content;

  const fenceCount = (content.match(/```/g) || []).length;
  if (fenceCount % 2 !== 0) {
    // 奇数个 ```，说明不完整
    return content
      .replace(/^```\w*\s*\n?/gm, '')
      .replace(/\n?```\s*$/gm, '')
      .replace(/```\w*\n/g, '')
      .replace(/\n```/g, '');
  }
  return content;
}

/**
 * 清理自定义标签
 */
export function cleanCustomTags(content: string): string {
  if (!content) return content;
  return content
    .replace(/<\/?maintext>/gi, '')
    .replace(/<\/?option[^>]*>/gi, '')
    .replace(/<\/?tickbubble[^>]*>/gi, '')
    .replace(/<\/?VariableInsert>/gi, '')
    .replace(/<\/?speak[^>]*>/gi, '')
    .replace(/<\/?think[^>]*>/gi, '')
    .replace(/<\/?narrate[^>]*>/gi, '')
    .replace(/<\/?ooc[^>]*>/gi, '')
    .replace(/\^\^\^([\s\S]*?)\^\^\^/g, '$1')
    .replace(/\[\[\[hidden\]\]\][\s\S]*?\[\[\[\/hidden\]\]\]/gi, '')
    .replace(/\{\{hidden\}\}[\s\S]*?\{\{\/hidden\}\}/gi, '');
}

// ============ 变量解析 ============

/**
 * 解析 _.set() 命令
 * 支持格式: _.set('path', value) 或 _.set('path', oldValue, newValue)
 * 参考: JS-Slash-Runner 的解析逻辑
 */
export function parseSetCommands(content: string): Record<string, any> {
  if (!content) return {};

  const result: Record<string, any> = {};

  // 预处理：移除行内注释，避免干扰解析
  const lines = content.split('\n');
  const cleanedLines = lines.map(line => {
    // 移除 // 注释（但保留字符串内的）
    let inString = false;
    let stringChar = '';
    let commentStart = -1;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const prevChar = line[i - 1];
      if (!inString && (char === '"' || char === "'")) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && prevChar !== '\\') {
        inString = false;
      } else if (!inString && char === '/' && line[i + 1] === '/') {
        commentStart = i;
        break;
      }
    }
    return commentStart >= 0 ? line.slice(0, commentStart) : line;
  });
  const cleanedContent = cleanedLines.join('\n');

  // 更宽松的正则：匹配 _.set('path', value) 或 _.set('path', old, new)
  const setRegex = /_\.set\s*\(\s*(['"`])([^'"`]+)\1\s*,\s*([^,\n;)]+)(?:\s*,\s*([^;\n)]+))?\s*\)/g;

  let match;
  while ((match = setRegex.exec(cleanedContent)) !== null) {
    const path = match[2].trim();
    // 如果有第三个参数（新值），使用它；否则使用第二个参数
    let valueStr = (match[4] || match[3]).trim();

    // 解析值
    let value: any;
    try {
      // 尝试 JSON 解析
      value = JSON.parse(valueStr);
    } catch {
      // 如果不是有效 JSON，去掉引号作为字符串
      value = valueStr.replace(/^['"`]|['"`]$/g, '');
    }

    // 设置到结果对象中（支持嵌套路径）
    const keys = path.split('.');
    let obj: Record<string, any> = result;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
  }

  // 调试日志
  if (Object.keys(result).length > 0) {
    console.log('[parseSetCommands] parsed variables:', JSON.stringify(result));
  }

  return result;
}

/**
 * 深度合并对象
 */
function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

/**
 * 提取并解析 <updatevariable> 标签内容
 * 支持大小写混合：<UpdateVariable>, <updatevariable>, <UPDATEVARIABLE> 等
 */
export function extractAndParseUpdateVariable(content: string): { content: string; variables: Record<string, any> } {
  if (!content) return { content, variables: {} };

  let variables: Record<string, any> = {};
  let cleanedContent = content;

  // 匹配各种形式的 updatevariable 标签（包括自闭合和不规范的写法）
  const updateVarRegex = /<update[_-]?variable[^>]*>([\s\S]*?)<\/update[_-]?variable>/gi;

  let matchCount = 0;
  cleanedContent = content.replace(updateVarRegex, (match, inner) => {
    matchCount++;
    console.log('[extractAndParseUpdateVariable] found tag #' + matchCount + ':', inner.slice(0, 200));
    // 解析标签内的 _.set() 命令
    const parsed = parseSetCommands(inner);
    // 合并到变量对象
    deepMerge(variables, parsed);
    // 返回空字符串以移除标签
    return '';
  });

  // 同时解析不在标签内的 _.set() 命令（某些角色卡可能直接使用）
  const outsideVars = parseSetCommands(cleanedContent);
  deepMerge(variables, outsideVars);

  // 调试日志
  if (Object.keys(variables).length > 0) {
    console.log('[extractAndParseUpdateVariable] total variables:', JSON.stringify(variables));
  }

  return { content: cleanedContent, variables };
}

/**
 * 渲染变量面板（显示解析出的变量）
 */
export function renderVariablePanel(variables: Record<string, any>, title = '状态数据'): string {
  if (!variables || Object.keys(variables).length === 0) return '';

  const renderValue = (val: any, depth = 0): string => {
    if (val === null || val === undefined) return '<span style="color:#999">null</span>';
    if (typeof val === 'boolean') return `<span style="color:#0066cc">${val}</span>`;
    if (typeof val === 'number') return `<span style="color:#009900">${val}</span>`;
    if (typeof val !== 'object') return `<span style="color:#333">${escapeHtml(String(val))}</span>`;
    if (Array.isArray(val)) {
      if (val.length === 0) return '<span style="color:#999">[]</span>';
      return val.map((item, i) =>
        `<div style="padding-left:${depth * 12}px"><span style="color:#666">[${i}]:</span> ${renderValue(item, depth + 1)}</div>`
      ).join('');
    }
    return Object.entries(val).map(([k, v]) =>
      `<div style="padding-left:${depth * 12}px"><span style="color:#5E5B9D;font-weight:500">${escapeHtml(k)}:</span> ${renderValue(v, depth + 1)}</div>`
    ).join('');
  };

  return `<details class="variable-panel" style="margin:8px 0;border:1px solid rgba(94,91,157,0.3);border-radius:8px;background:rgba(94,91,157,0.05);overflow:hidden;" open>
<summary style="padding:8px 12px;cursor:pointer;font-size:12px;color:rgba(94,91,157,0.9);user-select:none;">📊 ${escapeHtml(title)}</summary>
<div style="padding:8px;max-height:300px;overflow:auto;font-size:11px;font-family:monospace;">${renderValue(variables)}</div>
</details>`;
}

// ============ 宏替换 ============

/**
 * 变量存储（简化版）
 */
const variableStore: Record<string, Record<string, any>> = {
  global: {},
  chat: {},
  message: {},
  character: {},
  preset: {}
};

/**
 * 获取变量值
 */
export function getVariable(path: string, type = 'chat'): any {
  const store = variableStore[type] || {};
  if (!path) return store;
  const keys = path.split('.');
  let val: any = store;
  for (const k of keys) {
    if (val == null) return undefined;
    val = val[k];
  }
  return val;
}

/**
 * 设置变量值
 */
export function setVariable(path: string, value: any, type = 'chat'): void {
  if (!variableStore[type]) variableStore[type] = {};
  const keys = path.split('.');
  let obj: Record<string, any> = variableStore[type]!;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!;
    if (!obj[key]) obj[key] = {};
    obj = obj[key];
  }
  const lastKey = keys[keys.length - 1]!;
  obj[lastKey] = value;
}

interface MacroContext {
  userName?: string;
  charName?: string;
  lastUserMessage?: string;
  userInfo?: {
    avatar?: string;
    username?: string;
  };
  characterInfo?: {
    avatar?: string;
    image?: string;
    description?: string;
    personality?: string;
    scenario?: string;
  };
}

/**
 * 替换宏变量
 */
export function replaceMacros(content: string, ctx: MacroContext = {}): string {
  if (!content) return content;

  const { userName = '用户', charName = '角色', lastUserMessage = '', userInfo = {}, characterInfo = {} } = ctx;

  let result = content;

  // 基础宏
  result = result
    .replace(/\{\{user\}\}/gi, userName)
    .replace(/\{\{char\}\}/gi, charName)
    .replace(/\{\{User\}\}/g, userName)
    .replace(/\{\{Char\}\}/g, charName)
    .replace(/\{\{lastUserMessage\}\}/g, lastUserMessage)
    .replace(/\{\{lastMessage\}\}/gi, lastUserMessage)
    .replace(/\{\{time\}\}/gi, new Date().toLocaleTimeString())
    .replace(/\{\{date\}\}/gi, new Date().toLocaleDateString())
    .replace(/\{\{weekday\}\}/gi, () => ['日', '一', '二', '三', '四', '五', '六'][new Date().getDay()] || '日')
    .replace(/\{\{isotime\}\}/gi, () => new Date().toISOString())
    .replace(/\{\{isodate\}\}/gi, () => new Date().toISOString().split('T')[0] || '')
    .replace(/\{\{idle_duration\}\}/gi, '0')
    .replace(/\{\{random\}\}/gi, () => Math.random().toString())
    .replace(/\{\{roll:(\d+)\}\}/gi, (_, max) => String(Math.floor(Math.random() * parseInt(max, 10)) + 1))
    .replace(/\{\{random:(\d+)-(\d+)\}\}/gi, (_, min, max) => {
      const minN = parseInt(min, 10);
      const maxN = parseInt(max, 10);
      return String(Math.floor(Math.random() * (maxN - minN + 1)) + minN);
    })
    .replace(/\{\{newline\}\}/gi, '\n')
    .replace(/\{\{trim\}\}/gi, '')
    .replace(/\{\{noop\}\}/gi, '');

  // 用户/角色信息宏
  result = result
    .replace(/\{\{user_avatar\}\}/gi, userInfo?.avatar || '')
    .replace(/\{\{char_avatar\}\}/gi, characterInfo?.avatar || characterInfo?.image || '')
    .replace(/\{\{persona\}\}/gi, userInfo?.username || userName)
    .replace(/\{\{description\}\}/gi, characterInfo?.description || '')
    .replace(/\{\{personality\}\}/gi, characterInfo?.personality || '')
    .replace(/\{\{scenario\}\}/gi, characterInfo?.scenario || '');

  // JS-Slash-Runner 变量宏: {{get_chat_variable::path}}
  result = result.replace(
    /\{\{get_(message|chat|character|preset|global)_variable::(.*?)\}\}/gi,
    (_, type, path) => {
      const val = getVariable(path, type);
      if (val === undefined || val === null) return '';
      return typeof val === 'string' ? val : JSON.stringify(val);
    }
  );

  // JS-Slash-Runner 格式化变量宏: {{format_chat_variable::path}}
  result = result.replace(
    /\{\{format_(message|chat|character|preset|global)_variable::(.*?)\}\}/gi,
    (_, type, path) => {
      const val = getVariable(path, type);
      if (val === undefined || val === null) return '';
      if (typeof val === 'string') return val;
      try {
        return JSON.stringify(val, null, 2);
      } catch {
        return String(val);
      }
    }
  );

  // 条件宏: {{#if var}}content{{/if}}
  result = result.replace(
    /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/gi,
    (_, varName, content) => {
      const val = getVariable(varName, 'chat');
      return val ? content : '';
    }
  );

  // 条件宏: {{#unless var}}content{{/unless}}
  result = result.replace(
    /\{\{#unless\s+(\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/gi,
    (_, varName, content) => {
      const val = getVariable(varName, 'chat');
      return !val ? content : '';
    }
  );

  return result;
}

// ============ HTML 安全处理 ============

/**
 * 转义 HTML 特殊字符
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 净化 HTML（简单版本，移除危险内容）
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  // 简单净化：移除脚本和事件处理器
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*(['"])[\s\S]*?\1/gi, '')
    .replace(/javascript:/gi, '');
}

// ============ Markdown 渲染 ============

/**
 * 渲染 Markdown 为 HTML
 */
export function renderMarkdown(content: string): string {
  if (!content) return '';
  try {
    const html = marked.parse(content);
    return typeof html === 'string' ? html : '';
  } catch (e) {
    console.error('[renderMarkdown] error:', e);
    return escapeHtml(content);
  }
}

// ============ 状态面板渲染 ============

/**
 * 渲染状态栏
 */
export function renderStatBar(statText: string): string {
  if (!statText) return '';
  const escaped = escapeHtml(statText);
  return `<div class="stat-bar" style="margin:6px 0;padding:8px 10px;border:1px solid var(--border-color,#e0e0e0);border-radius:10px;background:rgba(0,0,0,0.02);font-size:12px;color:var(--text-secondary,#666);">${escaped.replace(/\n/g, '<br>')}</div>`;
}

/**
 * 渲染 JSON 为折叠面板
 */
export function renderJsonPanel(data: Record<string, any>, title = '状态面板'): string {
  if (!data || typeof data !== 'object') return '';

  const renderValue = (val: any, depth = 0): string => {
    if (val === null || val === undefined) return '<span style="color:#999">null</span>';
    if (typeof val !== 'object') return `<span style="color:#333">${escapeHtml(String(val))}</span>`;
    if (Array.isArray(val)) {
      if (val.length === 0) return '<span style="color:#999">[]</span>';
      return val.map((item, i) => `<div style="padding-left:${depth * 12}px">[${i}]: ${renderValue(item, depth + 1)}</div>`).join('');
    }
    return Object.entries(val).map(([k, v]) =>
      `<div style="padding-left:${depth * 12}px"><span style="color:#666">${escapeHtml(k)}:</span> ${renderValue(v, depth + 1)}</div>`
    ).join('');
  };

  return `<details class="json-panel" style="margin:8px 0;border:1px solid rgba(100,200,150,0.3);border-radius:8px;background:rgba(100,200,150,0.05);overflow:hidden;">
<summary style="padding:8px 12px;cursor:pointer;font-size:12px;color:rgba(100,200,150,0.9);">📊 ${escapeHtml(title)}</summary>
<div style="padding:8px;max-height:300px;overflow:auto;font-size:11px;">${renderValue(data)}</div>
</details>`;
}

export default {
  isFrontendCode,
  isFrontendElement,
  containsFrontendElement,
  containsPreFrontend,
  extractPreFrontend,
  extractTHRenderElements,
  containsHTML,
  isMarkdownContent,
  hasDangerousTags,
  extractHtmlCodeBlock,
  extractRawHtmlDoc,
  extractTextBeforeHtml,
  cleanChoiceTags,
  cleanIncompleteCodeBlocks,
  cleanCustomTags,
  parseSetCommands,
  extractAndParseUpdateVariable,
  renderVariablePanel,
  getVariable,
  setVariable,
  replaceMacros,
  escapeHtml,
  sanitizeHtml,
  renderMarkdown,
  renderStatBar,
  renderJsonPanel
};
