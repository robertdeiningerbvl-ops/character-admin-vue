/**
 * 统一消息渲染器
 * 整合 SillyTavern 兼容渲染、Markdown、HTML、iframe 等多种格式
 * 参考: https://github.com/N0VI028/JS-Slash-Runner/src/panel/render/
 */

import { marked } from 'marked';
import {
	isFrontendCode,
	containsFrontendElement,
	containsHTML,
	isMarkdownContent,
	hasDangerousTags,
	extractHtmlCodeBlock,
	extractRawHtmlDoc,
	extractTextBeforeHtml,
	containsPreFrontend,
	extractPreFrontend,
	extractTHRenderElements,
	cleanChoiceTags,
	cleanIncompleteCodeBlocks,
	cleanCustomTags,
	extractAndParseUpdateVariable,
	renderVariablePanel,
	replaceMacros,
	escapeHtml,
	renderMarkdown,
	renderStatBar,
	setVariable
} from './tavern-renderer';

import { createIframeContent } from './iframe-builder';

// 配置 marked
marked.setOptions({
	breaks: true,
	gfm: true
});

// ============ 渲染结果类型 ============
// kind: 'text' | 'html' | 'markdown' | 'iframe' | 'mixed' | 'nestedIframe'

interface RenderContext {
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
		name?: string;
		description?: string;
		personality?: string;
		scenario?: string;
	};
	messageId?: string;
}

interface DetectedContent {
	type: string;
	html?: string;
	text?: string;
	content?: string;
	frontends?: Array<{ full: string; html: string }>;
}

interface RenderResult {
	kind: 'text' | 'html' | 'markdown' | 'iframe' | 'mixed' | 'nestedIframe';
	html: string;
	text?: string;
	textHtml?: string;
	messageId?: string;
	variables?: Record<string, any>;
	variableHtml?: string;
	frontends?: Array<{ full: string; iframe: string }>;
}

const defaultContext: RenderContext = {
	userName: '用户',
	charName: '角色',
	lastUserMessage: '',
	userInfo: {},
	characterInfo: {},
	messageId: ''
};

/**
 * 解析消息内容类型
 * 与 JS-Slash-Runner 的 StreamingOne.vue 逻辑保持一致
 */
function detectContentType(content: string): DetectedContent {
	if (!content || typeof content !== 'string') {
		return { type: 'empty' };
	}

	const trimmed = content.trim();

	// 1. 检测 .TH-render 类（JS-Slash-Runner 专用标记）
	if (/<div[^>]*class="[^"]*TH-render[^"]*"[^>]*>/i.test(content)) {
		const thRenderElements = extractTHRenderElements(content);
		if (thRenderElements.length > 0) {
			const firstElement = thRenderElements[0]!;
			// 如果只有 TH-render 元素，直接渲染为 iframe
			if (thRenderElements.length === 1 &&
				content.trim() === firstElement.full.trim()) {
				return { type: 'fullHtmlDoc', html: firstElement.html };
			}
			// 否则作为嵌套前端处理
			return {
				type: 'nestedFrontend',
				html: content,
				frontends: thRenderElements
			};
		}
	}

	// 2. 检测 ```html 代码块
	const htmlCodeBlock = extractHtmlCodeBlock(content);
	if (htmlCodeBlock && isFrontendCode(htmlCodeBlock)) {
		const textBefore = extractTextBeforeHtml(content);
		return {
			type: textBefore ? 'mixed' : 'fullHtmlDoc',
			text: textBefore,
			html: htmlCodeBlock
		};
	}

	// 3. 检测裸 HTML 文档
	const rawHtmlDoc = extractRawHtmlDoc(content);
	if (rawHtmlDoc) {
		const textBefore = extractTextBeforeHtml(content);
		return {
			type: textBefore ? 'mixed' : 'fullHtmlDoc',
			text: textBefore,
			html: rawHtmlDoc
		};
	}

	// 4. 检测完整 HTML 文档标记
	if (isFrontendCode(trimmed)) {
		return { type: 'fullHtmlDoc', html: trimmed };
	}

	// 5. 检测 <pre> 标签中的前端代码
	if (containsPreFrontend(content)) {
		const preFrontends = extractPreFrontend(content);
		if (preFrontends.length > 0) {
			return {
				type: 'nestedFrontend',
				html: content,
				frontends: preFrontends
			};
		}
	}

	// 6. 检测危险标签（需要 iframe 隔离）
	if (hasDangerousTags(content)) {
		return { type: 'dangerousHtml', html: content };
	}

	// 7. 检测是否包含前端元素（使用 JS-Slash-Runner 的检测方式）
	if (containsFrontendElement(content)) {
		return { type: 'dangerousHtml', html: content };
	}

	// 8. 检测普通 HTML 片段
	if (containsHTML(content) && !isMarkdownContent(content)) {
		return { type: 'htmlFragment', html: content };
	}

	// 9. 检测 Markdown
	if (isMarkdownContent(content)) {
		return { type: 'markdown', content };
	}

	// 10. 纯文本
	return { type: 'text', content };
}

