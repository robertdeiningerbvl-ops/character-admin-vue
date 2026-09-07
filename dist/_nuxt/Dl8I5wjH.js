import{A as e,B as t,Ct as n,Gt as r,It as i,Jt as a,L as o,M as s,N as c,P as l,R as u,T as d,X as f,Xt as p,Zt as m,at as h,ct as ee,j as g}from"./mOr3sFYW.js";import{b as _,t as te,y as ne}from"./CFc5-kgw.js";import{t as v}from"./BDNMzG2s.js";function y(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var b=y();function x(e){b=e}var S={exec:()=>null};function C(e,t=``){let n=typeof e==`string`?e:e.source,r={replace:(e,t)=>{let i=typeof t==`string`?t:t.source;return i=i.replace(w.caret,`$1`),n=n.replace(e,i),r},getRegex:()=>new RegExp(n,t)};return r}var re=(()=>{try{return!0}catch{return!1}})(),w={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,`i`),blockquoteBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}>`)},T=/^(?:[ \t]*(?:\n|$))+/,E=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,ie=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,D=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ae=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,O=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,oe=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,se=C(oe).replace(/bull/g,O).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,``).getRegex(),ce=C(oe).replace(/bull/g,O).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),le=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,ue=/^[^\n]+/,de=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,fe=C(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace(`label`,de).replace(`title`,/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),pe=C(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,O).getRegex(),k=`address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul`,A=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,me=C(`^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))`,`i`).replace(`comment`,A).replace(`tag`,k).replace(`attribute`,/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),he=C(le).replace(`hr`,D).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)])[ \\t]`).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,k).getRegex(),ge={blockquote:C(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace(`paragraph`,he).getRegex(),code:E,def:fe,fences:ie,heading:ae,hr:D,html:me,lheading:se,list:pe,newline:T,paragraph:he,table:S,text:ue},_e=C(`^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)`).replace(`hr`,D).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`blockquote`,` {0,3}>`).replace(`code`,`(?: {4}| {0,3}	)[^\\n]`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)])[ \\t]`).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,k).getRegex(),ve={...ge,lheading:ce,table:_e,paragraph:C(le).replace(`hr`,D).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`table`,_e).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)])[ \\t]`).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,k).getRegex()},ye={...ge,html:C(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace(`comment`,A).replace(/tag/g,`(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b`).getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:S,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:C(le).replace(`hr`,D).replace(`heading`,` *#{1,6} *[^
]`).replace(`lheading`,se).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`|fences`,``).replace(`|list`,``).replace(`|html`,``).replace(`|tag`,``).getRegex()},be=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,xe=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Se=/^( {2,}|\\)\n(?!\s*$)/,Ce=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,j=/[\p{P}\p{S}]/u,M=/[\s\p{P}\p{S}]/u,N=/[^\s\p{P}\p{S}]/u,we=C(/^((?![*_])punctSpace)/,`u`).replace(/punctSpace/g,M).getRegex(),Te=/(?!~)[\p{P}\p{S}]/u,Ee=/(?!~)[\s\p{P}\p{S}]/u,De=/(?:[^\s\p{P}\p{S}]|~)/u,Oe=C(/link|precode-code|html/,`g`).replace(`link`,/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace(`precode-`,re?"(?<!`)()":"(^^|[^`])").replace(`code`,/(?<b>`+)[^`]+\k<b>(?!`)/).replace(`html`,/<(?! )[^<>]*?>/).getRegex(),ke=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Ae=C(ke,`u`).replace(/punct/g,j).getRegex(),je=C(ke,`u`).replace(/punct/g,Te).getRegex(),Me=`^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)`,Ne=C(Me,`gu`).replace(/notPunctSpace/g,N).replace(/punctSpace/g,M).replace(/punct/g,j).getRegex(),Pe=C(Me,`gu`).replace(/notPunctSpace/g,De).replace(/punctSpace/g,Ee).replace(/punct/g,Te).getRegex(),Fe=C(`^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)`,`gu`).replace(/notPunctSpace/g,N).replace(/punctSpace/g,M).replace(/punct/g,j).getRegex(),Ie=C(/^~~?(?:((?!~)punct)|[^\s~])/,`u`).replace(/punct/g,j).getRegex(),Le=C(`^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)`,`gu`).replace(/notPunctSpace/g,N).replace(/punctSpace/g,M).replace(/punct/g,j).getRegex(),Re=C(/\\(punct)/,`gu`).replace(/punct/g,j).getRegex(),ze=C(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace(`scheme`,/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace(`email`,/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Be=C(A).replace(`(?:-->|$)`,`-->`).getRegex(),Ve=C(`^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>`).replace(`comment`,Be).replace(`attribute`,/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),P=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,He=C(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace(`label`,P).replace(`href`,/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace(`title`,/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Ue=C(/^!?\[(label)\]\[(ref)\]/).replace(`label`,P).replace(`ref`,de).getRegex(),We=C(/^!?\[(ref)\](?:\[\])?/).replace(`ref`,de).getRegex(),Ge=C(`reflink|nolink(?!\\()`,`g`).replace(`reflink`,Ue).replace(`nolink`,We).getRegex(),Ke=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,F={_backpedal:S,anyPunctuation:Re,autolink:ze,blockSkip:Oe,br:Se,code:xe,del:S,delLDelim:S,delRDelim:S,emStrongLDelim:Ae,emStrongRDelimAst:Ne,emStrongRDelimUnd:Fe,escape:be,link:He,nolink:We,punctuation:we,reflink:Ue,reflinkSearch:Ge,tag:Ve,text:Ce,url:S},qe={...F,link:C(/^!?\[(label)\]\((.*?)\)/).replace(`label`,P).getRegex(),reflink:C(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace(`label`,P).getRegex()},I={...F,emStrongRDelimAst:Pe,emStrongLDelim:je,delLDelim:Ie,delRDelim:Le,url:C(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace(`protocol`,Ke).replace(`email`,/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:C(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace(`protocol`,Ke).getRegex()},Je={...I,br:C(Se).replace(`{2,}`,`*`).getRegex(),text:C(I.text).replace(`\\b_`,`\\b_| {2,}\\n`).replace(/\{2,\}/g,`*`).getRegex()},L={normal:ge,gfm:ve,pedantic:ye},R={normal:F,gfm:I,breaks:Je,pedantic:qe},Ye={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`},Xe=e=>Ye[e];function z(e,t){if(t){if(w.escapeTest.test(e))return e.replace(w.escapeReplace,Xe)}else if(w.escapeTestNoEncode.test(e))return e.replace(w.escapeReplaceNoEncode,Xe);return e}function Ze(e){try{e=encodeURI(e).replace(w.percentDecode,`%`)}catch{return null}return e}function Qe(e,t){let n=e.replace(w.findPipe,(e,t,n)=>{let r=!1,i=t;for(;--i>=0&&n[i]===`\\`;)r=!r;return r?`|`:` |`}).split(w.splitPipe),r=0;if(n[0].trim()||n.shift(),n.length>0&&!n.at(-1)?.trim()&&n.pop(),t){if(n.length>t)n.splice(t);else for(;n.length<t;)n.push(``)}for(;r<n.length;r++)n[r]=n[r].trim().replace(w.slashPipe,`|`);return n}function B(e,t,n){let r=e.length;if(r===0)return``;let i=0;for(;i<r;){let a=e.charAt(r-i-1);if(a===t&&!n)i++;else if(a!==t&&n)i++;else break}return e.slice(0,r-i)}function $e(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let r=0;r<e.length;r++)if(e[r]===`\\`)r++;else if(e[r]===t[0])n++;else if(e[r]===t[1]&&(n--,n<0))return r;return n>0?-2:-1}function et(e,t=0){let n=t,r=``;for(let t of e)if(t===`	`){let e=4-n%4;r+=` `.repeat(e),n+=e}else r+=t,n++;return r}function tt(e,t,n,r,i){let a=t.href,o=t.title||null,s=e[1].replace(i.other.outputLinkReplace,`$1`);r.state.inLink=!0;let c={type:e[0].charAt(0)===`!`?`image`:`link`,raw:n,href:a,title:o,text:s,tokens:r.inlineTokens(s)};return r.state.inLink=!1,c}function nt(e,t,n){let r=e.match(n.other.indentCodeCompensation);if(r===null)return t;let i=r[1];return t.split(`
`).map(e=>{let t=e.match(n.other.beginningSpace);if(t===null)return e;let[r]=t;return r.length>=i.length?e.slice(i.length):e}).join(`
`)}var V=class{options;rules;lexer;constructor(e){this.options=e||b}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:`space`,raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let e=t[0].replace(this.rules.other.codeRemoveIndent,``);return{type:`code`,raw:t[0],codeBlockStyle:`indented`,text:this.options.pedantic?e:B(e,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let e=t[0],n=nt(e,t[3]||``,this.rules);return{type:`code`,raw:e,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,`$1`):t[2],text:n}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let e=t[2].trim();if(this.rules.other.endingHash.test(e)){let t=B(e,`#`);(this.options.pedantic||!t||this.rules.other.endingSpaceChar.test(t))&&(e=t.trim())}return{type:`heading`,raw:t[0],depth:t[1].length,text:e,tokens:this.lexer.inline(e)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:`hr`,raw:B(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let e=B(t[0],`
`).split(`
`),n=``,r=``,i=[];for(;e.length>0;){let t=!1,a=[],o;for(o=0;o<e.length;o++)if(this.rules.other.blockquoteStart.test(e[o]))a.push(e[o]),t=!0;else if(!t)a.push(e[o]);else break;e=e.slice(o);let s=a.join(`
`),c=s.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,``);n=n?`${n}
${s}`:s,r=r?`${r}
${c}`:c;let l=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,i,!0),this.lexer.state.top=l,e.length===0)break;let u=i.at(-1);if(u?.type===`code`)break;if(u?.type===`blockquote`){let t=u,a=t.raw+`
`+e.join(`
`),o=this.blockquote(a);i[i.length-1]=o,n=n.substring(0,n.length-t.raw.length)+o.raw,r=r.substring(0,r.length-t.text.length)+o.text;break}if(u?.type===`list`){let t=u,a=t.raw+`
`+e.join(`
`),o=this.list(a);i[i.length-1]=o,n=n.substring(0,n.length-u.raw.length)+o.raw,r=r.substring(0,r.length-t.raw.length)+o.raw,e=a.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:`blockquote`,raw:n,tokens:i,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),r=n.length>1,i={type:`list`,raw:``,ordered:r,start:r?+n.slice(0,-1):``,loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:`[*+-]`);let a=this.rules.other.listItemRegex(n),o=!1;for(;e;){let n=!1,r=``,s=``;if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;r=t[0],e=e.substring(r.length);let c=et(t[2].split(`
`,1)[0],t[1].length),l=e.split(`
`,1)[0],u=!c.trim(),d=0;if(this.options.pedantic?(d=2,s=c.trimStart()):u?d=t[1].length+1:(d=c.search(this.rules.other.nonSpaceChar),d=d>4?1:d,s=c.slice(d),d+=t[1].length),u&&this.rules.other.blankLine.test(l)&&(r+=l+`
`,e=e.substring(l.length+1),n=!0),!n){let t=this.rules.other.nextBulletRegex(d),n=this.rules.other.hrRegex(d),i=this.rules.other.fencesBeginRegex(d),a=this.rules.other.headingBeginRegex(d),o=this.rules.other.htmlBeginRegex(d),f=this.rules.other.blockquoteBeginRegex(d);for(;e;){let p=e.split(`
`,1)[0],m;if(l=p,this.options.pedantic?(l=l.replace(this.rules.other.listReplaceNesting,`  `),m=l):m=l.replace(this.rules.other.tabCharGlobal,`    `),i.test(l)||a.test(l)||o.test(l)||f.test(l)||t.test(l)||n.test(l))break;if(m.search(this.rules.other.nonSpaceChar)>=d||!l.trim())s+=`
`+m.slice(d);else{if(u||c.replace(this.rules.other.tabCharGlobal,`    `).search(this.rules.other.nonSpaceChar)>=4||i.test(c)||a.test(c)||n.test(c))break;s+=`
`+l}u=!l.trim(),r+=p+`
`,e=e.substring(p.length+1),c=m.slice(d)}}i.loose||(o?i.loose=!0:this.rules.other.doubleBlankLine.test(r)&&(o=!0)),i.items.push({type:`list_item`,raw:r,task:!!this.options.gfm&&this.rules.other.listIsTask.test(s),loose:!1,text:s,tokens:[]}),i.raw+=r}let s=i.items.at(-1);if(s)s.raw=s.raw.trimEnd(),s.text=s.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let e of i.items){if(this.lexer.state.top=!1,e.tokens=this.lexer.blockTokens(e.text,[]),e.task){if(e.text=e.text.replace(this.rules.other.listReplaceTask,``),e.tokens[0]?.type===`text`||e.tokens[0]?.type===`paragraph`){e.tokens[0].raw=e.tokens[0].raw.replace(this.rules.other.listReplaceTask,``),e.tokens[0].text=e.tokens[0].text.replace(this.rules.other.listReplaceTask,``);for(let e=this.lexer.inlineQueue.length-1;e>=0;e--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[e].src)){this.lexer.inlineQueue[e].src=this.lexer.inlineQueue[e].src.replace(this.rules.other.listReplaceTask,``);break}}let t=this.rules.other.listTaskCheckbox.exec(e.raw);if(t){let n={type:`checkbox`,raw:t[0]+` `,checked:t[0]!==`[ ]`};e.checked=n.checked,i.loose?e.tokens[0]&&[`paragraph`,`text`].includes(e.tokens[0].type)&&`tokens`in e.tokens[0]&&e.tokens[0].tokens?(e.tokens[0].raw=n.raw+e.tokens[0].raw,e.tokens[0].text=n.raw+e.tokens[0].text,e.tokens[0].tokens.unshift(n)):e.tokens.unshift({type:`paragraph`,raw:n.raw,text:n.raw,tokens:[n]}):e.tokens.unshift(n)}}if(!i.loose){let t=e.tokens.filter(e=>e.type===`space`);i.loose=t.length>0&&t.some(e=>this.rules.other.anyLine.test(e.raw))}}if(i.loose)for(let e of i.items){e.loose=!0;for(let t of e.tokens)t.type===`text`&&(t.type=`paragraph`)}return i}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:`html`,block:!0,raw:t[0],pre:t[1]===`pre`||t[1]===`script`||t[1]===`style`,text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let e=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal,` `),n=t[2]?t[2].replace(this.rules.other.hrefBrackets,`$1`).replace(this.rules.inline.anyPunctuation,`$1`):``,r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,`$1`):t[3];return{type:`def`,tag:e,raw:t[0],href:n,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Qe(t[1]),r=t[2].replace(this.rules.other.tableAlignChars,``).split(`|`),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,``).split(`
`):[],a={type:`table`,raw:t[0],header:[],align:[],rows:[]};if(n.length===r.length){for(let e of r)this.rules.other.tableAlignRight.test(e)?a.align.push(`right`):this.rules.other.tableAlignCenter.test(e)?a.align.push(`center`):this.rules.other.tableAlignLeft.test(e)?a.align.push(`left`):a.align.push(null);for(let e=0;e<n.length;e++)a.header.push({text:n[e],tokens:this.lexer.inline(n[e]),header:!0,align:a.align[e]});for(let e of i)a.rows.push(Qe(e,a.header.length).map((e,t)=>({text:e,tokens:this.lexer.inline(e),header:!1,align:a.align[t]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t){let e=t[1].trim();return{type:`heading`,raw:t[0],depth:t[2].charAt(0)===`=`?1:2,text:e,tokens:this.lexer.inline(e)}}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let e=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:`paragraph`,raw:t[0],text:e,tokens:this.lexer.inline(e)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:`text`,raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:`escape`,raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:`html`,raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let e=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(e)){if(!this.rules.other.endAngleBracket.test(e))return;let t=B(e.slice(0,-1),`\\`);if((e.length-t.length)%2==0)return}else{let e=$e(t[2],`()`);if(e===-2)return;if(e>-1){let n=(t[0].indexOf(`!`)===0?5:4)+t[1].length+e;t[2]=t[2].substring(0,e),t[0]=t[0].substring(0,n).trim(),t[3]=``}}let n=t[2],r=``;if(this.options.pedantic){let e=this.rules.other.pedanticHrefTitle.exec(n);e&&(n=e[1],r=e[3])}else r=t[3]?t[3].slice(1,-1):``;return n=n.trim(),this.rules.other.startAngleBracket.test(n)&&(n=this.options.pedantic&&!this.rules.other.endAngleBracket.test(e)?n.slice(1):n.slice(1,-1)),tt(t,{href:n&&n.replace(this.rules.inline.anyPunctuation,`$1`),title:r&&r.replace(this.rules.inline.anyPunctuation,`$1`)},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let e=t[(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal,` `).toLowerCase()];if(!e){let e=n[0].charAt(0);return{type:`text`,raw:e,text:e}}return tt(n,e,n[0],this.lexer,this.rules)}}emStrong(e,t,n=``){let r=this.rules.inline.emStrongLDelim.exec(e);if(!(!r||!r[1]&&!r[2]&&!r[3]&&!r[4]||r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[3])||!n||this.rules.inline.punctuation.exec(n))){let n=[...r[0]].length-1,i,a,o=n,s=0,c=r[0][0]===`*`?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,t=t.slice(-1*e.length+n);(r=c.exec(t))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i)continue;if(a=[...i].length,r[3]||r[4]){o+=a;continue}if((r[5]||r[6])&&n%3&&!((n+a)%3)){s+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o+s);let t=[...r[0]][0].length,c=e.slice(0,n+r.index+t+a);if(Math.min(n,a)%2){let e=c.slice(1,-1);return{type:`em`,raw:c,text:e,tokens:this.lexer.inlineTokens(e)}}let l=c.slice(2,-2);return{type:`strong`,raw:c,text:l,tokens:this.lexer.inlineTokens(l)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let e=t[2].replace(this.rules.other.newLineCharGlobal,` `),n=this.rules.other.nonSpaceChar.test(e),r=this.rules.other.startingSpaceChar.test(e)&&this.rules.other.endingSpaceChar.test(e);return n&&r&&(e=e.substring(1,e.length-1)),{type:`codespan`,raw:t[0],text:e}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:`br`,raw:t[0]}}del(e,t,n=``){let r=this.rules.inline.delLDelim.exec(e);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let n=[...r[0]].length-1,i,a,o=n,s=this.rules.inline.delRDelim;for(s.lastIndex=0,t=t.slice(-1*e.length+n);(r=s.exec(t))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i||(a=[...i].length,a!==n))continue;if(r[3]||r[4]){o+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o);let t=[...r[0]][0].length,s=e.slice(0,n+r.index+t+a),c=s.slice(n,-n);return{type:`del`,raw:s,text:c,tokens:this.lexer.inlineTokens(c)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let e,n;return t[2]===`@`?(e=t[1],n=`mailto:`+e):(e=t[1],n=e),{type:`link`,raw:t[0],text:e,href:n,tokens:[{type:`text`,raw:e,text:e}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let e,n;if(t[2]===`@`)e=t[0],n=`mailto:`+e;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??``;while(r!==t[0]);e=t[0],n=t[1]===`www.`?`http://`+t[0]:t[0]}return{type:`link`,raw:t[0],text:e,href:n,tokens:[{type:`text`,raw:e,text:e}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let e=this.lexer.state.inRawBlock;return{type:`text`,raw:t[0],text:t[0],escaped:e}}}},H=class e{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||b,this.options.tokenizer=this.options.tokenizer||new V,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={other:w,block:L.normal,inline:R.normal};this.options.pedantic?(t.block=L.pedantic,t.inline=R.pedantic):this.options.gfm&&(t.block=L.gfm,t.inline=this.options.breaks?R.breaks:R.gfm),this.tokenizer.rules=t}static get rules(){return{block:L,inline:R}}static lex(t,n){return new e(n).lex(t)}static lexInline(t,n){return new e(n).inlineTokens(t)}lex(e){e=e.replace(w.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let e=0;e<this.inlineQueue.length;e++){let t=this.inlineQueue[e];this.inlineTokens(t.src,t.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=!1){for(this.tokenizer.lexer=this,this.options.pedantic&&(e=e.replace(w.tabCharGlobal,`    `).replace(w.spaceLine,``));e;){let r;if(this.options.extensions?.block?.some(n=>(r=n.call({lexer:this},e,t))?(e=e.substring(r.raw.length),t.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let n=t.at(-1);r.raw.length===1&&n!==void 0?n.raw+=`
`:t.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let n=t.at(-1);n?.type===`paragraph`||n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+r.raw,n.text+=`
`+r.text,this.inlineQueue.at(-1).src=n.text):t.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let n=t.at(-1);n?.type===`paragraph`||n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+r.raw,n.text+=`
`+r.raw,this.inlineQueue.at(-1).src=n.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},t.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),t.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let t=1/0,n=e.slice(1),r;this.options.extensions.startBlock.forEach(e=>{r=e.call({lexer:this},n),typeof r==`number`&&r>=0&&(t=Math.min(t,r))}),t<1/0&&t>=0&&(i=e.substring(0,t+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let a=t.at(-1);n&&a?.type===`paragraph`?(a.raw+=(a.raw.endsWith(`
`)?``:`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):t.push(r),n=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let n=t.at(-1);n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+r.raw,n.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=n.text):t.push(r);continue}if(e){let t=`Infinite loop on byte: `+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw Error(t)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){this.tokenizer.lexer=this;let n=e,r=null;if(this.tokens.links){let e=Object.keys(this.tokens.links);if(e.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(n))!==null;)e.includes(r[0].slice(r[0].lastIndexOf(`[`)+1,-1))&&(n=n.slice(0,r.index)+`[`+`a`.repeat(r[0].length-2)+`]`+n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(n))!==null;)n=n.slice(0,r.index)+`++`+n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(n))!==null;)i=r[2]?r[2].length:0,n=n.slice(0,r.index+i)+`[`+`a`.repeat(r[0].length-i-2)+`]`+n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);n=this.options.hooks?.emStrongMask?.call({lexer:this},n)??n;let a=!1,o=``;for(;e;){a||(o=``),a=!1;let r;if(this.options.extensions?.inline?.some(n=>(r=n.call({lexer:this},e,t))?(e=e.substring(r.raw.length),t.push(r),!0):!1))continue;if(r=this.tokenizer.escape(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.tag(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.link(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(r.raw.length);let n=t.at(-1);r.type===`text`&&n?.type===`text`?(n.raw+=r.raw,n.text+=r.text):t.push(r);continue}if(r=this.tokenizer.emStrong(e,n,o)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.codespan(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.br(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.del(e,n,o)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.autolink(e)){e=e.substring(r.raw.length),t.push(r);continue}if(!this.state.inLink&&(r=this.tokenizer.url(e))){e=e.substring(r.raw.length),t.push(r);continue}let i=e;if(this.options.extensions?.startInline){let t=1/0,n=e.slice(1),r;this.options.extensions.startInline.forEach(e=>{r=e.call({lexer:this},n),typeof r==`number`&&r>=0&&(t=Math.min(t,r))}),t<1/0&&t>=0&&(i=e.substring(0,t+1))}if(r=this.tokenizer.inlineText(i)){e=e.substring(r.raw.length),r.raw.slice(-1)!==`_`&&(o=r.raw.slice(-1)),a=!0;let n=t.at(-1);n?.type===`text`?(n.raw+=r.raw,n.text+=r.text):t.push(r);continue}if(e){let t=`Infinite loop on byte: `+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw Error(t)}}return t}},U=class{options;parser;constructor(e){this.options=e||b}space(e){return``}code({text:e,lang:t,escaped:n}){let r=(t||``).match(w.notSpaceStart)?.[0],i=e.replace(w.endingNewline,``)+`
`;return r?`<pre><code class="language-`+z(r)+`">`+(n?i:z(i,!0))+`</code></pre>
`:`<pre><code>`+(n?i:z(i,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return``}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,r=``;for(let t=0;t<e.items.length;t++){let n=e.items[t];r+=this.listitem(n)}let i=t?`ol`:`ul`,a=t&&n!==1?` start="`+n+`"`:``;return`<`+i+a+`>
`+r+`</`+i+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return`<input `+(e?`checked="" `:``)+`disabled="" type="checkbox"> `}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t=``,n=``;for(let t=0;t<e.header.length;t++)n+=this.tablecell(e.header[t]);t+=this.tablerow({text:n});let r=``;for(let t=0;t<e.rows.length;t++){let i=e.rows[t];n=``;for(let e=0;e<i.length;e++)n+=this.tablecell(i[e]);r+=this.tablerow({text:n})}return r&&=`<tbody>${r}</tbody>`,`<table>
<thead>
`+t+`</thead>
`+r+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?`th`:`td`;return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${z(e,!0)}</code>`}br(e){return`<br>`}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let r=this.parser.parseInline(n),i=Ze(e);if(i===null)return r;e=i;let a=`<a href="`+e+`"`;return t&&(a+=` title="`+z(t)+`"`),a+=`>`+r+`</a>`,a}image({href:e,title:t,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let i=Ze(e);if(i===null)return z(n);e=i;let a=`<img src="${e}" alt="${z(n)}"`;return t&&(a+=` title="${z(t)}"`),a+=`>`,a}text(e){return`tokens`in e&&e.tokens?this.parser.parseInline(e.tokens):`escaped`in e&&e.escaped?e.text:z(e.text)}},rt=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return``+e}image({text:e}){return``+e}br(){return``}checkbox({raw:e}){return e}},W=class e{options;renderer;textRenderer;constructor(e){this.options=e||b,this.options.renderer=this.options.renderer||new U,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new rt}static parse(t,n){return new e(n).parse(t)}static parseInline(t,n){return new e(n).parseInline(t)}parse(e){this.renderer.parser=this;let t=``;for(let n=0;n<e.length;n++){let r=e[n];if(this.options.extensions?.renderers?.[r.type]){let e=r,n=this.options.extensions.renderers[e.type].call({parser:this},e);if(n!==!1||![`space`,`hr`,`heading`,`code`,`table`,`blockquote`,`list`,`html`,`def`,`paragraph`,`text`].includes(e.type)){t+=n||``;continue}}let i=r;switch(i.type){case`space`:t+=this.renderer.space(i);break;case`hr`:t+=this.renderer.hr(i);break;case`heading`:t+=this.renderer.heading(i);break;case`code`:t+=this.renderer.code(i);break;case`table`:t+=this.renderer.table(i);break;case`blockquote`:t+=this.renderer.blockquote(i);break;case`list`:t+=this.renderer.list(i);break;case`checkbox`:t+=this.renderer.checkbox(i);break;case`html`:t+=this.renderer.html(i);break;case`def`:t+=this.renderer.def(i);break;case`paragraph`:t+=this.renderer.paragraph(i);break;case`text`:t+=this.renderer.text(i);break;default:{let e=`Token with "`+i.type+`" type was not found.`;if(this.options.silent)return console.error(e),``;throw Error(e)}}}return t}parseInline(e,t=this.renderer){this.renderer.parser=this;let n=``;for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let e=this.options.extensions.renderers[i.type].call({parser:this},i);if(e!==!1||![`escape`,`html`,`link`,`image`,`strong`,`em`,`codespan`,`br`,`del`,`text`].includes(i.type)){n+=e||``;continue}}let a=i;switch(a.type){case`escape`:n+=t.text(a);break;case`html`:n+=t.html(a);break;case`link`:n+=t.link(a);break;case`image`:n+=t.image(a);break;case`checkbox`:n+=t.checkbox(a);break;case`strong`:n+=t.strong(a);break;case`em`:n+=t.em(a);break;case`codespan`:n+=t.codespan(a);break;case`br`:n+=t.br(a);break;case`del`:n+=t.del(a);break;case`text`:n+=t.text(a);break;default:{let e=`Token with "`+a.type+`" type was not found.`;if(this.options.silent)return console.error(e),``;throw Error(e)}}}return n}},G=class{options;block;constructor(e){this.options=e||b}static passThroughHooks=new Set([`preprocess`,`postprocess`,`processAllTokens`,`emStrongMask`]);static passThroughHooksRespectAsync=new Set([`preprocess`,`postprocess`,`processAllTokens`]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(e=this.block){return e?H.lex:H.lexInline}provideParser(e=this.block){return e?W.parse:W.parseInline}},K=new class{defaults=y();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=W;Renderer=U;TextRenderer=rt;Lexer=H;Tokenizer=V;Hooks=G;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case`table`:{let e=r;for(let r of e.header)n=n.concat(this.walkTokens(r.tokens,t));for(let r of e.rows)for(let e of r)n=n.concat(this.walkTokens(e.tokens,t));break}case`list`:{let e=r;n=n.concat(this.walkTokens(e.items,t));break}default:{let e=r;this.defaults.extensions?.childTokens?.[e.type]?this.defaults.extensions.childTokens[e.type].forEach(r=>{let i=e[r].flat(1/0);n=n.concat(this.walkTokens(i,t))}):e.tokens&&(n=n.concat(this.walkTokens(e.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(e=>{let n={...e};if(n.async=this.defaults.async||n.async||!1,e.extensions&&(e.extensions.forEach(e=>{if(!e.name)throw Error(`extension name required`);if(`renderer`in e){let n=t.renderers[e.name];n?t.renderers[e.name]=function(...t){let r=e.renderer.apply(this,t);return r===!1&&(r=n.apply(this,t)),r}:t.renderers[e.name]=e.renderer}if(`tokenizer`in e){if(!e.level||e.level!==`block`&&e.level!==`inline`)throw Error(`extension level must be 'block' or 'inline'`);let n=t[e.level];n?n.unshift(e.tokenizer):t[e.level]=[e.tokenizer],e.start&&(e.level===`block`?t.startBlock?t.startBlock.push(e.start):t.startBlock=[e.start]:e.level===`inline`&&(t.startInline?t.startInline.push(e.start):t.startInline=[e.start]))}`childTokens`in e&&e.childTokens&&(t.childTokens[e.name]=e.childTokens)}),n.extensions=t),e.renderer){let t=this.defaults.renderer||new U(this.defaults);for(let n in e.renderer){if(!(n in t))throw Error(`renderer '${n}' does not exist`);if([`options`,`parser`].includes(n))continue;let r=n,i=e.renderer[r],a=t[r];t[r]=(...e)=>{let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n||``}}n.renderer=t}if(e.tokenizer){let t=this.defaults.tokenizer||new V(this.defaults);for(let n in e.tokenizer){if(!(n in t))throw Error(`tokenizer '${n}' does not exist`);if([`options`,`rules`,`lexer`].includes(n))continue;let r=n,i=e.tokenizer[r],a=t[r];t[r]=(...e)=>{let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n}}n.tokenizer=t}if(e.hooks){let t=this.defaults.hooks||new G;for(let n in e.hooks){if(!(n in t))throw Error(`hook '${n}' does not exist`);if([`options`,`block`].includes(n))continue;let r=n,i=e.hooks[r],a=t[r];t[r]=G.passThroughHooks.has(n)?e=>{if(this.defaults.async&&G.passThroughHooksRespectAsync.has(n))return(async()=>{let n=await i.call(t,e);return a.call(t,n)})();let r=i.call(t,e);return a.call(t,r)}:(...e)=>{if(this.defaults.async)return(async()=>{let n=await i.apply(t,e);return n===!1&&(n=await a.apply(t,e)),n})();let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n}}n.hooks=t}if(e.walkTokens){let t=this.defaults.walkTokens,r=e.walkTokens;n.walkTokens=function(e){let n=[];return n.push(r.call(this,e)),t&&(n=n.concat(t.call(this,e))),n}}this.defaults={...this.defaults,...n}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return H.lex(e,t??this.defaults)}parser(e,t){return W.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let r={...n},i={...this.defaults,...r},a=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return a(Error(`marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise.`));if(typeof t>`u`||t===null)return a(Error(`marked(): input parameter is undefined or null`));if(typeof t!=`string`)return a(Error(`marked(): input parameter is of type `+Object.prototype.toString.call(t)+`, string expected`));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let n=i.hooks?await i.hooks.preprocess(t):t,r=await(i.hooks?await i.hooks.provideLexer(e):e?H.lex:H.lexInline)(n,i),a=i.hooks?await i.hooks.processAllTokens(r):r;i.walkTokens&&await Promise.all(this.walkTokens(a,i.walkTokens));let o=await(i.hooks?await i.hooks.provideParser(e):e?W.parse:W.parseInline)(a,i);return i.hooks?await i.hooks.postprocess(o):o})().catch(a);try{i.hooks&&(t=i.hooks.preprocess(t));let n=(i.hooks?i.hooks.provideLexer(e):e?H.lex:H.lexInline)(t,i);i.hooks&&(n=i.hooks.processAllTokens(n)),i.walkTokens&&this.walkTokens(n,i.walkTokens);let r=(i.hooks?i.hooks.provideParser(e):e?W.parse:W.parseInline)(n,i);return i.hooks&&(r=i.hooks.postprocess(r)),r}catch(e){return a(e)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let e=`<p>An error occurred:</p><pre>`+z(n.message+``,!0)+`</pre>`;return t?Promise.resolve(e):e}if(t)return Promise.reject(n);throw n}}};function q(e,t){return K.parse(e,t)}q.options=q.setOptions=function(e){return K.setOptions(e),q.defaults=K.defaults,x(q.defaults),q},q.getDefaults=y,q.defaults=b,q.use=function(...e){return K.use(...e),q.defaults=K.defaults,x(q.defaults),q},q.walkTokens=function(e,t){return K.walkTokens(e,t)},q.parseInline=K.parseInline,q.Parser=W,q.parser=W.parse,q.Renderer=U,q.TextRenderer=rt,q.Lexer=H,q.lexer=H.lex,q.Tokenizer=V,q.Hooks=G,q.parse=q,q.options,q.setOptions,q.use,q.walkTokens,q.parseInline,W.parse,H.lex,q.setOptions({breaks:!0,gfm:!0});function J(e){return!e||typeof e!=`string`?!1:[`html>`,`<head>`,`<body`].some(t=>e.includes(t))}function it(e){return e?typeof e==`string`?/class="[^"]*TH-render[^"]*"/i.test(e)?!0:J(e):e.classList&&e.classList.contains(`TH-render`)?!0:e.tagName===`PRE`&&J(e.textContent||e.innerText||``):!1}function at(e){if(!e)return!1;if(it(e)||/<div[^>]*class="[^"]*TH-render[^"]*"[^>]*>/i.test(e))return!0;let t=e.match(/<pre[^>]*>([\s\S]*?)<\/pre>/gi);if(t){for(let e of t)if(J(e.replace(/<\/?pre[^>]*>/gi,``)))return!0}return!1}function ot(e){if(!e)return!1;let t=e.match(/<pre[^>]*>([\s\S]*?)<\/pre>/gi);return t?t.some(e=>J(e.replace(/<\/?pre[^>]*>/gi,``))):!1}function st(e){if(!e)return[];let t=[],n=/<pre[^>]*>([\s\S]*?)<\/pre>/gi,r;for(;(r=n.exec(e))!==null;){let e=r[1];J(e)&&t.push({full:r[0],html:e.replace(/<\/?code[^>]*>/gi,``).trim()})}return t}function ct(e){if(!e)return[];let t=[],n=/<div[^>]*class="[^"]*TH-render[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,r;for(;(r=n.exec(e))!==null;)t.push({full:r[0],html:r[1].trim()});return t}function lt(e){return e?/<[a-z][\s\S]*>/i.test(e):!1}function ut(e){return!e||typeof e!=`string`?!1:[/^#{1,6}\s+/m,/\*\*[^*]+\*\*/,/\*[^*]+\*/,/^\s*[-*+]\s+/m,/^\s*\d+\.\s+/m,/\[.+\]\(.+\)/,/!\[.*\]\(.+\)/,/^>\s+/m,/`[^`]+`/,/^\|.+\|$/m].some(t=>t.test(e))}function dt(e){return e?/<(script|iframe|audio|video|object|embed|form|input|button)[^>]*>/i.test(e):!1}function ft(e){if(!e)return null;let t=e.match(/```html\s*\n?([\s\S]*?)```/i);if(t&&t[1]){let e=t[1].trim(),n=e.match(/<\/html>/i);return n&&n.index!==void 0&&(e=e.slice(0,n.index+7)),e}return null}function pt(e){if(!e)return null;let t=e.match(/(<!DOCTYPE[\s\S]*?<\/html>|<html[\s\S]*?<\/html>)/i);return t&&t[1]?t[1]:null}function mt(e){if(!e)return``;let t=e.match(/```html\s*\n?/i);if(t)return e.slice(0,t.index).replace(/```\w*\s*/g,``).replace(/<\/?maintext>/gi,``).trim();let n=e.match(/(<!DOCTYPE|<html)/i);return n&&n.index>0?e.slice(0,n.index).replace(/```\w*\s*/g,``).replace(/<\/?maintext>/gi,``).trim():e.replace(/```\w*\s*/g,``).trim()}function ht(e){return e&&e.replace(/\[\[CHOICE_START\]\][\s\S]*?\[\[CHOICE_END\]\]/g,``).replace(/\[\[CHOICE_START\]\][\s\S]*$/g,``).trim()}function gt(e){return e&&((e.match(/```/g)||[]).length%2==0?e:e.replace(/^```\w*\s*\n?/gm,``).replace(/\n?```\s*$/gm,``).replace(/```\w*\n/g,``).replace(/\n```/g,``))}function _t(e){return e&&e.replace(/<\/?maintext>/gi,``).replace(/<\/?option[^>]*>/gi,``).replace(/<\/?tickbubble[^>]*>/gi,``).replace(/<\/?VariableInsert>/gi,``).replace(/<\/?speak[^>]*>/gi,``).replace(/<\/?think[^>]*>/gi,``).replace(/<\/?narrate[^>]*>/gi,``).replace(/<\/?ooc[^>]*>/gi,``).replace(/\^\^\^([\s\S]*?)\^\^\^/g,`$1`).replace(/\[\[\[hidden\]\]\][\s\S]*?\[\[\[\/hidden\]\]\]/gi,``).replace(/\{\{hidden\}\}[\s\S]*?\{\{\/hidden\}\}/gi,``)}function vt(e){if(!e)return{};let t={},n=e.split(`
`).map(e=>{let t=!1,n=``,r=-1;for(let i=0;i<e.length;i++){let a=e[i],o=e[i-1];if(!t&&(a===`"`||a===`'`))t=!0,n=a;else if(t&&a===n&&o!==`\\`)t=!1;else if(!t&&a===`/`&&e[i+1]===`/`){r=i;break}}return r>=0?e.slice(0,r):e}).join(`
`),r=/_\.set\s*\(\s*(['"`])([^'"`]+)\1\s*,\s*([^,\n;)]+)(?:\s*,\s*([^;\n)]+))?\s*\)/g,i;for(;(i=r.exec(n))!==null;){let e=i[2].trim(),n=(i[4]||i[3]).trim(),r;try{r=JSON.parse(n)}catch{r=n.replace(/^['"`]|['"`]$/g,``)}let a=e.split(`.`),o=t;for(let e=0;e<a.length-1;e++)o[a[e]]||(o[a[e]]={}),o=o[a[e]];o[a[a.length-1]]=r}return Object.keys(t).length>0&&console.log(`[parseSetCommands] parsed variables:`,JSON.stringify(t)),t}function yt(e,t){for(let n of Object.keys(t))t[n]&&typeof t[n]==`object`&&!Array.isArray(t[n])?(e[n]||(e[n]={}),yt(e[n],t[n])):e[n]=t[n];return e}function bt(e){if(!e)return{content:e,variables:{}};let t={},n=e,r=/<update[_-]?variable[^>]*>([\s\S]*?)<\/update[_-]?variable>/gi,i=0;return n=e.replace(r,(e,n)=>{i++,console.log(`[extractAndParseUpdateVariable] found tag #`+i+`:`,n.slice(0,200));let r=vt(n);return yt(t,r),``}),yt(t,vt(n)),Object.keys(t).length>0&&console.log(`[extractAndParseUpdateVariable] total variables:`,JSON.stringify(t)),{content:n,variables:t}}function xt(e,t=`状态数据`){if(!e||Object.keys(e).length===0)return``;let n=(e,t=0)=>e==null?`<span style="color:#999">null</span>`:typeof e==`boolean`?`<span style="color:#0066cc">${e}</span>`:typeof e==`number`?`<span style="color:#009900">${e}</span>`:typeof e==`object`?Array.isArray(e)?e.length===0?`<span style="color:#999">[]</span>`:e.map((e,r)=>`<div style="padding-left:${t*12}px"><span style="color:#666">[${r}]:</span> ${n(e,t+1)}</div>`).join(``):Object.entries(e).map(([e,r])=>`<div style="padding-left:${t*12}px"><span style="color:#5E5B9D;font-weight:500">${Q(e)}:</span> ${n(r,t+1)}</div>`).join(``):`<span style="color:#333">${Q(String(e))}</span>`;return`<details class="variable-panel" style="margin:8px 0;border:1px solid rgba(94,91,157,0.3);border-radius:8px;background:rgba(94,91,157,0.05);overflow:hidden;" open>
<summary style="padding:8px 12px;cursor:pointer;font-size:12px;color:rgba(94,91,157,0.9);user-select:none;">📊 ${Q(t)}</summary>
<div style="padding:8px;max-height:300px;overflow:auto;font-size:11px;font-family:monospace;">${n(e)}</div>
</details>`}var Y={global:{},chat:{},message:{},character:{},preset:{}};function X(e,t=`chat`){let n=Y[t]||{};if(!e)return n;let r=e.split(`.`),i=n;for(let e of r){if(i==null)return;i=i[e]}return i}function St(e,t,n=`chat`){Y[n]||(Y[n]={});let r=e.split(`.`),i=Y[n];for(let e=0;e<r.length-1;e++){let t=r[e];i[t]||(i[t]={}),i=i[t]}let a=r[r.length-1];i[a]=t}function Z(e,t={}){if(!e)return e;let{userName:n=`用户`,charName:r=`角色`,lastUserMessage:i=``,userInfo:a={},characterInfo:o={}}=t,s=e;return s=s.replace(/\{\{user\}\}/gi,n).replace(/\{\{char\}\}/gi,r).replace(/\{\{User\}\}/g,n).replace(/\{\{Char\}\}/g,r).replace(/\{\{lastUserMessage\}\}/g,i).replace(/\{\{lastMessage\}\}/gi,i).replace(/\{\{time\}\}/gi,new Date().toLocaleTimeString()).replace(/\{\{date\}\}/gi,new Date().toLocaleDateString()).replace(/\{\{weekday\}\}/gi,()=>[`日`,`一`,`二`,`三`,`四`,`五`,`六`][new Date().getDay()]||`日`).replace(/\{\{isotime\}\}/gi,()=>new Date().toISOString()).replace(/\{\{isodate\}\}/gi,()=>new Date().toISOString().split(`T`)[0]||``).replace(/\{\{idle_duration\}\}/gi,`0`).replace(/\{\{random\}\}/gi,()=>Math.random().toString()).replace(/\{\{roll:(\d+)\}\}/gi,(e,t)=>String(Math.floor(Math.random()*parseInt(t,10))+1)).replace(/\{\{random:(\d+)-(\d+)\}\}/gi,(e,t,n)=>{let r=parseInt(t,10);return String(Math.floor(Math.random()*(parseInt(n,10)-r+1))+r)}).replace(/\{\{newline\}\}/gi,`
`).replace(/\{\{trim\}\}/gi,``).replace(/\{\{noop\}\}/gi,``),s=s.replace(/\{\{user_avatar\}\}/gi,a?.avatar||``).replace(/\{\{char_avatar\}\}/gi,o?.avatar||o?.image||``).replace(/\{\{persona\}\}/gi,a?.username||n).replace(/\{\{description\}\}/gi,o?.description||``).replace(/\{\{personality\}\}/gi,o?.personality||``).replace(/\{\{scenario\}\}/gi,o?.scenario||``),s=s.replace(/\{\{get_(message|chat|character|preset|global)_variable::(.*?)\}\}/gi,(e,t,n)=>{let r=X(n,t);return r==null?``:typeof r==`string`?r:JSON.stringify(r)}),s=s.replace(/\{\{format_(message|chat|character|preset|global)_variable::(.*?)\}\}/gi,(e,t,n)=>{let r=X(n,t);if(r==null)return``;if(typeof r==`string`)return r;try{return JSON.stringify(r,null,2)}catch{return String(r)}}),s=s.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/gi,(e,t,n)=>X(t,`chat`)?n:``),s=s.replace(/\{\{#unless\s+(\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/gi,(e,t,n)=>X(t,`chat`)?``:n),s}function Q(e){return e?String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`):``}function Ct(e){if(!e)return``;try{let t=q.parse(e);return typeof t==`string`?t:``}catch(t){return console.error(`[renderMarkdown] error:`,t),Q(e)}}function wt(e){return e?`<div class="stat-bar" style="margin:6px 0;padding:8px 10px;border:1px solid var(--border-color,#e0e0e0);border-radius:10px;background:rgba(0,0,0,0.02);font-size:12px;color:var(--text-secondary,#666);">${Q(e).replace(/\n/g,`<br>`)}</div>`:``}function Tt(){return`<style>
html,body{max-width:100%!important;overflow-x:hidden!important;box-sizing:border-box!important;margin:0!important;padding:0!important}
*{max-width:100%!important;box-sizing:border-box!important}
img,video,canvas{max-width:100%!important;height:auto!important}
/* 强制响应式布局 */
.flex,.flexbox,[class*="flex"],[style*="flex"]{flex-wrap:wrap!important}
.grid,[class*="grid"],[style*="grid"]{grid-template-columns:1fr!important}
/* 强制多列变单列 */
[style*="display:flex"],[style*="display: flex"]{flex-direction:column!important;flex-wrap:wrap!important}
[style*="flex-direction:row"],[style*="flex-direction: row"]{flex-direction:column!important}
/* 子元素全宽 */
.flex>*,.flexbox>*,[class*="flex"]>*,[style*="flex"]>*{flex:1 1 100%!important;min-width:0!important;max-width:100%!important}
/* 并排容器强制堆叠 */
[style*="width:50%"],[style*="width: 50%"],[style*="width:48%"],[style*="width: 48%"]{width:100%!important}
</style>
<script>
(function(){
window.__TAVERN_COMPAT_LOADED__=true;

// ============ 全局 YAML/Error 拦截 - 最高优先级 ============
// 拦截 Error 构造函数，抑制 YAML 相关错误
var _OrigError=window.Error;
window.Error=function(message){
  if(message&&typeof message==='string'&&(message.indexOf('YAML')>=0||message.indexOf('yaml')>=0||message.indexOf('indentation')>=0)){
    console.warn('[YAML Error Suppressed]',message);
    // 返回一个不会被 throw 的特殊错误对象
    var e=new _OrigError('[Suppressed] '+message);
    e.__suppressed__=true;
    return e;
  }
  return new _OrigError(message);
};
window.Error.prototype=_OrigError.prototype;

// 创建一个安全的 YAML 解析器（宽松版本）
window.__safeYamlParse=function(str){
  if(!str)return {};
  try{
    // 预处理：tab 替换为空格
    var processed=str.replace(/\\t/g,'  ');
    var trimmed=processed.trim();

    // 如果是 JSON 格式，直接解析
    if(trimmed.charAt(0)==='{'||trimmed.charAt(0)==='['){
      try{return JSON.parse(processed)}catch(e){}
    }

    // 简单的 YAML 解析器（处理常见格式）
    var result={};
    var lines=processed.split('\\n');
    var stack=[{obj:result,indent:-1,key:null}];

    for(var i=0;i<lines.length;i++){
      var line=lines[i];
      var trimmedLine=line.trim();

      // 跳过空行和注释
      if(!trimmedLine||trimmedLine.charAt(0)==='#')continue;

      // 计算缩进
      var indent=0;
      while(indent<line.length&&line.charAt(indent)===' ')indent++;

      // 弹出缩进更深的层级
      while(stack.length>1&&stack[stack.length-1].indent>=indent){
        stack.pop();
      }
      var current=stack[stack.length-1].obj;

      // 处理数组项
      if(trimmedLine.charAt(0)==='-'&&trimmedLine.charAt(1)===' '){
        var arrValue=trimmedLine.slice(2).trim();
        // 确保当前对象是数组的容器
        var parentKey=stack[stack.length-1].key;
        if(parentKey&&!Array.isArray(current[parentKey])){
          current[parentKey]=[];
        }
        var arr=parentKey?current[parentKey]:current;
        if(!Array.isArray(arr)){
          // 如果不是数组，跳过
          continue;
        }

        if(arrValue.indexOf(':')>0){
          // 数组项是对象
          var obj={};
          var colonIdx=arrValue.indexOf(':');
          var k=arrValue.slice(0,colonIdx).trim();
          var v=arrValue.slice(colonIdx+1).trim();
          obj[k]=parseYamlValue(v);
          arr.push(obj);
          stack.push({obj:obj,indent:indent,key:null});
        }else if(arrValue){
          arr.push(parseYamlValue(arrValue));
        }else{
          // 空数组项，后续可能有嵌套内容
          var obj={};
          arr.push(obj);
          stack.push({obj:obj,indent:indent,key:null});
        }
        continue;
      }

      // 处理键值对
      var colonIdx=trimmedLine.indexOf(':');
      if(colonIdx>0){
        var key=trimmedLine.slice(0,colonIdx).trim();
        var value=trimmedLine.slice(colonIdx+1).trim();

        if(!value){
          // 嵌套对象或数组
          var nextLine=i+1<lines.length?lines[i+1]:'';
          var nextTrimmed=nextLine.trim();
          if(nextTrimmed.charAt(0)==='-'){
            current[key]=[];
          }else{
            current[key]={};
          }
          stack.push({obj:current,indent:indent,key:key});
        }else{
          current[key]=parseYamlValue(value);
        }
      }
    }

    // 辅助函数：解析 YAML 值
    function parseYamlValue(v){
      if(!v)return '';
      v=v.trim();
      if(v==='true')return true;
      if(v==='false')return false;
      if(v==='null'||v==='~')return null;
      if(/^-?\\d+$/.test(v))return parseInt(v,10);
      if(/^-?\\d+\\.\\d+$/.test(v))return parseFloat(v);
      // 移除引号
      if((v.charAt(0)==='"'&&v.charAt(v.length-1)==='"')||(v.charAt(0)==="'"&&v.charAt(v.length-1)==="'")){
        return v.slice(1,-1);
      }
      return v;
    }

    console.log('[__safeYamlParse] parsed:',JSON.stringify(result).slice(0,200));
    return result;
  }catch(e){
    console.warn('[__safeYamlParse] error:',e.message);
    return {};
  }
};

// 创建一个不会抛出异常的 YAML 对象
window.YAML=window.YAML||{
  parse:function(str){try{return window.__safeYamlParse(str)}catch(e){return{}}},
  load:function(str){try{return window.__safeYamlParse(str)}catch(e){return{}}},
  safeLoad:function(str){try{return window.__safeYamlParse(str)}catch(e){return{}}},
  stringify:function(obj){return JSON.stringify(obj,null,2)},
  dump:function(obj){return JSON.stringify(obj,null,2)}
};

// 创建一个不会抛出异常的 jsyaml 对象
window.jsyaml=window.jsyaml||{
  load:function(str){try{return window.__safeYamlParse(str)}catch(e){return{}}},
  safeLoad:function(str){try{return window.__safeYamlParse(str)}catch(e){return{}}},
  dump:function(obj){return JSON.stringify(obj,null,2)},
  safeDump:function(obj){return JSON.stringify(obj,null,2)}
};

// 全局错误处理：打印错误但不阻断流程
window.onerror=function(msg,url,line,col,err){
  // 完全忽略 YAML 相关错误
  if(msg&&(msg.indexOf('YAML')>=0||msg.indexOf('yaml')>=0||msg.indexOf('indentation')>=0||msg.indexOf('sequence entry')>=0)){
    return true;
  }
  // 忽略 swipe 相关错误
  if(msg&&(msg.indexOf('swipe')>=0||msg.indexOf('Swipe')>=0||msg.indexOf("reading '0'")>=0||msg.indexOf('Cannot read properties of undefined')>=0)){
    console.warn("[iframe swipe error suppressed]",msg);
    return true;
  }
  console.warn("[iframe error]",msg,url,line);
  return true;
};
window.addEventListener("unhandledrejection",function(e){
  var reason=e.reason;
  if(reason&&(String(reason).indexOf('YAML')>=0||String(reason).indexOf('indentation')>=0)){
    e.preventDefault();
    return;
  }
  // 忽略 swipe 相关错误
  if(reason&&(String(reason).indexOf('swipe')>=0||String(reason).indexOf("reading '0'")>=0)){
    e.preventDefault();
    return;
  }
  console.warn("[iframe unhandled rejection]",reason);
  e.preventDefault();
});

// 保留原始 console 方法用于调试
var _log=console.log,_warn=console.warn,_error=console.error;

// 拦截 console.error，过滤 YAML 和 swipe 相关错误
console.error=function(){
  var args=Array.prototype.slice.call(arguments);
  var msg=args.join(' ');
  // 完全抑制 YAML 相关错误
  if(msg.indexOf('YAML')>=0||msg.indexOf('yaml')>=0||msg.indexOf('indentation')>=0||msg.indexOf('渲染错误')>=0||msg.indexOf('sequence entry')>=0){
    return;
  }
  // 抑制 swipe 相关错误
  if(msg.indexOf('swipe')>=0||msg.indexOf('Swipe')>=0||msg.indexOf("reading '0'")>=0||msg.indexOf('Cannot read properties of undefined')>=0||msg.indexOf('switching swipe')>=0||msg.indexOf('Error switching')>=0){
    return;
  }
  return _error.apply(console,args);
};

// 也拦截 console.warn
console.warn=function(){
  var args=Array.prototype.slice.call(arguments);
  var msg=args.join(' ');
  if(msg.indexOf('YAML')>=0||msg.indexOf('yaml')>=0||msg.indexOf('indentation')>=0||msg.indexOf('渲染错误')>=0){
    return;
  }
  return _warn.apply(console,args);
};

// Base variables
var _pendingMsg="",_msgId=0,_scriptId="script_"+Date.now();
var _variables={global:{},chat:{},message:{},character:{},preset:{},script:{}};
// 初始化 _chatMessages 为包含默认消息的数组
var _chatMessages=[{
  id:0,mes_id:0,name:"Assistant",is_user:false,is_system:false,
  mes:"",message:"",swipes:[""],swipe_id:0,
  swipe_info:[{send_date:Date.now()}],extra:{},data:{},send_date:Date.now()
}];
var _lorebookEntries=[],_worldbooks={},_presets={};

// Utility functions
var noop=function(){};
var noopPromise=function(){return Promise.resolve()};
var noopPromiseNull=function(){return Promise.resolve(null)};
var noopPromiseStr=function(){return Promise.resolve("")};
var noopPromiseArr=function(){return Promise.resolve([])};
var noopPromiseObj=function(){return Promise.resolve({})};
var noopPromiseBool=function(){return Promise.resolve(false)};
var noopArr=function(){return []};
var noopObj=function(){return {}};
var noopThis=function(){return this};
var noopTrue=function(){return true};
var noopFalse=function(){return false};

// Deep clone
function klona(obj){try{return JSON.parse(JSON.stringify(obj))}catch(e){return obj}}

// Core message posting
function postMsg(text){
  if(text&&window.parent&&window.parent.postMessage){
  window.parent.postMessage({type:"iframe-send-chat",text:text},"*");
  }
}

// ============ triggerSlash ============
window.triggerSlash=window.triggerSlashWithResult=function(cmd){
  if(!cmd)return Promise.resolve();
  if(typeof cmd==="string"){
    if(cmd.startsWith("/send ")){postMsg(cmd.slice(6));}
    else if(cmd==="/trigger"&&_pendingMsg){postMsg(_pendingMsg);_pendingMsg="";}
  }
  return Promise.resolve();
};

// ============ STscript ============
window.STscript=function(cmd){if(cmd)triggerSlash(cmd);return Promise.resolve()};
window.STscript.run=window.STscript.execute=function(cmd){if(cmd)triggerSlash(cmd);return Promise.resolve()};

// ============ Chat Messages API ============
// 从页面 HTML 中提取 _.set() 调用的状态数据
function extractStatusData(){
  try{
    var html=document.documentElement.outerHTML||"";
    var result={};

    // 查找匹配的引号结束位置（处理转义）
    function findQuoteEnd(str,startIdx,quote){
      for(var i=startIdx;i<str.length;i++){
        if(str[i]===quote&&str[i-1]!=="\\\\")return i;
      }
      return -1;
    }

    // 解析参数（处理嵌套引号）
    function parseParam(str){
      str=str.trim();
      if(!str)return null;
      var q=str[0];
      if(q==="'"||q==='"'){
        var end=findQuoteEnd(str,1,q);
        if(end>0)return str.slice(1,end);
      }
      return str;
    }

    var setStart="_.set(";
    var idx=0;
    while((idx=html.indexOf(setStart,idx))!==-1){
      try{
        // 找到匹配的右括号
        var start=idx+setStart.length;
        var depth=1;
        var end=-1;
        var inQuote=null;
        for(var i=start;i<html.length&&i<start+2000;i++){
          var c=html[i];
          if(inQuote){
            if(c===inQuote&&html[i-1]!=="\\\\")inQuote=null;
          }else{
            if(c==="'"||c==='"')inQuote=c;
            else if(c==="(")depth++;
            else if(c===")"){depth--;if(depth===0){end=i;break;}}
          }
        }
        if(end<0){idx++;continue;}

        var content=html.slice(start,end);
        // 分割参数
        var params=[];
        var pStart=0;
        var pDepth=0;
        var pQuote=null;
        for(var i=0;i<content.length;i++){
          var c=content[i];
          if(pQuote){
            if(c===pQuote&&content[i-1]!=="\\\\")pQuote=null;
          }else{
            if(c==="'"||c==='"')pQuote=c;
            else if(c==="("||c==="["||c==="{")pDepth++;
            else if(c===")"||c==="]"||c==="}")pDepth--;
            else if(c===","&&pDepth===0){
              params.push(content.slice(pStart,i));
              pStart=i+1;
            }
          }
        }
        params.push(content.slice(pStart));

        if(params.length>=3){
          var path=parseParam(params[0]);
          var newVal=parseParam(params[2]);
          if(path&&newVal!==null){
            var parts=path.split(".");
            var obj=result;
            for(var j=0;j<parts.length-1;j++){
              if(!obj[parts[j]])obj[parts[j]]={};
              obj=obj[parts[j]];
            }
            obj[parts[parts.length-1]]=[newVal];
          }
        }
      }catch(ex){}
      idx++;
    }
    console.log("[extractStatusData] result:",JSON.stringify(result).slice(0,800));
    return result;
  }catch(e){
    console.warn("[extractStatusData] error:",e);
    return {};
  }
}

window.getChatMessages=function(range,options){
  var statusData=extractStatusData();
  // 构建完整的消息结构，包含 swipe 支持
  var msg={
    id:0,
    mes_id:0,
    role:"assistant",
    is_user:false,
    is_system:false,
    message:"",
    mes:"",
    // Swipe 支持
    swipes:[""],
    swipe_id:0,
    swipe_info:[{send_date:Date.now(),gen_started:Date.now(),gen_finished:Date.now()}],
    // 状态数据
    data:{
      stat_data:statusData||{},
      display_data:statusData||{}
    },
    extra:{},
    send_date:Date.now(),
    gen_started:Date.now(),
    gen_finished:Date.now()
  };
  return Promise.resolve([msg]);
};
window.setChatMessage=window.setChatMessages=function(msg,id,options){
  var text="";
  if(typeof msg==="string")text=msg;
  else if(Array.isArray(msg)&&msg[0])text=msg[0].message||msg[0].content||msg[0].mes||msg[0]||"";
  else if(msg&&typeof msg==="object")text=msg.message||msg.content||msg.mes||"";
  if(text)postMsg(text);
  return Promise.resolve();
};
window.createChatMessages=function(msg,options){
  var text="";
  if(typeof msg==="string")text=msg;
  else if(Array.isArray(msg)&&msg[0])text=msg[0].message||msg[0].content||msg[0].mes||"";
  else if(msg&&typeof msg==="object")text=msg.message||msg.content||msg.mes||"";
  _pendingMsg=text;
  return Promise.resolve();
};
window.deleteChatMessages=window.rotateChatMessages=noopPromise;

// ============ Swipe API ============
var _currentSwipeId=0;
var _swipes=[""];
window.getSwipes=function(messageId){
  return Promise.resolve(_swipes.slice());
};
window.getSwipeId=function(messageId){
  return _currentSwipeId;
};
window.setSwipeId=function(messageId,swipeId){
  _currentSwipeId=swipeId||0;
  return Promise.resolve();
};
window.addSwipe=function(messageId,content){
  _swipes.push(content||"");
  return Promise.resolve(_swipes.length-1);
};
window.deleteSwipe=function(messageId,swipeId){
  if(swipeId>=0&&swipeId<_swipes.length){
    _swipes.splice(swipeId,1);
    if(_currentSwipeId>=_swipes.length)_currentSwipeId=Math.max(0,_swipes.length-1);
  }
  return Promise.resolve();
};
window.switchSwipe=window.goToSwipe=function(messageId,swipeId){
  _currentSwipeId=swipeId||0;
  return Promise.resolve();
};

// ============ Message ID ============
window.getCurrentMessageId=window.getLastMessageId=window.getMessageId=function(){return _msgId++};
window._getCurrentMessageId=window._getLastMessageId=function(){return _msgId};
window.getLastChatMessageId=function(){return _msgId};
window.getMessageById=function(id){
  // 返回完整的消息结构，包含 swipe 支持
  return Promise.resolve({
    id:id,
    mes_id:id,
    role:"assistant",
    is_user:false,
    is_system:false,
    name:"Assistant",
    message:"",
    mes:"",
    swipes:[""],
    swipe_id:0,
    swipe_info:[{send_date:Date.now()}],
    data:{stat_data:klona(_mvuData.stat_data||{}),display_data:klona(_mvuData.display_data||{})},
    extra:{},
    send_date:Date.now()
  });
};
window.getMessagesRange=function(start,end){return Promise.resolve([])};

// ============ Variables API ============
// 包装 Object.entries/keys/values 防止 null/undefined 报错
var _origEntries=Object.entries;
var _origKeys=Object.keys;
var _origValues=Object.values;
Object.entries=function(o){return _origEntries(o||{})};
Object.keys=function(o){return _origKeys(o||{})};
Object.values=function(o){return _origValues(o||{})};

window.getVariables=window._getVariables=function(option){
  var type=(option&&option.type)||"chat";
  // 合并 _variables 和 _mvuData.stat_data
  var vars=klona(_variables[type]||{});
  if(type==="chat"&&_mvuData.stat_data){
    Object.assign(vars,klona(_mvuData.stat_data));
  }
  return Promise.resolve(vars);
};
window.getAllVariables=window._getAllVariables=function(){
  var result={};
  // 先合并所有 _variables
  _origKeys(_variables).forEach(function(k){Object.assign(result,_variables[k])});
  // 再合并 _mvuData.stat_data（优先级更高）
  if(_mvuData.stat_data){
    Object.assign(result,klona(_mvuData.stat_data));
  }
  console.log("[getAllVariables] result keys:",Object.keys(result).length);
  return Promise.resolve(klona(result));
};
window.getVariable=function(k,option){
  var type=(option&&option.type)||"chat";
  // 先从 _variables 查找
  var val=(_variables[type]||{})[k];
  // 如果没找到，从 _mvuData.stat_data 查找
  if(val===undefined&&type==="chat"&&_mvuData.stat_data){
    val=_mvuData.stat_data[k];
  }
  return val||"";
};
window.setVariable=function(k,v,option){
  var type=(option&&option.type)||"chat";
  if(!_variables[type])_variables[type]={};
  _variables[type][k]=v;
};
window.replaceVariables=window._replaceVariables=function(v,option){
  var type=(option&&option.type)||"chat";
  _variables[type]=v||{};
  return Promise.resolve();
};
window.updateVariablesWith=window._updateVariablesWith=function(fn,option){
  var type=(option&&option.type)||"chat";
  if(fn){
    var result=fn(_variables[type]||{});
    if(result&&typeof result.then==="function"){
      return result.then(function(r){_variables[type]=r||{};return r});
    }
    _variables[type]=result||{};
  }
  return Promise.resolve(_variables[type]);
};
window.insertVariables=window._insertVariables=function(v,option){
  var type=(option&&option.type)||"chat";
  Object.assign(_variables[type]||{},v||{});
  return Promise.resolve(_variables[type]);
};
window.insertOrAssignVariables=window._insertOrAssignVariables=function(v,option){
  var type=(option&&option.type)||"chat";
  if(!_variables[type])_variables[type]={};
  Object.assign(_variables[type],v||{});
  return Promise.resolve(_variables[type]);
};
window.deleteVariable=window._deleteVariable=function(k,option){
  var type=(option&&option.type)||"chat";
  var existed=(_variables[type]||{}).hasOwnProperty(k);
  delete (_variables[type]||{})[k];
  return Promise.resolve({variables:_variables[type]||{},delete_occurred:existed});
};
window.registerVariableSchema=noop;

// ============ Mvu API ============
var _mvuData={stat_data:{},schema:{},initialized_lorebooks:{},display_data:{}};
window.Mvu=window.MVU={
  events:{
    VARIABLE_INITIALIZED:"mag_variable_initiailized",
    VARIABLE_UPDATE_STARTED:"mag_variable_update_started",
    COMMAND_PARSED:"mag_command_parsed",
    VARIABLE_UPDATE_ENDED:"mag_variable_update_ended",
    BEFORE_MESSAGE_UPDATE:"mag_before_message_update"
  },
  on:eventOn,emit:eventEmit,off:eventRemoveListener,
  getMvuData:function(opt){return Promise.resolve(klona(_mvuData))},
  replaceMvuData:function(data){if(data)_mvuData=klona(data);return Promise.resolve()},
  setMvuData:function(data){if(data)Object.assign(_mvuData,klona(data));return Promise.resolve()},
  parseMessage:function(message,old_data){
    // 解析 _.set() 命令
    var result=klona(old_data||_mvuData);
    var setRegex=/_.set\\s*\\(\\s*['"]([^'"]+)['"]\\s*,\\s*([^,)]+)(?:\\s*,\\s*([^)]+))?\\s*\\)/g;
    var match;
    while((match=setRegex.exec(message))!==null){
      var path=match[1];
      var value=match[3]||match[2];
      try{
        value=JSON.parse(value.trim());
      }catch(e){
        value=value.trim().replace(/^['"]|['"]$/g,"");
      }
      var keys=path.split(".");
      var obj=result.stat_data||(result.stat_data={});
      for(var i=0;i<keys.length-1;i++){
        if(!obj[keys[i]])obj[keys[i]]={};
        obj=obj[keys[i]];
      }
      obj[keys[keys.length-1]]=value;
    }
    return Promise.resolve(result);
  },
  isDuringExtraAnalysis:function(){return false}
};

// ============ MagVarUpdate 兼容 ============
window.variable_events={
  VARIABLE_INITIALIZED:"mag_variable_initiailized",
  VARIABLE_UPDATE_STARTED:"mag_variable_update_started",
  COMMAND_PARSED:"mag_command_parsed",
  VARIABLE_UPDATE_ENDED:"mag_variable_update_ended",
  BEFORE_MESSAGE_UPDATE:"mag_before_message_update",
  VARIABLE_UPDATED:"mvu_variable_updated",
  DISPLAY_UPDATED:"mvu_display_updated"
};
window.getMvuData=function(){return Promise.resolve(klona(_mvuData))};
window.setMvuData=function(data){if(data)Object.assign(_mvuData,klona(data));return Promise.resolve()};
window.getStatData=function(){return Promise.resolve(klona(_mvuData.stat_data||{}))};
window.setStatData=function(data){if(data)_mvuData.stat_data=klona(data);return Promise.resolve()};

// ============ Event API (Full Implementation) ============
var _eventListeners={};
var _buttonEvents={};

function getEventListeners(eventType){
  if(!_eventListeners[eventType])_eventListeners[eventType]=[];
  return _eventListeners[eventType];
}

function createEventReturn(eventType,listener){
  return {stop:function(){eventRemoveListener(eventType,listener)}};
}

function eventOn(eventType,listener){
  if(!eventType||typeof listener!=="function")return {stop:noop};
  var listeners=getEventListeners(eventType);
  if(listeners.indexOf(listener)===-1)listeners.push(listener);
  return createEventReturn(eventType,listener);
}

function eventOnce(eventType,listener){
  if(!eventType||typeof listener!=="function")return {stop:noop};
  var wrapper=function(){
    eventRemoveListener(eventType,wrapper);
    listener.apply(this,arguments);
  };
  wrapper._original=listener;
  return eventOn(eventType,wrapper);
}

function eventMakeLast(eventType,listener){
  if(!eventType||typeof listener!=="function")return {stop:noop};
  var listeners=getEventListeners(eventType);
  var idx=listeners.indexOf(listener);
  if(idx>-1)listeners.splice(idx,1);
  listeners.push(listener);
  return createEventReturn(eventType,listener);
}

function eventMakeFirst(eventType,listener){
  if(!eventType||typeof listener!=="function")return {stop:noop};
  var listeners=getEventListeners(eventType);
  var idx=listeners.indexOf(listener);
  if(idx>-1)listeners.splice(idx,1);
  listeners.unshift(listener);
  return createEventReturn(eventType,listener);
}

function eventRemoveListener(eventType,listener){
  if(!eventType)return;
  var listeners=getEventListeners(eventType);
  var idx=listeners.indexOf(listener);
  if(idx>-1)listeners.splice(idx,1);
  // Check for wrapped once listeners
  for(var i=listeners.length-1;i>=0;i--){
    if(listeners[i]._original===listener)listeners.splice(i,1);
  }
}

function eventClearEvent(eventType){
  if(eventType)_eventListeners[eventType]=[];
}

function eventClearListener(listener){
  Object.keys(_eventListeners).forEach(function(et){
    eventRemoveListener(et,listener);
  });
}

function eventClearAll(){
  _eventListeners={};
}

function eventEmit(eventType){
  var args=Array.prototype.slice.call(arguments,1);
  var listeners=getEventListeners(eventType).slice();
  var promises=[];
  listeners.forEach(function(fn){
    try{
      var result=fn.apply(null,args);
      if(result&&typeof result.then==="function")promises.push(result);
    }catch(e){console.warn("[eventEmit] error:",e)}
  });
  return Promise.all(promises).then(function(){});
}

function eventEmitAndWait(eventType){
  return eventEmit.apply(null,arguments);
}

function getButtonEvent(buttonName){
  return "button_"+buttonName;
}

window.eventOn=window._eventOn=eventOn;
window.eventOnce=window._eventOnce=eventOnce;
window.eventMakeLast=window._eventMakeLast=eventMakeLast;
window.eventMakeFirst=window._eventMakeFirst=eventMakeFirst;
window.eventRemoveListener=window._eventRemoveListener=eventRemoveListener;
window.eventClearEvent=window._eventClearEvent=eventClearEvent;
window.eventClearListener=window._eventClearListener=eventClearListener;
window.eventClearAll=window._eventClearAll=eventClearAll;
window.eventEmit=window._eventEmit=eventEmit;
window.eventEmitAndWait=window._eventEmitAndWait=eventEmitAndWait;
window.eventOff=eventRemoveListener;
window.eventOnButton=window._eventOnButton=function(eventType,listener){return eventOn(eventType,listener)};
window.getButtonEvent=getButtonEvent;

var evs={
  on:eventOn,emit:eventEmit,once:eventOnce,off:eventRemoveListener,
  removeListener:eventRemoveListener,makeLast:eventMakeLast,makeFirst:eventMakeFirst
};

// Tavern events constants (完整版本，参考 JS-Slash-Runner)
window.tavern_events={
  APP_READY:"app_ready",
  EXTRAS_CONNECTED:"extras_connected",
  MESSAGE_SWIPED:"message_swiped",
  MESSAGE_SENT:"message_sent",
  MESSAGE_RECEIVED:"message_received",
  MESSAGE_EDITED:"message_edited",
  MESSAGE_DELETED:"message_deleted",
  MESSAGE_UPDATED:"message_updated",
  MESSAGE_FILE_EMBEDDED:"message_file_embedded",
  MESSAGE_REASONING_EDITED:"message_reasoning_edited",
  MESSAGE_REASONING_DELETED:"message_reasoning_deleted",
  MESSAGE_SWIPE_DELETED:"message_swipe_deleted",
  MORE_MESSAGES_LOADED:"more_messages_loaded",
  IMPERSONATE_READY:"impersonate_ready",
  CHAT_CHANGED:"chat_id_changed",
  GENERATION_AFTER_COMMANDS:"GENERATION_AFTER_COMMANDS",
  GENERATION_STARTED:"generation_started",
  GENERATION_STOPPED:"generation_stopped",
  GENERATION_ENDED:"generation_ended",
  SD_PROMPT_PROCESSING:"sd_prompt_processing",
  EXTENSIONS_FIRST_LOAD:"extensions_first_load",
  EXTENSION_SETTINGS_LOADED:"extension_settings_loaded",
  SETTINGS_LOADED:"settings_loaded",
  SETTINGS_UPDATED:"settings_updated",
  MOVABLE_PANELS_RESET:"movable_panels_reset",
  SETTINGS_LOADED_BEFORE:"settings_loaded_before",
  SETTINGS_LOADED_AFTER:"settings_loaded_after",
  CHATCOMPLETION_SOURCE_CHANGED:"chatcompletion_source_changed",
  CHATCOMPLETION_MODEL_CHANGED:"chatcompletion_model_changed",
  OAI_PRESET_CHANGED_BEFORE:"oai_preset_changed_before",
  OAI_PRESET_CHANGED_AFTER:"oai_preset_changed_after",
  OAI_PRESET_EXPORT_READY:"oai_preset_export_ready",
  OAI_PRESET_IMPORT_READY:"oai_preset_import_ready",
  WORLDINFO_SETTINGS_UPDATED:"worldinfo_settings_updated",
  WORLDINFO_UPDATED:"worldinfo_updated",
  CHARACTER_EDITOR_OPENED:"character_editor_opened",
  CHARACTER_EDITED:"character_edited",
  CHARACTER_PAGE_LOADED:"character_page_loaded",
  USER_MESSAGE_RENDERED:"user_message_rendered",
  CHARACTER_MESSAGE_RENDERED:"character_message_rendered",
  FORCE_SET_BACKGROUND:"force_set_background",
  CHAT_DELETED:"chat_deleted",
  CHAT_CREATED:"chat_created",
  GENERATE_BEFORE_COMBINE_PROMPTS:"generate_before_combine_prompts",
  GENERATE_AFTER_COMBINE_PROMPTS:"generate_after_combine_prompts",
  GENERATE_AFTER_DATA:"generate_after_data",
  WORLD_INFO_ACTIVATED:"world_info_activated",
  TEXT_COMPLETION_SETTINGS_READY:"text_completion_settings_ready",
  CHAT_COMPLETION_SETTINGS_READY:"chat_completion_settings_ready",
  CHAT_COMPLETION_PROMPT_READY:"chat_completion_prompt_ready",
  CHARACTER_FIRST_MESSAGE_SELECTED:"character_first_message_selected",
  CHARACTER_DELETED:"characterDeleted",
  CHARACTER_DUPLICATED:"character_duplicated",
  CHARACTER_RENAMED:"character_renamed",
  CHARACTER_RENAMED_IN_PAST_CHAT:"character_renamed_in_past_chat",
  SMOOTH_STREAM_TOKEN_RECEIVED:"stream_token_received",
  STREAM_TOKEN_RECEIVED:"stream_token_received",
  STREAM_REASONING_DONE:"stream_reasoning_done",
  FILE_ATTACHMENT_DELETED:"file_attachment_deleted",
  WORLDINFO_FORCE_ACTIVATE:"worldinfo_force_activate",
  OPEN_CHARACTER_LIBRARY:"open_character_library",
  ONLINE_STATUS_CHANGED:"online_status_changed",
  IMAGE_SWIPED:"image_swiped",
  CONNECTION_PROFILE_LOADED:"connection_profile_loaded",
  CONNECTION_PROFILE_CREATED:"connection_profile_created",
  CONNECTION_PROFILE_DELETED:"connection_profile_deleted",
  CONNECTION_PROFILE_UPDATED:"connection_profile_updated",
  TOOL_CALLS_PERFORMED:"tool_calls_performed",
  TOOL_CALLS_RENDERED:"tool_calls_rendered",
  CHARACTER_MANAGEMENT_DROPDOWN:"charManagementDropdown",
  SECRET_WRITTEN:"secret_written",
  SECRET_DELETED:"secret_deleted",
  SECRET_ROTATED:"secret_rotated",
  SECRET_EDITED:"secret_edited",
  PRESET_CHANGED:"preset_changed",
  PRESET_DELETED:"preset_deleted",
  PRESET_RENAMED:"preset_renamed",
  PRESET_RENAMED_BEFORE:"preset_renamed_before",
  MAIN_API_CHANGED:"main_api_changed",
  WORLDINFO_ENTRIES_LOADED:"worldinfo_entries_loaded",
  WORLDINFO_SCAN_DONE:"worldinfo_scan_done",
  MEDIA_ATTACHMENT_DELETED:"media_attachment_deleted"
};

// iframe events constants
window.iframe_events={
  MESSAGE_IFRAME_RENDER_STARTED:"message_iframe_render_started",
  MESSAGE_IFRAME_RENDER_ENDED:"message_iframe_render_ended",
  GENERATION_STARTED:"js_generation_started",
  STREAM_TOKEN_RECEIVED_FULLY:"js_stream_token_received_fully",
  STREAM_TOKEN_RECEIVED_INCREMENTALLY:"js_stream_token_received_incrementally",
  GENERATION_ENDED:"js_generation_ended"
};

// ============ SillyTavern Context (Enhanced) ============
var ctx={
  chat:[],characters:[],characterId:0,groupId:null,
  name1:"User",name2:"Assistant",chatMetadata:{},
  onlineStatus:"connected",maxContext:4096,
  chatId:"chat_"+Date.now(),
  extensionSettings:{},extensionPrompts:{},
  writeExtensionField:noop,
  getCurrentChatId:function(){return this.chatId},
  getRequestHeaders:function(){return {"Content-Type":"application/json"}},
  reloadCurrentChat:noopPromise,
  saveSettingsDebounced:noopPromise,
  updateChatMetadata:function(v){Object.assign(this.chatMetadata,v||{})},
  saveChat:noopPromise,
  saveMetadata:noopPromise,
  setExtensionPrompt:noopPromise,
  addOneMessage:noop,
  deleteLastMessage:noopPromise,
  generate:function(){return Promise.resolve("")},
  stopGeneration:noopFalse,
  getTokenCountAsync:function(){return Promise.resolve(0)},
  substituteParams:function(s){return s||""},
  substituteParamsExtended:function(s){return s||""},
  registerMacro:noop,
  unregisterMacro:noop,
  eventSource:evs,
  eventTypes:window.tavern_events
};

// Popup API
var POPUP_TYPE={TEXT:1,CONFIRM:2,INPUT:3,DISPLAY:4,CROP:5};
var POPUP_RESULT={AFFIRMATIVE:1,NEGATIVE:0,CANCELLED:-1};

function Popup(content,type,inputValue,options){
  this.content=content;
  this.type=type||POPUP_TYPE.TEXT;
  this.inputValue=inputValue||"";
  this.options=options||{};
  this.result=null;
}
Popup.prototype.show=function(){
  var self=this;
  return new Promise(function(resolve){
    if(self.type===POPUP_TYPE.CONFIRM){
      self.result=confirm(typeof self.content==="string"?self.content:"Confirm?")?POPUP_RESULT.AFFIRMATIVE:POPUP_RESULT.NEGATIVE;
    }else if(self.type===POPUP_TYPE.INPUT){
      var val=prompt(typeof self.content==="string"?self.content:"Input:",self.inputValue);
      self.result=val!==null?val:POPUP_RESULT.CANCELLED;
    }else{
      alert(typeof self.content==="string"?self.content:"");
      self.result=POPUP_RESULT.AFFIRMATIVE;
    }
    resolve(self.result);
  });
};
Popup.prototype.complete=function(r){this.result=r;return Promise.resolve()};
Popup.prototype.completeAffirmative=function(){return this.complete(POPUP_RESULT.AFFIRMATIVE)};
Popup.prototype.completeNegative=function(){return this.complete(POPUP_RESULT.NEGATIVE)};
Popup.prototype.completeCancelled=function(){return this.complete(POPUP_RESULT.CANCELLED)};

ctx.Popup=Popup;
ctx.POPUP_TYPE=POPUP_TYPE;
ctx.POPUP_RESULT=POPUP_RESULT;
ctx.callGenericPopup=function(content,type,inputValue,options){
  var p=new Popup(content,type,inputValue,options);
  return p.show();
};

window.SillyTavern={getContext:function(){return ctx},eventSource:evs,Popup:Popup,POPUP_TYPE:POPUP_TYPE,POPUP_RESULT:POPUP_RESULT};
window.getContext=function(){return ctx};
window.isSillyTavern=true;
window.ST=window.SillyTavern;
window.Popup=Popup;
window.POPUP_TYPE=POPUP_TYPE;
window.POPUP_RESULT=POPUP_RESULT;
window.callGenericPopup=ctx.callGenericPopup;
window.callPopup=function(content,type){return ctx.callGenericPopup(content,type||POPUP_TYPE.TEXT)};

// ============ Generate API ============
window.generate=function(prompt,options){return Promise.resolve("")};
window.generateRaw=function(prompt,options){return Promise.resolve("")};
window.generateQuietPrompt=function(){return Promise.resolve("")};
window.stopGenerationById=window.stopAllGeneration=noop;
window.builtin_prompt_default_order=[];

// ============ Character API ============
window.getCharacterNames=function(){return Promise.resolve([])};
window.getCharacter=function(name){return Promise.resolve({})};
window.getCurrentCharacterName=function(){return ""};
window.createCharacter=window.createOrReplaceCharacter=noopPromise;
window.deleteCharacter=window.replaceCharacter=window.updateCharacterWith=noopPromise;
window.getCharData=function(){return Promise.resolve({})};
window.getCharAvatarPath=function(){return Promise.resolve("")};
window.getChatHistoryBrief=function(){return Promise.resolve([])};
window.getChatHistoryDetail=function(){return Promise.resolve([])};
window.RawCharacter=function(){};

// ============ Worldbook API ============
window.getWorldbookNames=function(){return Promise.resolve([])};
window.getGlobalWorldbookNames=function(){return Promise.resolve([])};
window.getCharWorldbookNames=function(){return Promise.resolve([])};
window.getChatWorldbookName=function(){return Promise.resolve("")};
window.getWorldbook=function(name){return Promise.resolve({name:name||"",entries:[]})};
window.createWorldbook=window.createOrReplaceWorldbook=noopPromise;
window.deleteWorldbook=window.replaceWorldbook=window.updateWorldbookWith=noopPromise;
window.rebindGlobalWorldbooks=window.rebindCharWorldbooks=window.rebindChatWorldbook=noopPromise;
window.getOrCreateChatWorldbook=function(){return Promise.resolve({entries:[]})};
window.createWorldbookEntries=window.deleteWorldbookEntries=noopPromise;

// ============ Lorebook API ============
window.getLorebookEntries=function(name){return Promise.resolve([])};
window.replaceLorebookEntries=window.updateLorebookEntriesWith=noopPromise;
window.setLorebookEntries=window.createLorebookEntries=window.createLorebookEntry=noopPromise;
window.deleteLorebookEntries=window.deleteLorebookEntry=noopPromise;
window.getLorebookSettings=function(){return Promise.resolve({})};
window.setLorebookSettings=noopPromise;
window.getCharLorebooks=function(){return Promise.resolve([])};
window.setCurrentCharLorebooks=noopPromise;
window.getLorebooks=function(){return Promise.resolve([])};
window.deleteLorebook=window.createLorebook=noopPromise;
window.getCurrentCharPrimaryLorebook=function(){return Promise.resolve(null)};
window.getChatLorebook=function(){return Promise.resolve(null)};
window.setChatLorebook=noopPromise;
window.getOrCreateChatLorebook=function(){return Promise.resolve({entries:[]})};

// ============ Preset API ============
window.getPresetNames=function(){return Promise.resolve([])};
window.getLoadedPresetName=function(){return ""};
window.loadPreset=window.createPreset=window.createOrReplacePreset=noopPromise;
window.deletePreset=window.renamePreset=noopPromise;
window.getPreset=function(name){return Promise.resolve({})};
window.replacePreset=window.updatePresetWith=window.setPreset=noopPromise;
window.isPresetNormalPrompt=window.isPresetSystemPrompt=window.isPresetPlaceholderPrompt=noopFalse;
window.default_preset={};

// ============ Tavern Regex API ============
window.formatAsTavernRegexedString=function(s){return s||""};
window.isCharacterTavernRegexesEnabled=noopFalse;
window.getTavernRegexes=function(){return Promise.resolve([])};
window.replaceTavernRegexes=window.updateTavernRegexesWith=noopPromise;

// ============ Slash API ============
window.executeSlashCommands=noopPromise;

// ============ Extension API ============
window.isAdmin=noopFalse;
window.getTavernHelperExtensionId=function(){return ""};
window.getExtensionType=function(){return ""};
window.getExtensionStatus=window.getExtensionInstallationInfo=noopPromise;
window.isInstalledExtension=noopPromiseBool;
window.installExtension=window.uninstallExtension=window.reinstallExtension=window.updateExtension=noopPromise;

// ============ Import API ============
window.importRawCharacter=window.importRawPreset=window.importRawChat=noopPromise;
window.importRawWorldbook=window.importRawTavernRegex=noopPromise;

// ============ Inject API ============
window.injectPrompts=window.uninjectPrompts=noopPromise;

// ============ Audio API ============
window.audioEnable=window.audioImport=window.audioMode=window.audioPlay=window.audioSelect=noop;
window.playAudio=window.pauseAudio=noop;
window.getAudioList=function(){return Promise.resolve([])};
window.replaceAudioList=window.appendAudioList=noopPromise;
window.getAudioSettings=function(){return Promise.resolve({})};
window.setAudioSettings=noopPromise;

// ============ Displayed Message API ============
window.formatAsDisplayedMessage=noopPromise;
window.retrieveDisplayedMessage=noopPromise;
window.refreshOneMessage=noopPromise;

// ============ Macro API ============
window.registerMacroLike=window._registerMacroLike=noop;
window.unregisterMacroLike=noop;
window.substitudeMacros=window.substituteParams=function(s){return s||""};

// ============ Script API ============
var _scriptButtons=[];
window.getAllEnabledScriptButtons=function(){return _scriptButtons.filter(function(b){return b.visible})};
window.getScriptButtons=window._getScriptButtons=function(){return _scriptButtons.slice()};
window.replaceScriptButtons=window._replaceScriptButtons=function(buttons){_scriptButtons=buttons||[];return _scriptButtons};
window.updateScriptButtonsWith=window._updateScriptButtonsWith=function(fn){
  var result=fn(_scriptButtons);
  if(result&&typeof result.then==="function"){
    return result.then(function(r){_scriptButtons=r||[];return _scriptButtons});
  }
  _scriptButtons=result||[];
  return _scriptButtons;
};
window.appendInexistentScriptButtons=window._appendInexistentScriptButtons=function(buttons){
  (buttons||[]).forEach(function(b){
    if(!_scriptButtons.find(function(e){return e.name===b.name})){
      _scriptButtons.push(b);
    }
  });
  return _scriptButtons;
};
window.getScriptName=window._getScriptName=function(){
  var name=window.getIframeName();
  if(name&&name.startsWith("TH-script--")){
    var parts=name.split("--");
    return parts[1]||"";
  }
  return "";
};
window.getScriptInfo=window._getScriptInfo=function(){return ""};
window.replaceScriptInfo=window._replaceScriptInfo=noop;

// ============ Version API ============
window.getTavernHelperVersion=window.getFrontendVersion=function(){return "1.0.0"};
window.getTavernVersion=function(){return "1.12.0"};
window.updateTavernHelper=window.updateFrontendVersion=noopPromise;

// ============ Util API ============
var _globalInitialized={Mvu:true,TavernHelper:true,SillyTavern:true};
window.errorCatched=window.errorCaught=window._errorCatched=function(fn){return typeof fn==="function"?fn:noop};
window.waitGlobalInitialized=window._waitGlobalInitialized=function(name){
  return new Promise(function(resolve){
    if(!name||_globalInitialized[name]){resolve();return}
    var attempts=0;
    var check=function(){
      if(window[name]||_globalInitialized[name]){_globalInitialized[name]=true;resolve();return}
      if(++attempts>100){resolve();return}
      setTimeout(check,50);
    };
    check();
  });
};
window.initializeGlobal=window._initializeGlobal=function(name){_globalInitialized[name]=true;return Promise.resolve()};
window.reloadIframe=window._reloadIframe=function(){try{window.location.reload()}catch(e){}};
window.getIframeName=window._getIframeName=function(){
  var id=window.frameElement&&window.frameElement.id||window.name||window.__TH_IFRAME_ID;
  return id||("TH-iframe-"+Date.now());
};
window.getCurrentMessageId=window._getCurrentMessageId=function(){
  var name=window.getIframeName();
  var match=name&&name.match(/--(d+)--/);
  return match?parseInt(match[1],10):_msgId;
};
window.getScriptId=window._getScriptId=function(){
  var name=window.getIframeName();
  if(name&&name.startsWith("TH-script--")){
    var parts=name.split("--");
    return parts[2]||_scriptId;
  }
  return _scriptId;
};
window.getScriptName=window._getScriptName=function(){
  var name=window.getIframeName();
  if(name&&name.startsWith("TH-script--")){
    var parts=name.split("--");
    return parts[1]||"";
  }
  return "";
};
window.builtin=function(){return {}};

// ============ Misc API ============
window.toastr={success:noop,error:noop,warning:noop,info:noop,clear:noop,remove:noop};
window.saveSettingsDebounced=noop;
window.getRequestHeaders=function(){return {"Content-Type":"application/json"}};
window.sendMessage=window.sendSystemMessage=window.sendNarratorMessage=noop;

// ============ Global vars ============
// 创建一个安全的对象包装器，确保任何属性访问都不会返回 undefined
function createSafeObject(obj){
  if(!obj||typeof obj!=='object')return obj;
  return new Proxy(obj,{
    get:function(target,prop){
      var val=target[prop];
      // 如果属性不存在，返回安全的默认值
      if(val===undefined||val===null){
        // 根据属性名返回合适的默认值
        if(prop==='swipes'||prop==='swipe_info')return [""];
        if(prop==='swipe_id'||prop==='id'||prop==='mes_id')return 0;
        if(prop==='length')return target.length||0;
        if(prop==='data'||prop==='extra')return createSafeObject({swipes:[""],swipe_id:0});
        if(typeof prop==='string'&&!isNaN(parseInt(prop,10)))return "";
        return createSafeObject({});
      }
      // 如果是数组，确保可以安全访问
      if(Array.isArray(val)){
        return new Proxy(val,{
          get:function(arr,idx){
            if(idx==='length')return arr.length;
            if(!isNaN(parseInt(idx,10))){
              var i=parseInt(idx,10);
              return arr[i]!==undefined?arr[i]:"";
            }
            return arr[idx];
          }
        });
      }
      // 如果是对象，递归包装
      if(typeof val==='object'&&val!==null){
        return createSafeObject(val);
      }
      return val;
    }
  });
}

// 创建默认消息模板
function createDefaultMessage(id){
  var msg={
    id:id||0,
    mes_id:id||0,
    name:"Assistant",
    is_user:false,
    is_system:false,
    mes:"",
    message:"",
    // Swipe 相关
    swipes:[""],
    swipe_id:0,
    swipe_info:[{send_date:Date.now(),gen_started:Date.now(),gen_finished:Date.now(),extra:{}}],
    // 额外数据
    extra:{
      api:"openai",
      model:"gpt-4",
      swipes:[""],
      swipe_id:0
    },
    data:{
      stat_data:klona(_mvuData.stat_data||{}),
      display_data:klona(_mvuData.display_data||{}),
      swipes:[""],
      swipe_id:0
    },
    send_date:Date.now(),
    gen_started:Date.now(),
    gen_finished:Date.now(),
    // 更多可能被访问的属性
    force_avatar:null,
    original_avatar:null,
    is_name:true,
    is_hidden:false
  };
  return createSafeObject(msg);
}

// 使用 Proxy 包装 chat 数组，确保访问任何索引都返回有效的消息对象
var _chatArray=[createDefaultMessage(0)];
window.chat=new Proxy(_chatArray,{
  get:function(target,prop){
    // 如果是数字索引
    if(!isNaN(parseInt(prop,10))){
      var idx=parseInt(prop,10);
      // 如果索引不存在，返回默认消息对象
      if(idx<0||idx>=target.length){
        return createDefaultMessage(idx);
      }
      // 确保消息对象有 swipes 数组
      var msg=target[idx];
      if(!msg.swipes)msg.swipes=[""];
      if(typeof msg.swipe_id!=="number")msg.swipe_id=0;
      return msg;
    }
    // 其他属性正常返回
    return target[prop];
  },
  set:function(target,prop,value){
    target[prop]=value;
    return true;
  }
});
window.chat_metadata={};
window.characters=[];
window.this_chid=0;
window.name1="User";
window.name2="Assistant";
window.extension_settings={variables:{global:{}}};
window.getApiUrl=function(){return ""};

// ============ 更多全局变量（角色卡脚本可能直接访问）============
window.active_character=0;
window.selected_group=null;
window.is_group_generating=false;
window.is_send_press=false;
window.is_gen_pressed=false;
window.count_view_mes=1; // 至少有一条消息
window.generation_started=null;
window.swipes=true; // 启用 swipes 功能
window.swipe_right=noop;
window.swipe_left=noop;

// 当前选中的消息 ID（用于 swipe）
window.editable_mes_id=0;

// 获取当前消息的 swipes（同步版本）
window.getCurrentSwipes=function(){
  var mesId=window.count_view_mes>0?window.count_view_mes-1:0;
  var msg=window.chat[mesId];
  return msg&&msg.swipes?msg.swipes:[""];
};

// 获取当前 swipe ID（同步版本）
window.getCurrentSwipeId=function(){
  var mesId=window.count_view_mes>0?window.count_view_mes-1:0;
  var msg=window.chat[mesId];
  return msg&&typeof msg.swipe_id==="number"?msg.swipe_id:0;
};

// 获取最后一条消息（同步版本，角色卡脚本常用）
window.getLastMessage=function(){
  var mesId=window.chat.length>0?window.chat.length-1:0;
  return window.chat[mesId];
};

// 获取指定索引的消息（同步版本）
window.getMessage=function(mesId){
  return window.chat[mesId]||window.chat[0];
};

// 获取消息的 swipes（同步版本）
window.getSwipesSync=function(mesId){
  var msg=window.chat[mesId];
  if(!msg)return [""];
  if(!msg.swipes)msg.swipes=[""];
  return msg.swipes;
};

// 切换 swipe（同步版本）
window.switchSwipeSync=function(mesId,swipeId){
  var msg=window.chat[mesId];
  if(msg){
    if(!msg.swipes)msg.swipes=[""];
    msg.swipe_id=Math.min(Math.max(0,swipeId||0),msg.swipes.length-1);
    if(msg.swipes[msg.swipe_id]!==undefined){
      msg.mes=msg.swipes[msg.swipe_id];
      msg.message=msg.swipes[msg.swipe_id];
    }
  }
  return msg;
};

// SAM_data 兼容（某些角色卡脚本需要）
window.SAM_data={static:{},dynamic:{},config:{}};
window.modules=window.online_status="";
window.power_user={};
window.oai_settings={};
window.nai_settings={};
window.system_message_types={NARRATOR:"narrator"};
window.event_types={MESSAGE_SENT:"message_sent",MESSAGE_RECEIVED:"message_received",USER_MESSAGE_RENDERED:"user_message_rendered",CHARACTER_MESSAGE_RENDERED:"character_message_rendered"};
window.eventSource=evs;
window.messageFormatting=function(m){return m};
window.substituteParamsExtended=function(s){return s||""};
window.addOneMessage=noop;
window.reloadCurrentChat=noopPromise;
window.saveChatConditional=noopPromise;
window.showSwipeButtons=noop;

// ============ 更多 Swipe 相关全局函数 ============
// 获取消息的 swipe（确保返回有效数组）
window.getMessageSwipes=function(mesId){
  var msg=window.chat[mesId];
  if(msg&&msg.swipes)return msg.swipes;
  return [""];
};
// 获取当前 swipe ID
window.getMessageSwipeId=function(mesId){
  var msg=window.chat[mesId];
  return msg&&typeof msg.swipe_id==="number"?msg.swipe_id:0;
};
// 切换到指定 swipe
window.switchToSwipe=function(mesId,swipeId){
  var msg=window.chat[mesId];
  if(msg){
    msg.swipe_id=swipeId||0;
    if(msg.swipes&&msg.swipes[msg.swipe_id]){
      msg.mes=msg.swipes[msg.swipe_id];
      msg.message=msg.swipes[msg.swipe_id];
    }
  }
  return Promise.resolve();
};
// 生成新的 swipe
window.generateSwipe=function(mesId){
  return Promise.resolve("");
};
// 删除 swipe
window.deleteSwipeAt=function(mesId,swipeId){
  var msg=window.chat[mesId];
  if(msg&&msg.swipes&&swipeId>=0&&swipeId<msg.swipes.length){
    msg.swipes.splice(swipeId,1);
    if(msg.swipe_id>=msg.swipes.length){
      msg.swipe_id=Math.max(0,msg.swipes.length-1);
    }
  }
  return Promise.resolve();
};

// ============ TavernHelper object ============
window.TavernHelper={
  _th_impl:{_init:noop,_log:noop,_clearLog:noop,writeExtensionField:noop},
  _bind:{
    _eventOn:eventOn,_eventOnButton:eventOn,_eventMakeLast:eventMakeLast,
    _eventMakeFirst:eventMakeFirst,_eventOnce:eventOnce,_eventEmit:eventEmit,
    _eventEmitAndWait:eventEmitAndWait,_eventRemoveListener:eventRemoveListener,
    _eventClearEvent:eventClearEvent,_eventClearListener:eventClearListener,_eventClearAll:eventClearAll,
    _initializeGlobal:window._initializeGlobal,_waitGlobalInitialized:window._waitGlobalInitialized,
    _registerMacroLike:window._registerMacroLike,
    _getButtonEvent:getButtonEvent,_getScriptButtons:window._getScriptButtons,
    _replaceScriptButtons:window._replaceScriptButtons,_updateScriptButtonsWith:window._updateScriptButtonsWith,
    _appendInexistentScriptButtons:window._appendInexistentScriptButtons,_getScriptName:window._getScriptName,
    _getScriptInfo:window._getScriptInfo,_replaceScriptInfo:window._replaceScriptInfo,
    _getVariables:window._getVariables,_getAllVariables:window._getAllVariables,
    _replaceVariables:window._replaceVariables,_updateVariablesWith:window._updateVariablesWith,
    _insertOrAssignVariables:window._insertOrAssignVariables,_insertVariables:window._insertVariables,
    _deleteVariable:window._deleteVariable,
    _reloadIframe:window._reloadIframe,_errorCatched:window._errorCatched,
    _getIframeName:window._getIframeName,_getScriptId:window._getScriptId,_getCurrentMessageId:window._getCurrentMessageId
  },
  // Event methods
  eventOn:eventOn,eventOnce:eventOnce,eventEmit:eventEmit,eventEmitAndWait:eventEmitAndWait,
  eventMakeLast:eventMakeLast,eventMakeFirst:eventMakeFirst,eventRemoveListener:eventRemoveListener,
  eventClearEvent:eventClearEvent,eventClearListener:eventClearListener,eventClearAll:eventClearAll,
  getButtonEvent:getButtonEvent,
  // Slash commands
  triggerSlash:window.triggerSlash,triggerSlashWithResult:window.triggerSlash,
  // Chat messages
  getChatMessages:window.getChatMessages,setChatMessages:window.setChatMessages,setChatMessage:window.setChatMessage,
  createChatMessages:window.createChatMessages,deleteChatMessages:window.deleteChatMessages,rotateChatMessages:window.rotateChatMessages,
  // Variables
  getVariables:window.getVariables,getAllVariables:window.getAllVariables,replaceVariables:window.replaceVariables,
  updateVariablesWith:window.updateVariablesWith,insertVariables:window.insertVariables,
  insertOrAssignVariables:window.insertOrAssignVariables,deleteVariable:window.deleteVariable,
  registerVariableSchema:window.registerVariableSchema,
  // Generate
  generate:window.generate,generateRaw:window.generateRaw,stopGenerationById:window.stopGenerationById,stopAllGeneration:window.stopAllGeneration,
  builtin_prompt_default_order:window.builtin_prompt_default_order,
  // Utils
  waitGlobalInitialized:window.waitGlobalInitialized,initializeGlobal:window.initializeGlobal,
  errorCatched:window.errorCatched,getLastMessageId:window.getLastMessageId,getMessageId:window.getMessageId,
  substitudeMacros:window.substitudeMacros,
  // Constants
  tavern_events:window.tavern_events,iframe_events:window.iframe_events,builtin:window.builtin,
  // Lorebook/Worldbook
  getLorebookEntries:window.getLorebookEntries,getWorldbook:window.getWorldbook,getWorldbookNames:window.getWorldbookNames,
  // Character
  getCharacterNames:window.getCharacterNames,getCurrentCharacterName:window.getCurrentCharacterName,
  getCharacter:window.getCharacter,createCharacter:window.createCharacter,
  // Display
  formatAsDisplayedMessage:window.formatAsDisplayedMessage,retrieveDisplayedMessage:window.retrieveDisplayedMessage,
  refreshOneMessage:window.refreshOneMessage,
  // Audio
  audioEnable:window.audioEnable,playAudio:window.playAudio,pauseAudio:window.pauseAudio,
  getAudioList:window.getAudioList,getAudioSettings:window.getAudioSettings,
  // Version
  getTavernHelperVersion:window.getTavernHelperVersion,getFrontendVersion:window.getFrontendVersion,
  getTavernVersion:window.getTavernVersion,
  // Popup
  Popup:Popup,POPUP_TYPE:POPUP_TYPE,POPUP_RESULT:POPUP_RESULT,callGenericPopup:ctx.callGenericPopup
};

// ============ EjsTemplate 兼容 ============
window.EjsTemplate={
  evalTemplate:function(code,context,options){return Promise.resolve(code||"")},
  prepareContext:function(additional,last_message_id){return Promise.resolve(additional||{})},
  getSyntaxErrorInfo:function(code,output_line_count){return Promise.resolve("")},
  allVariables:function(end_message_id){
    var result={};
    Object.keys(_variables).forEach(function(k){Object.assign(result,_variables[k])});
    return result;
  },
  getFeatures:function(){return {enabled:false}},
  setFeatures:noop,
  resetFeatures:noop
};

// ============ YAML 兼容 ============
// 简单的 YAML 解析器，处理常见的 YAML 格式
window.YAML={
  parse:function(str){
    if(!str)return {};
    try{
      // 预处理：将 tab 替换为 2 个空格（YAML 不允许 tab 缩进）
      var processed=str.replace(/	/g,'  ');

      // 尝试 JSON 解析（如果是 JSON 格式）
      if(processed.trim().startsWith('{')||processed.trim().startsWith('[')){
        return JSON.parse(processed);
      }

      // 简单的 YAML 解析（支持基本格式）
      var result={};
      var lines=processed.split('\\n');
      var stack=[{obj:result,indent:-1}];
      var currentArray=null;

      for(var i=0;i<lines.length;i++){
        var line=lines[i];
        var trimmed=line.trim();
        if(!trimmed||trimmed.startsWith('#'))continue;

        // 计算缩进
        var indent=0;
        while(indent<line.length&&line[indent]===' ')indent++;

        // 处理数组项
        if(trimmed.startsWith('- ')){
          var value=trimmed.slice(2).trim();
          // 找到当前层级的父对象
          while(stack.length>1&&stack[stack.length-1].indent>=indent){
            stack.pop();
          }
          var parent=stack[stack.length-1].obj;
          if(Array.isArray(parent)){
            if(value.includes(': ')){
              var obj={};
              var kv=value.split(': ');
              obj[kv[0].trim()]=parseYamlValue(kv.slice(1).join(': ').trim());
              parent.push(obj);
              stack.push({obj:obj,indent:indent});
            }else{
              parent.push(parseYamlValue(value));
            }
          }
          continue;
        }

        // 处理键值对
        var colonIdx=trimmed.indexOf(': ');
        if(colonIdx===-1)colonIdx=trimmed.indexOf(':');
        if(colonIdx>0){
          var key=trimmed.slice(0,colonIdx).trim();
          var value=trimmed.slice(colonIdx+1).trim();

          // 弹出缩进更深或相等的层级
          while(stack.length>1&&stack[stack.length-1].indent>=indent){
            stack.pop();
          }
          var parent=stack[stack.length-1].obj;

          if(!value||value===''||value===':'||trimmed.endsWith(':')){
            // 嵌套对象或数组
            var nextLine=lines[i+1];
            if(nextLine&&nextLine.trim().startsWith('- ')){
              parent[key]=[];
              stack.push({obj:parent[key],indent:indent});
            }else{
              parent[key]={};
              stack.push({obj:parent[key],indent:indent});
            }
          }else{
            parent[key]=parseYamlValue(value);
          }
        }
      }

      return result;
    }catch(e){
      console.warn('[YAML.parse] error:',e.message);
      return {};
    }
  },
  stringify:function(obj){return JSON.stringify(obj,null,2)}
};

function parseYamlValue(v){
  if(!v)return '';
  v=v.trim();
  if(v==='true')return true;
  if(v==='false')return false;
  if(v==='null'||v==='~')return null;
  if(/^-?\\d+$/.test(v))return parseInt(v,10);
  if(/^-?\\d+\\.\\d+$/.test(v))return parseFloat(v);
  // 移除引号
  if((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'"))){
    return v.slice(1,-1);
  }
  return v;
}

// ============ jsyaml 代理已在文件开头通过 Object.defineProperty 实现 ============
// 这里不再需要额外的代理代码

// ============ showdown 兼容 ============
window.showdown={
  Converter:function(){
    this.makeHtml=function(text){return text||""};
    this.setOption=noop;
  }
};

// ============ zod (z) 兼容 ============
window.z={
  string:function(){return this},
  number:function(){return this},
  boolean:function(){return this},
  object:function(schema){return this},
  array:function(schema){return this},
  optional:function(){return this},
  nullable:function(){return this},
  default:function(v){return this},
  parse:function(v){return v},
  safeParse:function(v){return {success:true,data:v}},
  toJSONSchema:function(){return {}}
};

// HTMLMediaElement play compatibility
var _origPlay=HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play=function(){return _origPlay.apply(this,arguments).catch(function(){})};

// ============ 自动提取并执行 _.set() 命令 ============
// 在页面加载完成后，从所有 <script> 标签中提取 _.set() 命令并执行
// 这样即使 YAML 解析失败，也能从 HTML 脚本中获取状态数据
function autoExtractAndExecuteSetCommands(){
  try{
    var scripts=document.querySelectorAll("script");
    var setRegex=/_\\.set\\s*\\(\\s*(['"\`])([^'"\`]+)\\1\\s*,\\s*([^,)]+)(?:\\s*,\\s*([^)]+))?\\s*\\)/g;
    var count=0;
    for(var i=0;i<scripts.length;i++){
      var text=scripts[i].textContent||"";
      var match;
      while((match=setRegex.exec(text))!==null){
        var path=match[2];
        var valueStr=(match[4]||match[3]).trim();
        var value;
        try{
          // 尝试 JSON 解析
          value=JSON.parse(valueStr);
        }catch(e){
          // 去掉引号作为字符串
          value=valueStr.replace(/^['"\`]|['"\`]$/g,"");
        }
        // 调用 _.set 来设置值
        if(window._&&window._.set){
          window._.set(path,value);
          count++;
        }
      }
    }
    if(count>0){
      console.log("[autoExtractAndExecuteSetCommands] executed",count,"_.set commands");
    }
  }catch(e){
    console.warn("[autoExtractAndExecuteSetCommands] error:",e);
  }
}

// 触发 DOMContentLoaded 和 load 事件，确保脚本不会卡住
if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",function(){
    // 先执行自动提取，再触发事件
    autoExtractAndExecuteSetCommands();
    window.dispatchEvent(new Event("DOMContentLoaded"));
  });
}else{
  setTimeout(function(){
    // 先执行自动提取
    autoExtractAndExecuteSetCommands();
    try{window.dispatchEvent(new Event("DOMContentLoaded"))}catch(e){}
    try{window.dispatchEvent(new Event("load"))}catch(e){}
  },0);
}

// Lodash compatibility (if not loaded)
if(typeof window._==="undefined"){
  window._={
    get:function(o,p,d){try{var k=Array.isArray(p)?p:p.split(".");for(var i=0;i<k.length;i++){o=o[k[i]];if(o===undefined)return d}return o}catch(e){return d}},
    set:function(o,p,v){
      // 如果第一个参数是字符串（路径），则设置到 _mvuData.stat_data 和 _variables.chat
      if(typeof o==="string"){
        var path=o;
        var newVal=v!==undefined?v:p;
        var k=path.split(".");
        // 设置到 _mvuData.stat_data
        var target=_mvuData.stat_data;
        for(var i=0;i<k.length-1;i++){
          if(!target[k[i]])target[k[i]]={};
          target=target[k[i]];
        }
        target[k[k.length-1]]=newVal;
        // 同步到 display_data
        if(!_mvuData.display_data)_mvuData.display_data={};
        var dt=_mvuData.display_data;
        for(var j=0;j<k.length-1;j++){
          if(!dt[k[j]])dt[k[j]]={};
          dt=dt[k[j]];
        }
        dt[k[k.length-1]]=newVal;
        // 同步到 _variables.chat（关键！让 getAllVariables 能获取到数据）
        if(!_variables.chat)_variables.chat={};
        var vc=_variables.chat;
        for(var m=0;m<k.length-1;m++){
          if(!vc[k[m]])vc[k[m]]={};
          vc=vc[k[m]];
        }
        vc[k[k.length-1]]=newVal;
        console.log("[_.set] path:",path,"value:",newVal);
        return _mvuData;
      }
      // 正常的对象属性设置
      var k=Array.isArray(p)?p:p.split(".");
      for(var i=0;i<k.length-1;i++){if(!o[k[i]])o[k[i]]={};o=o[k[i]]}
      o[k[k.length-1]]=v;
      return o;
    },
    has:function(o,p){return this.get(o,p)!==undefined},
    unset:function(o,p){var k=Array.isArray(p)?p:p.split(".");for(var i=0;i<k.length-1;i++){o=o[k[i]];if(!o)return false}delete o[k[k.length-1]];return true},
    merge:function(){var r={};for(var i=0;i<arguments.length;i++){Object.assign(r,arguments[i])}return r},
    mergeWith:function(o,s,c){Object.keys(s||{}).forEach(function(k){o[k]=c?c(o[k],s[k],k):s[k]});return o},
    clamp:function(n,l,u){return Math.min(Math.max(n,l),u)},
    range:function(s,e){var r=[];if(e===undefined){e=s;s=0}for(var i=s;i<e;i++)r.push(i);return r},
    times:function(n,f){var r=[];for(var i=0;i<n;i++)r.push(f(i));return r},
    constant:function(v){return function(){return v}},
    sortBy:function(a,k){return a.slice().sort(function(x,y){var xv=typeof k==="function"?k(x):x[k];var yv=typeof k==="function"?k(y):y[k];return xv>yv?1:-1})},
    groupBy:function(a,k){var r={};a.forEach(function(i){var g=typeof k==="function"?k(i):i[k];if(!r[g])r[g]=[];r[g].push(i)});return r},
    pullAt:function(a,i){i.sort(function(x,y){return y-x}).forEach(function(idx){a.splice(idx,1)})},
    inRange:function(n,s,e){if(e===undefined){e=s;s=0}return n>=s&&n<e},
    isArray:Array.isArray,
    isPlainObject:function(o){return o&&typeof o==="object"&&!Array.isArray(o)},
    isString:function(v){return typeof v==="string"},
    isNumber:function(v){return typeof v==="number"},
    isFunction:function(v){return typeof v==="function"},
    isNil:function(v){return v===null||v===undefined},
    isEmpty:function(v){if(v==null)return true;if(Array.isArray(v)||typeof v==="string")return v.length===0;return Object.keys(v).length===0},
    filter:function(a,f){return a.filter(f)},
    map:function(a,f){return a.map(f)},
    find:function(a,f){return a.find(f)},
    findIndex:function(a,f){return a.findIndex(f)},
    forEach:function(a,f){a.forEach(f)},
    reduce:function(a,f,init){return a.reduce(f,init)},
    every:function(a,f){return a.every(f)},
    some:function(a,f){return a.some(f)},
    includes:function(a,v){return a.includes(v)},
    max:function(a){return Math.max.apply(null,a)},
    min:function(a){return Math.min.apply(null,a)},
    sum:function(a){return a.reduce(function(s,v){return s+v},0)},
    first:function(a){return a[0]},
    last:function(a){return a[a.length-1]},
    head:function(a){return a[0]},
    tail:function(a){return a.slice(1)},
    take:function(a,n){return a.slice(0,n||1)},
    drop:function(a,n){return a.slice(n||1)},
    flatten:function(a){return a.flat()},
    flattenDeep:function(a){return a.flat(Infinity)},
    uniq:function(a){return Array.from(new Set(a))},
    compact:function(a){return a.filter(Boolean)},
    reverse:function(a){return a.slice().reverse()},
    concat:function(){return Array.prototype.concat.apply([],arguments)},
    chunk:function(a,s){var r=[];for(var i=0;i<a.length;i+=s)r.push(a.slice(i,i+s));return r},
    pick:function(o,keys){var r={};keys.forEach(function(k){if(o&&o[k]!==undefined)r[k]=o[k]});return r},
    omit:function(o,keys){var r=Object.assign({},o);keys.forEach(function(k){delete r[k]});return r},
    keys:function(o){return Object.keys(o||{})},
    values:function(o){return Object.values(o||{})},
    entries:function(o){return Object.entries(o||{})},
    fromPairs:function(a){var r={};a.forEach(function(p){r[p[0]]=p[1]});return r},
    toPairs:function(o){return Object.entries(o||{})},
    assign:Object.assign,
    defaults:function(o){for(var i=1;i<arguments.length;i++){var s=arguments[i];Object.keys(s||{}).forEach(function(k){if(o[k]===undefined)o[k]=s[k]})}return o},
    clone:function(v){return JSON.parse(JSON.stringify(v))},
    cloneDeep:function(v){return JSON.parse(JSON.stringify(v))},
    debounce:function(f,w){var t;return function(){var a=arguments;clearTimeout(t);t=setTimeout(function(){f.apply(null,a)},w)}},
    throttle:function(f,w){var t=0;return function(){var n=Date.now();if(n-t>=w){t=n;f.apply(null,arguments)}}},
    noop:function(){},
    identity:function(v){return v},
    update:function(o,p,f){var v=this.get(o,p);this.set(o,p,f(v));return o}
  };
}
})();
<\/script>
<script src="https://cdn.jsdelivr.net/npm/vue@3.4.21/dist/vue.global.prod.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.js"><\/script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.css">
<script>
// Ensure $ is set after jQuery loads
if(typeof jQuery!=="undefined"&&typeof window.$==="undefined"){window.$=jQuery}
// Ensure toastr is available
if(typeof toastr==="undefined"){
  window.toastr={success:function(){},error:function(){},warning:function(){},info:function(){},clear:function(){},remove:function(){}};
}
// YAML stub (if scripts need it)
if(typeof window.YAML==="undefined"){
  window.YAML={parse:function(s){try{return JSON.parse(s)}catch(e){return s}},stringify:function(o){return JSON.stringify(o)}};
}
// showdown stub (if scripts need it)
if(typeof window.showdown==="undefined"){
  window.showdown={Converter:function(){this.makeHtml=function(s){return s||""}}};
}
// EjsTemplate stub
if(typeof window.EjsTemplate==="undefined"){
  window.EjsTemplate={render:function(t,d){return t||""}};
}
// Zod stub (z)
if(typeof window.z==="undefined"){
  window.z={object:function(){return this},string:function(){return this},number:function(){return this},boolean:function(){return this},array:function(){return this},optional:function(){return this},parse:function(v){return v}};
}
<\/script>`}function Et(e,t={}){if(!e||typeof e!=`string`)return e;let{userName:n=`用户`,charName:r=`角色`,userInfo:i={},characterInfo:a={},lastUserMessage:o=``}=t,s=e;return s=s.replace(/\{\{user\}\}/gi,n).replace(/\{\{char\}\}/gi,r).replace(/\{\{User\}\}/g,n).replace(/\{\{Char\}\}/g,r).replace(/\{\{lastUserMessage\}\}/gi,o).replace(/\{\{lastMessage\}\}/gi,o).replace(/\{\{time\}\}/gi,new Date().toLocaleTimeString()).replace(/\{\{date\}\}/gi,new Date().toLocaleDateString()).replace(/\{\{weekday\}\}/gi,()=>[`日`,`一`,`二`,`三`,`四`,`五`,`六`][new Date().getDay()]||`日`).replace(/\{\{isotime\}\}/gi,()=>new Date().toISOString()).replace(/\{\{isodate\}\}/gi,()=>new Date().toISOString().split(`T`)[0]||``).replace(/\{\{idle_duration\}\}/gi,`0`).replace(/\{\{random\}\}/gi,()=>Math.random().toString()).replace(/\{\{roll:(\d+)\}\}/gi,(e,t)=>String(Math.floor(Math.random()*parseInt(t,10))+1)).replace(/\{\{random:(\d+)-(\d+)\}\}/gi,(e,t,n)=>{let r=parseInt(t,10);return String(Math.floor(Math.random()*(parseInt(n,10)-r+1))+r)}).replace(/\{\{newline\}\}/gi,`
`).replace(/\{\{trim\}\}/gi,``).replace(/\{\{noop\}\}/gi,``),s=s.replace(/\{\{user_avatar\}\}/gi,i?.avatar||``).replace(/\{\{char_avatar\}\}/gi,a?.avatar||a?.image||``).replace(/\{\{persona\}\}/gi,i?.username||n).replace(/\{\{description\}\}/gi,a?.description||``).replace(/\{\{personality\}\}/gi,a?.personality||``).replace(/\{\{scenario\}\}/gi,a?.scenario||``).replace(/\{\{char_name\}\}/gi,a?.name||r).replace(/\{\{user_name\}\}/gi,i?.username||n),s=s.replace(/\{\{getvar::([^}]+)\}\}/gi,()=>``),s}function Dt(e){if(!e)return e;let t=/min-height\s*:\s*[^;{}]*\d+(?:\.\d+)?vh/gi.test(e),n=/style\s*=\s*(["'])[\s\S]*?min-height\s*:\s*[^;]*?\d+(?:\.\d+)?vh[\s\S]*?\1/gi.test(e),r=/(\.style\.minHeight\s*=\s*(["']))([\s\S]*?vh)(\2)/gi.test(e)||/(setProperty\s*\(\s*(["'])min-height\2\s*,\s*(["']))([\s\S]*?vh)(\3\s*\))/gi.test(e);if(!t&&!n&&!r)return e;let i=`var(--TH-viewport-height, 100vh)`,a=e=>e.replace(/(\d+(?:\.\d+)?)vh\b/gi,(e,t)=>{let n=parseFloat(t);return isFinite(n)?n===100?i:`calc(${i} * ${n/100})`:e});return e=e.replace(/(min-height\s*:\s*)([^;{}]*?\d+(?:\.\d+)?vh)(?=\s*[;}])/gi,(e,t,n)=>`${t}${a(n)}`),e=e.replace(/(style\s*=\s*(["']))([^"']*?)(\2)/gi,(e,t,n,r,i)=>/min-height\s*:\s*[^;]*vh/i.test(r)?`${t}${r.replace(/(min-height\s*:\s*)([^;]*?\d+(?:\.\d+)?vh)/gi,(e,t,n)=>`${t}${a(n)}`)}${i}`:e),e=e.replace(/(\.style\.minHeight\s*=\s*(["']))([\s\S]*?)(\2)/gi,(e,t,n,r,i)=>/\b\d+(?:\.\d+)?vh\b/i.test(r)?`${t}${a(r)}${i}`:e),e=e.replace(/(setProperty\s*\(\s*(["'])min-height\2\s*,\s*(["']))([\s\S]*?)(\3\s*\))/gi,(e,t,n,r,i,o)=>/\b\d+(?:\.\d+)?vh\b/i.test(i)?`${t}${a(i)}${o}`:e),e}function Ot(e){return e?.avatar||`/static/images/default-avatar.png`}function kt(e){return e?.avatar||e?.image||`/static/images/default-char.png`}function At(){return`<script>
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
<\/script>`}function jt(){return`<script>
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
<\/script>`}function Mt(){return`
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
`}function $(e,t={}){let{userInfo:n={},characterInfo:r={},useBlobUrl:i=!1,baseUrl:a=``,messageId:o=``,includeThirdParty:s=!0,userName:c=``,charName:l=``,lastUserMessage:u=``}=t,d=Dt(Et((e||``).replace(/\t/g,`  `),{userName:c||n?.username||`用户`,charName:l||r?.name||`角色`,userInfo:n,characterInfo:r,lastUserMessage:u})),f=Tt(),p=At(),m=jt(),h=s?Mt():``,ee=Ot(n),g=kt(r),_=o?`TH-message--${o}`:`TH-iframe-${Date.now()}`;return`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
${i&&a?`<base href="${a}"/>`:``}
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
  background-image: url('${ee}');
  background-size: cover;
  background-position: center;
}
.char_avatar, .char-avatar {
  background-image: url('${g}');
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
${f}
${h}
${p}
${m}
<script>
// 设置 iframe 名称供脚本使用
window.__TH_IFRAME_ID = '${_}';
window.name = '${_}';
<\/script>
</head>
<body>
${d}
</body>
</html>`}q.setOptions({breaks:!0,gfm:!0});var Nt={userName:`用户`,charName:`角色`,lastUserMessage:``,userInfo:{},characterInfo:{},messageId:``};function Pt(e){if(!e||typeof e!=`string`)return{type:`empty`};let t=e.trim();if(/<div[^>]*class="[^"]*TH-render[^"]*"[^>]*>/i.test(e)){let t=ct(e);if(t.length>0){let n=t[0];return t.length===1&&e.trim()===n.full.trim()?{type:`fullHtmlDoc`,html:n.html}:{type:`nestedFrontend`,html:e,frontends:t}}}let n=ft(e);if(n&&J(n)){let t=mt(e);return{type:t?`mixed`:`fullHtmlDoc`,text:t,html:n}}let r=pt(e);if(r){let t=mt(e);return{type:t?`mixed`:`fullHtmlDoc`,text:t,html:r}}if(J(t))return{type:`fullHtmlDoc`,html:t};if(ot(e)){let t=st(e);if(t.length>0)return{type:`nestedFrontend`,html:e,frontends:t}}return dt(e)||at(e)?{type:`dangerousHtml`,html:e}:lt(e)&&!ut(e)?{type:`htmlFragment`,html:e}:ut(e)?{type:`markdown`,content:e}:{type:`text`,content:e}}function Ft(e){if(!e)return e;let t=[],n=e.replace(/```([^`]*)```/gs,(e,n)=>{let r=(n||``).trim();if(r.startsWith(`html`)||/<[^>]+>/.test(r))return e;let i=t.length;return t.push(r),`__STATBAR_${i}__`});return n=n.replace(/__STATBAR_(\d+)__/g,(e,n)=>{let r=t[parseInt(n,10)];return wt(r||``)}),n}function It(e,t){for(let[n,r]of Object.entries(t)){let t=e?`${e}.${n}`:n;typeof r==`object`&&r&&!Array.isArray(r)?It(t,r):St(t,r,`chat`)}}function Lt(e,t={}){if(!e)return{content:``,variables:{},variableHtml:``};let n=e,{content:r,variables:i}=bt(n);if(n=r,Object.keys(i).length>0)for(let[e,t]of Object.entries(i))typeof t==`object`&&t?It(e,t):St(e,t,`chat`);n=gt(n),n=_t(n),n=Z(n,t),n=Ft(n);let a=Object.keys(i).length>0?xt(i):``;return{content:n,variables:i,variableHtml:a}}function Rt(e,t={}){if(!e)return e;let n=e;return n=Z(n,t),n=n.replace(/\r\n/g,`
`).replace(/\n/g,`<br>`),n}function zt(e,t={}){let n={...Nt,...t},{role:r,content:i,id:a}=e||{},o=a||n.messageId||`msg_${Date.now()}`;if(!i)return{kind:`text`,html:``,text:``,messageId:o,variables:{}};let s=ht(i),c={},l=``;if(r!==`user`){let e=Lt(s,n);s=e.content,c=e.variables,l=e.variableHtml}let u=Pt(s),d={userInfo:n.userInfo,characterInfo:n.characterInfo,messageId:o,userName:n.userName,charName:n.charName,lastUserMessage:n.lastUserMessage};switch(u.type){case`empty`:return{kind:`text`,html:``,text:``,messageId:o,variables:c,variableHtml:l};case`fullHtmlDoc`:return{kind:`iframe`,html:$(u.html||``,d),messageId:o,variables:c,variableHtml:l};case`mixed`:return{kind:`mixed`,text:u.text||``,textHtml:Ct(u.text||``)||Q(u.text||``).replace(/\n/g,`<br>`),html:$(u.html||``,d),messageId:o,variables:c,variableHtml:l};case`dangerousHtml`:return{kind:`iframe`,html:$(u.html||``,d),messageId:o,variables:c,variableHtml:l};case`nestedFrontend`:return{kind:`nestedIframe`,html:u.html||``,frontends:(u.frontends||[]).map((e,t)=>({full:e.full,iframe:$(e.html,{...d,messageId:`${o}--${t}`})})),messageId:o,variables:c,variableHtml:l};case`htmlFragment`:return{kind:`html`,html:Rt(u.html||``,n)+l,messageId:o,variables:c};case`markdown`:return{kind:`markdown`,html:Ct(Z(u.content||``,n))+l,messageId:o,variables:c};default:return{kind:`html`,html:Q(Z(u.content||``,n)).replace(/\n/g,`<br>`)+l,messageId:o,variables:c}}}var Bt={class:`shrink-0 flex flex-col h-full max-h-full overflow-hidden`},Vt={key:0,class:`flex-1 min-h-[500px] max-h-[700px] rounded-2xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 transition-all hover:border-gray-400 dark:hover:border-gray-600`},Ht={class:`flex-1 min-h-[500px] max-h-[700px] rounded-[2rem] border-[6px] border-gray-800 dark:border-gray-900 bg-gray-800 shadow-2xl overflow-hidden flex flex-col`},Ut={key:0,class:`absolute inset-0 bg-gradient-to-b from-cyan-100 to-cyan-50 dark:from-gray-700 dark:to-gray-800`},Wt={class:`relative z-10 flex items-center justify-center px-4 py-3 bg-black/40 backdrop-blur-sm shrink-0`},Gt={class:`text-center`},Kt={class:`font-medium text-white text-sm drop-shadow-md`},qt={class:`flex-1 min-h-0 relative z-10 p-3 overflow-y-auto space-y-3`},Jt={key:0,class:`flex items-center justify-center h-full`},Yt={key:1,class:`w-8 h-8 rounded-full mr-2 shrink-0 bg-gray-300 flex items-center justify-center self-start`},Xt={key:1,class:`iframe-wrap flex-1`},Zt=[`src`],Qt={key:2,class:`flex-1`},$t=[`innerHTML`],en={class:`iframe-wrap`},tn=[`src`],nn={key:0},rn=[`innerHTML`],an={key:2,class:`flex justify-start`},on={key:1,class:`w-8 h-8 rounded-full mr-2 shrink-0 bg-gray-300 flex items-center justify-center self-start`},sn={class:`bg-white/80 backdrop-blur rounded-lg p-3 text-sm text-gray-700 leading-relaxed max-w-[75%]`},cn={key:3,class:`flex items-center justify-center h-full`},ln={class:`relative z-10 p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm shrink-0`},un={class:`flex items-center gap-2`},dn={class:`w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center text-white shadow-md`},fn=Object.assign(v(t({__name:`PhonePreview`,props:{name:{default:`未命名角色`},backgroundImage:{default:``},avatarImage:{default:``},greetings:{default:()=>[]},chatHistory:{default:()=>[]},loading:{type:Boolean,default:!1},showToggle:{type:Boolean,default:!1}},emits:[`preview`],setup(t,{expose:v,emit:y}){let b=y,x=t,S=i(!x.showToggle),C=e(()=>x.avatarImage||x.backgroundImage),re=e=>{let t=new Blob([e],{type:`text/html`});return URL.createObjectURL(t)},w=e(()=>!x.chatHistory||x.chatHistory.length===0?[]:x.chatHistory.map(e=>{let t=zt({role:e.role,content:e.content});return t.kind===`iframe`||t.kind===`mixed`?{role:e.role,raw:e.content,kind:t.kind,html:t.html,blobUrl:re(t.html),text:t.text||``}:{role:e.role,raw:e.content,kind:t.kind,html:t.html,text:t.text||``}})),T=()=>{S.value=!0,b(`preview`)},E=()=>{S.value=!1,f(()=>{console.log(`nextTick后 showPreview:`,S.value)})};return v({showPreview:S,handlePreview:T,closePreview:E}),(e,i)=>{let f=_,v=te,y=ne;return h(),l(`div`,Bt,[t.showToggle&&!r(S)?(h(),l(`div`,Vt,[u(f,{name:`i-lucide-eye`,class:`w-12 h-12 text-gray-400 mb-4`}),i[2]||=g(`span`,{class:`text-gray-500 dark:text-gray-400 mb-5 text-sm`},`点击预览聊天效果`,-1),u(v,{size:`sm`,loading:t.loading,onClick:T},{leading:n(()=>[u(f,{name:`i-lucide-eye`,class:`w-4 h-4`})]),default:n(()=>[o(` `+m(t.loading?`加载中...`:`预览`),1)]),_:1},8,[`loading`])])):c(``,!0),!t.showToggle||r(S)?(h(),l(d,{key:1},[g(`div`,Ht,[g(`div`,{class:`flex-1 min-h-0 flex flex-col relative`,style:p({backgroundImage:t.backgroundImage?`url(${t.backgroundImage})`:void 0,backgroundSize:`cover`,backgroundPosition:`center`})},[t.backgroundImage?c(``,!0):(h(),l(`div`,Ut)),g(`div`,Wt,[g(`div`,Gt,[g(`div`,Kt,m(t.name||`未命名角色`),1),i[3]||=g(`div`,{class:`text-xs text-cyan-300 flex items-center justify-center gap-1 mt-0.5`},[g(`span`,{class:`w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse`}),o(` 24小时在线 `)],-1)])]),g(`div`,qt,[t.loading?(h(),l(`div`,Jt,[u(f,{name:`i-lucide-loader-2`,class:`animate-spin text-white text-2xl`})])):r(w).length>0?(h(!0),l(d,{key:1},ee(r(w),(e,t)=>(h(),l(`div`,{key:t,class:a([`flex`,e.role===`user`?`justify-end`:`justify-start`])},[e.role===`user`?c(``,!0):(h(),l(d,{key:0},[r(C)?(h(),s(y,{key:0,src:r(C),alt:``,class:`w-8 h-8 rounded-full mr-2 shrink-0 object-cover self-start`,loading:`lazy`},null,8,[`src`])):(h(),l(`div`,Yt,[u(f,{name:`i-lucide-user`,class:`w-4 h-4 text-gray-500`})]))],64)),e.kind===`iframe`?(h(),l(`div`,Xt,[g(`iframe`,{class:`iframe`,src:e.blobUrl,sandbox:`allow-scripts allow-same-origin allow-modals allow-forms`,allow:`autoplay`,referrerpolicy:`no-referrer`,onLoad:i[0]||=e=>{let t=e.target;try{let e=t.contentWindow?.document?.body?.scrollHeight||400;t.style.height=Math.max(e,400)+`px`}catch{}}},null,40,Zt)])):e.kind===`mixed`?(h(),l(`div`,Qt,[e.text?(h(),l(`div`,{key:0,class:`bg-white/80 backdrop-blur rounded-lg p-2 text-sm text-gray-700 mb-2 message-content`,innerHTML:e.text},null,8,$t)):c(``,!0),g(`div`,en,[g(`iframe`,{class:`iframe`,src:e.blobUrl,sandbox:`allow-scripts allow-same-origin allow-modals allow-forms`,allow:`autoplay`,referrerpolicy:`no-referrer`,onLoad:i[1]||=e=>{let t=e.target;try{let e=t.contentWindow?.document?.body?.scrollHeight||400;t.style.height=Math.max(e,400)+`px`}catch{}}},null,40,tn)])])):(h(),l(`div`,{key:3,class:a([`flex-1 max-w-[75%] rounded-lg p-2 text-sm`,e.role===`user`?`bg-cyan-500 text-white`:`bg-white/80 backdrop-blur text-gray-700`])},[e.kind===`text`?(h(),l(`span`,nn,m(e.raw),1)):(h(),l(`div`,{key:1,class:`message-content`,innerHTML:e.html},null,8,rn))],2))],2))),128)):t.greetings&&t.greetings[0]?(h(),l(`div`,an,[r(C)?(h(),s(y,{key:0,src:r(C),alt:``,class:`w-8 h-8 rounded-full mr-2 shrink-0 object-cover self-start`,loading:`lazy`},null,8,[`src`])):(h(),l(`div`,on,[u(f,{name:`i-lucide-user`,class:`w-4 h-4 text-gray-500`})])),g(`div`,sn,m(t.greetings[0].slice(0,200))+m(t.greetings[0].length>200?`...`:``),1)])):(h(),l(`div`,cn,[...i[4]||=[g(`span`,{class:`text-white/60 text-sm`},`暂无聊天记录`,-1)]]))]),g(`div`,ln,[g(`div`,un,[i[5]||=g(`div`,{class:`flex-1 bg-white dark:bg-gray-800 rounded-full px-4 py-2 text-sm text-gray-400`},` 说点什么... `,-1),g(`div`,dn,[u(f,{name:`i-lucide-send`,class:`w-4 h-4`})])])])],4)]),t.showToggle?(h(),l(`button`,{key:0,class:`w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center justify-center gap-1.5`,onClick:E},[u(f,{name:`i-lucide-eye-off`,class:`w-3.5 h-3.5`}),i[6]||=o(` 关闭预览 `,-1)])):c(``,!0)],64)):c(``,!0)])}}}),[[`__scopeId`,`data-v-fe5da919`]]),{__name:`AmusementPhonePreview`});export{fn as t};