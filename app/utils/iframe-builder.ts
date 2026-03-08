/**
 * iframe 内容生成器
 * 参考: https://github.com/N0VI028/JS-Slash-Runner/src/panel/render/iframe.ts
 */

import { getTavernCompatScript } from './tavern-compat';

interface MacroContext {
  userName?: string;
  charName?: string;
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
  lastUserMessage?: string;
}

/**
 * 替换宏变量（在 iframe 内容中）
 * 支持 {{user}}, {{char}}, {{time}}, {{date}} 等
 */
export function replaceMacrosInContent(content: string, ctx: MacroContext = {}): string {
  if (!content || typeof content !== 'string') return content;

  const {
    userName = '用户',
    charName = '角色',
    userInfo = {},
    characterInfo = {},
    lastUserMessage = ''
  } = ctx;

  let result = content;

  // 基础宏替换
  result = result
    .replace(/\{\{user\}\}/gi, userName)
    .replace(/\{\{char\}\}/gi, charName)
    .replace(/\{\{User\}\}/g, userName)
    .replace(/\{\{Char\}\}/g, charName)
    .replace(/\{\{lastUserMessage\}\}/gi, lastUserMessage)
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
    .replace(/\{\{scenario\}\}/gi, characterInfo?.scenario || '')
    .replace(/\{\{char_name\}\}/gi, characterInfo?.name || charName)
    .replace(/\{\{user_name\}\}/gi, userInfo?.username || userName);

  // 处理 getvar 宏（简化版）
  result = result.replace(/\{\{getvar::([^}]+)\}\}/gi, () => {
    // 返回空字符串，实际变量由 iframe 内的脚本处理
    return '';
  });

  return result;
}

/**
 * 替换 vh 单位为 CSS 变量（解决 iframe 内 vh 计算问题）
 * 增强版：与 JS-Slash-Runner 的 replaceVhInContent 保持一致
 */