/**
 * 处理状态栏（非 HTML 的 ``` 代码块）
 */
function processStatBars(content: string): string {
	if (!content) return content;
	const placeholders: string[] = [];

	let result = content.replace(/```([^`]*)```/gs, (match, inner) => {
		const trimmed = (inner || '').trim();
		// 跳过 HTML 代码块
		if (trimmed.startsWith('html') || /<[^>]+>/.test(trimmed)) {
			return match;
		}
		const idx = placeholders.length;
		placeholders.push(trimmed);
		return `__STATBAR_${idx}__`;
	});

	result = result.replace(/__STATBAR_(\d+)__/g, (_, idx) => {
		const placeholder = placeholders[parseInt(idx, 10)];
		return renderStatBar(placeholder || '');
	});

	return result;
}

/**
 * 递归设置嵌套变量
 */
function setNestedVariables(prefix: string, obj: Record<string, any>): void {
	for (const [key, value] of Object.entries(obj)) {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			setNestedVariables(path, value);
		} else {
			setVariable(path, value, 'chat');
		}
	}
}

/**
 * 预处理消息内容
 * 返回 { content, variables, variableHtml }
 */
function preprocessContent(content: string, ctx: RenderContext = {}): { content: string; variables: Record<string, any>; variableHtml: string } {
	if (!content) return { content: '', variables: {}, variableHtml: '' };

	let result = content;

	// 1. 解析并提取 <updatevariable> 标签和 _.set() 命令
	const { content: contentWithoutVars, variables } = extractAndParseUpdateVariable(result);
	result = contentWithoutVars;

	// 2. 将解析出的变量存储到变量系统中
	if (Object.keys(variables).length > 0) {
		for (const [key, value] of Object.entries(variables)) {
			if (typeof value === 'object' && value !== null) {
				// 嵌套对象，递归设置
				setNestedVariables(key, value);
			} else {
				setVariable(key, value, 'chat');
			}
		}
	}

	// 3. 清理不完整的代码块
	result = cleanIncompleteCodeBlocks(result);

	// 4. 清理自定义标签（不包括已处理的 updatevariable）
	result = cleanCustomTags(result);

	// 5. 宏替换
	result = replaceMacros(result, ctx);

	// 6. 处理状态栏
	result = processStatBars(result);

	// 7. 生成变量面板 HTML
	const variableHtml = Object.keys(variables).length > 0 ? renderVariablePanel(variables) : '';

	return { content: result, variables, variableHtml };
}

/**
 * 处理 HTML 片段（保留换行 + 宏替换）
 */
function processHtmlFragment(html: string, ctx: RenderContext = {}): string {
	if (!html) return html;

	let result = html;

	// 宏替换
	result = replaceMacros(result, ctx);

	// 只处理不在标签内的换行
	result = result
		.replace(/\r\n/g, '\n')
		.replace(/\n/g, '<br>');

	return result;
}

/**
 * 主渲染函数
 * @param message - 消息对象 { role: string, content: string }
 * @param ctx - 渲染上下文
 * @returns 渲染结果 { kind: string, html?: string, text?: string, frontends?: Array, variables?: Object }
 */
export function createRenderer(message: { role?: string; content?: string; id?: string }, ctx: RenderContext = {}): RenderResult {
	const context = { ...defaultContext, ...ctx };
	const { role, content, id } = message || {};
	const messageId = id || context.messageId || `msg_${Date.now()}`;

	if (!content) {
		return { kind: 'text', html: '', text: '', messageId, variables: {} };
	}

	// 清理选项标签
	let cleanContent = cleanChoiceTags(content);

	// 预处理（宏替换、变量解析等）- 仅对 AI 消息处理
	let variables: Record<string, any> = {};
	let variableHtml = '';
	if (role !== 'user') {
		const processed = preprocessContent(cleanContent, context);
		cleanContent = processed.content;
		variables = processed.variables;
		variableHtml = processed.variableHtml;
	}

	// 检测内容类型
	const detected = detectContentType(cleanContent);

	// 通用 iframe 配置 - 包含宏替换所需的上下文
	const iframeOptions = {
		userInfo: context.userInfo,
		characterInfo: context.characterInfo,
		messageId: messageId,
		userName: context.userName,
		charName: context.charName,
		lastUserMessage: context.lastUserMessage
	};

	switch (detected.type) {
		case 'empty':
			return { kind: 'text', html: '', text: '', messageId, variables, variableHtml };

		case 'fullHtmlDoc':
			return {
				kind: 'iframe',
				html: createIframeContent(detected.html || '', iframeOptions),
				messageId,
				variables,
				variableHtml
			};

		case 'mixed':
			return {
				kind: 'mixed',
				text: detected.text || '',
				textHtml: renderMarkdown(detected.text || '') || escapeHtml(detected.text || '').replace(/\n/g, '<br>'),
				html: createIframeContent(detected.html || '', iframeOptions),
				messageId,
				variables,
				variableHtml
			};

		case 'dangerousHtml':
			return {
				kind: 'iframe',
				html: createIframeContent(detected.html || '', iframeOptions),
				messageId,
				variables,
				variableHtml
			};

		case 'nestedFrontend':
			// 处理嵌套在 <pre> 或 .TH-render 中的前端代码
			return {
				kind: 'nestedIframe',
				html: detected.html || '',
				frontends: (detected.frontends || []).map((f, index) => ({
					full: f.full,
					iframe: createIframeContent(f.html, {
						...iframeOptions,
						messageId: `${messageId}--${index}`
					})
				})),
				messageId,
				variables,
				variableHtml
			};

		case 'htmlFragment':
			return {
				kind: 'html',
				html: processHtmlFragment(detected.html || '', context) + variableHtml,
				messageId,
				variables
			};

		case 'markdown':
			// 对 markdown 内容也进行宏替换
			const markdownWithMacros = replaceMacros(detected.content || '', context);
			return {
				kind: 'markdown',
				html: renderMarkdown(markdownWithMacros) + variableHtml,
				messageId,
				variables
			};

		case 'text':
		default:
			// 对纯文本也进行宏替换
			const textWithMacros = replaceMacros(detected.content || '', context);
			return {
				kind: 'html',
				html: escapeHtml(textWithMacros).replace(/\n/g, '<br>') + variableHtml,
				messageId,
				variables
			};
	}
}

/**
 * 批量渲染消息
 * @param messages - 消息数组
 * @param ctx - 渲染上下文
 * @returns 渲染结果数组
 */
export function renderMessages(messages: Array<{ role?: string; content?: string; id?: string }>, ctx: RenderContext = {}): RenderResult[] {
	if (!Array.isArray(messages)) return [];
	return messages.map((msg, index) =>
		createRenderer(msg, { ...ctx, messageId: msg.id || `msg_${index}` })
	);
}

/**
 * 检测内容是否需要 iframe 渲染
 * 可用于判断是否需要启用 iframe 模式
 */
export function needsIframeRender(content: string): boolean {
	if (!content) return false;

	const detected = detectContentType(content);
	return ['fullHtmlDoc', 'mixed', 'dangerousHtml', 'nestedFrontend'].includes(detected.type);
}

/**
 * 快速检测内容类型
 */
export function getContentType(content: string): string {
	return detectContentType(content).type;
}

/**
 * 锁定 iframe 样式泄漏
 */
export function lockIframeStyleLeak(): void {
	if (typeof window === 'undefined' || !window.document) return;
	const doc = window.document;
	if ((doc as any).__STYLE_LEAK_LOCKED__) return;
	(doc as any).__STYLE_LEAK_LOCKED__ = true;

	const head = doc.head;
	const allowSet = new Set(Array.from(head.children));
	const isStyleNode = (node: Element): boolean => {
		if (!node || !node.tagName) return false;
		const tag = String(node.tagName).toUpperCase();
		if (tag === 'STYLE') return true;
		if (tag === 'LINK') {
			const rel = (node.getAttribute('rel') || '').toLowerCase();
			return rel === 'stylesheet';
		}
		return false;
	};

	const removeIfInjected = (node: Node): void => {
		try {
			if (!node || node.nodeType !== 1) return;
			if (!isStyleNode(node as Element)) return;
			if (allowSet.has(node as Element)) return;
			node.parentNode && node.parentNode.removeChild(node);
		} catch {}
	};

	Array.from(head.children).forEach((n) => removeIfInjected(n));
	const mo = new MutationObserver((mutations) => {
		for (const m of mutations) {
			if (m.type !== 'childList') continue;
			m.addedNodes && Array.from(m.addedNodes).forEach((n) => removeIfInjected(n));
		}
	});
	mo.observe(head, {
		childList: true
	});

	// 2) 锁住 html/body 的 class/style 不允许被改
	const rawSetAttr = Element.prototype.setAttribute;
	Element.prototype.setAttribute = function(name: string, value: string) {
		try {
			const n = String(name || '').toLowerCase();
			const isRoot = this === doc.documentElement || this === doc.body;
			if (isRoot && (n === 'class' || n === 'style')) return;
		} catch {}
		return rawSetAttr.call(this, name, value);
	};

	// 3) 也拦截 classList.add/remove 对 root 的修改
	const rawAdd = DOMTokenList.prototype.add;
	const rawRemove = DOMTokenList.prototype.remove;
	DOMTokenList.prototype.add = function(...tokens: string[]) {
		try {
			const el = (this as any).ownerElement;
			if (el === doc.documentElement || el === doc.body) return;
		} catch {}
		return rawAdd.apply(this, tokens);
	};
	DOMTokenList.prototype.remove = function(...tokens: string[]) {
		try {
			const el = (this as any).ownerElement;
			if (el === doc.documentElement || el === doc.body) return;
		} catch {}
		return rawRemove.apply(this, tokens);
	};

	// 暴露清理函数
	(doc as any).__STYLE_LEAK_LOCK_RELEASE__ = () => {
		try {
			mo.disconnect();
		} catch {}
	};
}

export default {
	createRenderer,
	renderMessages,
	needsIframeRender,
	getContentType,
	lockIframeStyleLeak
};