export function replaceVhUnits(content: string): string {
  if (!content) return content;

  // 检测是否需要处理
  const hasCssMinVh = /min-height\s*:\s*[^;{}]*\d+(?:\.\d+)?vh/gi.test(content);
  const hasInlineStyleVh = /style\s*=\s*(["'])[\s\S]*?min-height\s*:\s*[^;]*?\d+(?:\.\d+)?vh[\s\S]*?\1/gi.test(content);
  const hasJsVh =
    /(\.style\.minHeight\s*=\s*(["']))([\s\S]*?vh)(\2)/gi.test(content) ||
    /(setProperty\s*\(\s*(["'])min-height\2\s*,\s*(["']))([\s\S]*?vh)(\3\s*\))/gi.test(content);

  if (!hasCssMinVh && !hasInlineStyleVh && !hasJsVh) {
    return content;
  }

  const VARIABLE_EXPRESSION = 'var(--TH-viewport-height, 100vh)';

  const convertVhToVariable = (value: string): string => {
    return value.replace(/(\d+(?:\.\d+)?)vh\b/gi, (match, num) => {
      const parsed = parseFloat(num);
      if (!isFinite(parsed)) return match;
      if (parsed === 100) return VARIABLE_EXPRESSION;
      return `calc(${VARIABLE_EXPRESSION} * ${parsed / 100})`;
    });
  };

  // 1) CSS 声明块中: `min-height: ...vh`
  content = content.replace(
    /(min-height\s*:\s*)([^;{}]*?\d+(?:\.\d+)?vh)(?=\s*[;}])/gi,
    (_, prefix, value) => `${prefix}${convertVhToVariable(value)}`
  );

  // 2) 行内 style
  content = content.replace(
    /(style\s*=\s*(["']))([^"']*?)(\2)/gi,
    (match, prefix, quote, styleContent, suffix) => {
      if (!/min-height\s*:\s*[^;]*vh/i.test(styleContent)) return match;
      const replaced = styleContent.replace(
        /(min-height\s*:\s*)([^;]*?\d+(?:\.\d+)?vh)/gi,
        (_: string, p1: string, p2: string) => `${p1}${convertVhToVariable(p2)}`
      );
      return `${prefix}${replaced}${suffix}`;
    }
  );

  // 3) JavaScript: `element.style.minHeight = "...vh"`
  content = content.replace(
    /(\.style\.minHeight\s*=\s*(["']))([\s\S]*?)(\2)/gi,
    (match, prefix, _q, val, suffix) => {
      if (!/\b\d+(?:\.\d+)?vh\b/i.test(val)) return match;
      return `${prefix}${convertVhToVariable(val)}${suffix}`;
    }
  );

  // 4) JavaScript: `element.style.setProperty('min-height', "...vh")`
  content = content.replace(
    /(setProperty\s*\(\s*(["'])min-height\2\s*,\s*(["']))([\s\S]*?)(\3\s*\))/gi,
    (match, prefix, _q1, _q2, val, suffix) => {
      if (!/\b\d+(?:\.\d+)?vh\b/i.test(val)) return match;
      return `${prefix}${convertVhToVariable(val)}${suffix}`;
    }
  );

  return content;
}

/**
 * 获取用户头像路径
 */
export function getUserAvatarPath(userInfo?: { avatar?: string }): string {
  return userInfo?.avatar || '/static/images/default-avatar.png';
}

/**
 * 获取角色头像路径
 */
export function getCharAvatarPath(characterInfo?: { avatar?: string; image?: string }): string {
  return characterInfo?.avatar || characterInfo?.image || '/static/images/default-char.png';
}

/**
 * 创建视口高度更新脚本
 * 与 JS-Slash-Runner 的 adjust_viewport.js 保持一致
 */
export function getViewportScript(): string {
  return `<script>
(function(){
  var style = document.documentElement.style;

  function updateViewportHeight() {
    var vh = window.innerHeight;
    style.setProperty('--TH-viewport-height', vh + 'px');
    style.setProperty('--viewport-height', vh + 'px');
  }

  updateViewportHeight();
  window.addEventListener('resize', updateViewportHeight);

  // 监听父窗口消息
  window.addEventListener('message', function(e) {
    if (e.data && (e.data.type === 'TH_UPDATE_VIEWPORT_HEIGHT' || e.data.type === 'update-viewport-height')) {
      updateViewportHeight();
    }
  });
})();
<\/script>`;
}

/**
 * 创建 iframe 高度自适应脚本
 * 与 JS-Slash-Runner 的 adjust_iframe_height.js 保持一致
 */
export function getHeightAdjustScript(): string {
  return `<script>
(function(){
  var scheduled = false;
  var lastHeight = 0;

  function measureAndPost() {
    scheduled = false;
    try {
      var body = document.body;
      var html = document.documentElement;
      if (!body || !html) return;

      var height = Math.max(
        body.scrollHeight || 0,
        body.offsetHeight || 0,
        html.scrollHeight || 0,
        html.offsetHeight || 0
      );

      if (!Number.isFinite(height) || height <= 0) return;
      if (height === lastHeight) return;
      lastHeight = height;

      // 直接设置 frameElement 高度
      if (window.frameElement) {
        window.frameElement.style.height = height + 'px';
      }

      // 同时通知父窗口
      window.parent.postMessage({
        type: 'iframe-height',
        height: height
      }, '*');
    } catch(e) {}
  }

  function postHeight() {
    if (scheduled) return;
    scheduled = true;
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(measureAndPost);
    } else {
      setTimeout(measureAndPost, 16);
    }
  }

  // 监听内容变化
  function observeChanges() {
    var body = document.body;
    if (!body) return;

    // ResizeObserver
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(postHeight).observe(body);
      new ResizeObserver(postHeight).observe(document.documentElement);
    }

    // MutationObserver
    new MutationObserver(postHeight).observe(body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
  }

  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      postHeight();
      observeChanges();
    });
  } else {
    postHeight();
    observeChanges();
  }

  // 图片/媒体加载后重新计算
  document.addEventListener('load', postHeight, true);

  // 窗口大小变化
  window.addEventListener('resize', postHeight);

  // 定时检查（兜底）
  setInterval(postHeight, 500);
})();
<\/script>`;
}

/**
 * 获取第三方库脚本
 * 与 JS-Slash-Runner 的 third_party_message.html 类似
 */
export function getThirdPartyScripts(): string {
  return `
<!-- 第三方库（同步加载） -->
<script src="https://cdn.jsdelivr.net/npm/vue@3.4.21/dist/vue.global.prod.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js"><\/script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.css">
<script>
// 确保 $ 和 toastr 可用
if(typeof jQuery!=="undefined"&&typeof window.$==="undefined"){window.$=jQuery}
if(typeof toastr==="undefined"){
  window.toastr={success:function(){},error:function(){},warning:function(){},info:function(){},clear:function(){},remove:function(){}};
}

// ============ 强制包装 js-yaml，确保不抛出异常 ============
(function(){
  // 如果 jsyaml 存在且未被包装，立即包装它
  if(typeof jsyaml!=='undefined'&&!jsyaml.__forceWrapped__){
    var _orig=jsyaml.load;
    var _origSafe=jsyaml.safeLoad;
    jsyaml.__forceWrapped__=true;

    jsyaml.load=function(str,opts){
      try{
        var processed=str?String(str).replace(/\\t/g,'  '):'';
        return _orig.call(jsyaml,processed,opts)||{};
      }catch(e){
        console.warn('[jsyaml.load] fallback to __safeYamlParse:',e.message);
        // 回退到宽松解析器
        if(typeof window.__safeYamlParse==='function'){
          return window.__safeYamlParse(str)||{};
        }
        return {};
      }
    };

    if(_origSafe){
      jsyaml.safeLoad=function(str,opts){
        try{
          var processed=str?String(str).replace(/\\t/g,'  '):'';
          return _origSafe.call(jsyaml,processed,opts)||{};
        }catch(e){
          console.warn('[jsyaml.safeLoad] fallback to __safeYamlParse:',e.message);
          // 回退到宽松解析器
          if(typeof window.__safeYamlParse==='function'){
            return window.__safeYamlParse(str)||{};
          }
          return {};
        }
      };
    }
    console.log('[jsyaml] force wrapped with fallback');
  }

  // 确保 YAML 对象可用且不抛出异常
  window.YAML={
    parse:function(str,opts){
      try{
        if(typeof jsyaml!=='undefined'&&jsyaml.load){
          return jsyaml.load(str,opts)||{};
        }
        // 回退到宽松解析器
        if(typeof window.__safeYamlParse==='function'){
          return window.__safeYamlParse(str)||{};
        }
        if(str&&(str.trim().charAt(0)==='{'||str.trim().charAt(0)==='[')){
          return JSON.parse(str);
        }
        return {};
      }catch(e){
        console.warn('[YAML.parse] error:',e.message);
        // 最后尝试宽松解析器
        if(typeof window.__safeYamlParse==='function'){
          return window.__safeYamlParse(str)||{};
        }
        return {};
      }
    },
    stringify:function(obj,opts){
      try{
        if(typeof jsyaml!=='undefined'&&jsyaml.dump){
          return jsyaml.dump(obj,opts);
        }
        return JSON.stringify(obj,null,2);
      }catch(e){
        return JSON.stringify(obj,null,2);
      }
    },
    load:function(str,opts){return this.parse(str,opts)},
    dump:function(obj,opts){return this.stringify(obj,opts)},
    safeLoad:function(str,opts){return this.parse(str,opts)}
  };
  console.log('[YAML] ready with fallback');
})();
<\/script>
`;
}

interface IframeContentOptions {
  userInfo?: MacroContext['userInfo'];
  characterInfo?: MacroContext['characterInfo'];
  useBlobUrl?: boolean;
  baseUrl?: string;
  messageId?: string;
  includeThirdParty?: boolean;
  userName?: string;
  charName?: string;
  lastUserMessage?: string;
}

/**
 * 创建完整的 iframe HTML 文档
 * 增强版：添加更多兼容性支持
 */
export function createIframeContent(bodyContent: string, options: IframeContentOptions = {}): string {
  const {
    userInfo = {},
    characterInfo = {},
    useBlobUrl = false,
    baseUrl = '',
    messageId = '',
    includeThirdParty = true,
    userName = '',
    charName = '',
    lastUserMessage = ''
  } = options;

  // 0. 全局预处理：将所有 tab 替换为空格
  // 这是解决 YAML 解析错误的最可靠方法
  // YAML 规范不允许使用 tab 作为缩进，但很多角色卡的 YAML 内容使用了 tab
  let yamlProcessedContent = (bodyContent || '').replace(/\t/g, '  ');

  // 注意：不再在这里预检测 YAML 格式错误
  // 让 iframe 内的 YAML 兼容层（tavern-compat）自己处理错误
  // 这样可以保留原始数据，让兼容层有机会用宽松解析器解析

  // 1. 先进行宏变量替换
  const macroReplacedContent = replaceMacrosInContent(yamlProcessedContent, {
    userName: userName || userInfo?.username || '用户',
    charName: charName || characterInfo?.name || '角色',
    userInfo,
    characterInfo,
    lastUserMessage
  });

  // 2. 处理 vh 单位
  const processedContent = replaceVhUnits(macroReplacedContent);

  // 获取兼容层脚本
  const compatScript = getTavernCompatScript();

  // 获取高度和视口脚本
  const viewportScript = getViewportScript();
  const heightScript = getHeightAdjustScript();

  // 第三方库
  const thirdPartyScripts = includeThirdParty ? getThirdPartyScripts() : '';

  const userAvatar = getUserAvatarPath(userInfo);
  const charAvatar = getCharAvatarPath(characterInfo);

  // 生成 iframe 名称
  const iframeName = messageId ? `TH-message--${messageId}` : `TH-iframe-${Date.now()}`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
${useBlobUrl && baseUrl ? `<base href="${baseUrl}"/>` : ''}
<style>
/* 基础重置 - 与 JS-Slash-Runner 保持一致 */
*, *::before, *::after { box-sizing: border-box; }
html, body {
  margin: 0 !important;
  padding: 0 !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  max-width: 100% !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  background: transparent;
}

/* 媒体元素响应式 */
img, video, canvas, svg {
  max-width: 100% !important;
  height: auto !important;
}

/* 头像背景类 */
.user_avatar, .user-avatar {
  background-image: url('${userAvatar}');
  background-size: cover;
  background-position: center;
}
.char_avatar, .char-avatar {
  background-image: url('${charAvatar}');
  background-size: cover;
  background-position: center;
}

/* 响应式布局强制 */
.flex, .flexbox, [class*="flex"], [style*="flex"] { flex-wrap: wrap !important; }
.grid, [class*="grid"], [style*="grid"] { grid-template-columns: 1fr !important; }
[style*="display:flex"], [style*="display: flex"] { flex-direction: column !important; flex-wrap: wrap !important; }
[style*="flex-direction:row"], [style*="flex-direction: row"] { flex-direction: column !important; }
.flex>*, .flexbox>*, [class*="flex"]>*, [style*="flex"]>* { flex: 1 1 100% !important; min-width: 0 !important; max-width: 100% !important; }
[style*="width:50%"], [style*="width: 50%"], [style*="width:48%"], [style*="width: 48%"] { width: 100% !important; }

/* 滚动条美化 */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.3); }

/* 链接样式 */
a { color: #5E5B9D; text-decoration: none; }
a:hover { text-decoration: underline; }

/* 代码块样式 */
pre, code {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', Consolas, monospace;
  font-size: 13px;
}
pre {
  background: rgba(0,0,0,0.03);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
code {
  background: rgba(0,0,0,0.05);
  padding: 2px 6px;
  border-radius: 4px;
}
pre code {
  background: none;
  padding: 0;
}

/* 表格样式 */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}
th, td {
  border: 1px solid rgba(0,0,0,0.1);
  padding: 8px 12px;
  text-align: left;
}
th {
  background: rgba(0,0,0,0.03);
  font-weight: 600;
}

/* 按钮基础样式 */
button {
  cursor: pointer;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  transition: all 0.2s ease;
}
button:hover {
  opacity: 0.9;
}
button:active {
  transform: scale(0.98);
}
</style>
${compatScript}
${thirdPartyScripts}
${viewportScript}
${heightScript}
<script>
// 设置 iframe 名称供脚本使用
window.__TH_IFRAME_ID = '${iframeName}';
window.name = '${iframeName}';
</script>
</head>
<body>
${processedContent}
</body>
</html>`;
}

export default {
  replaceMacrosInContent,
  replaceVhUnits,
  getUserAvatarPath,
  getCharAvatarPath,
  getViewportScript,
  getHeightAdjustScript,
  getThirdPartyScripts,
  createIframeContent
};
