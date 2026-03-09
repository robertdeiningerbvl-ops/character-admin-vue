import{a as Ue,_ as Ge}from"./BXV-v0wK.js";import{p as Fe,h as We,z as w,A as v,u as T,a7 as P,Q as _,a2 as me,a5 as te,a6 as L,W as re,a3 as Ye,R as z,ah as qe,ae as we,c as ve}from"./DFHCbWHk.js";import{_ as Je}from"./DlAUqK2U.js";function oe(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var D=oe();function Ie(t){D=t}var I={exec:()=>null};function h(t,e=""){let r=typeof t=="string"?t:t.source,s={replace:(n,a)=>{let i=typeof a=="string"?a:a.source;return i=i.replace(k.caret,"$1"),r=r.replace(n,i),s},getRegex:()=>new RegExp(r,e)};return s}var Qe=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),k={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},Ze=/^(?:[ \t]*(?:\n|$))+/,Ke=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Xe=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,V=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,et=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,le=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Re=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Oe=h(Re).replace(/bull/g,le).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),tt=h(Re).replace(/bull/g,le).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),ce=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,rt=/^[^\n]+/,ue=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,nt=h(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",ue).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),st=h(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,le).getRegex(),Z="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",de=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,it=h("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",de).replace("tag",Z).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Ce=h(ce).replace("hr",V).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Z).getRegex(),at=h(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Ce).getRegex(),pe={blockquote:at,code:Ke,def:nt,fences:Xe,heading:et,hr:V,html:it,lheading:Oe,list:st,newline:Ze,paragraph:Ce,table:I,text:rt},_e=h("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",V).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Z).getRegex(),ot={...pe,lheading:tt,table:_e,paragraph:h(ce).replace("hr",V).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",_e).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Z).getRegex()},lt={...pe,html:h(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",de).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:I,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:h(ce).replace("hr",V).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Oe).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ct=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,ut=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,De=/^( {2,}|\\)\n(?!\s*$)/,dt=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,K=/[\p{P}\p{S}]/u,fe=/[\s\p{P}\p{S}]/u,Me=/[^\s\p{P}\p{S}]/u,pt=h(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,fe).getRegex(),Le=/(?!~)[\p{P}\p{S}]/u,ft=/(?!~)[\s\p{P}\p{S}]/u,ht=/(?:[^\s\p{P}\p{S}]|~)/u,Ne=/(?![*_])[\p{P}\p{S}]/u,gt=/(?![*_])[\s\p{P}\p{S}]/u,mt=/(?:[^\s\p{P}\p{S}]|[*_])/u,wt=h(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Qe?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),je=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,vt=h(je,"u").replace(/punct/g,K).getRegex(),_t=h(je,"u").replace(/punct/g,Le).getRegex(),$e="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",bt=h($e,"gu").replace(/notPunctSpace/g,Me).replace(/punctSpace/g,fe).replace(/punct/g,K).getRegex(),kt=h($e,"gu").replace(/notPunctSpace/g,ht).replace(/punctSpace/g,ft).replace(/punct/g,Le).getRegex(),yt=h("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Me).replace(/punctSpace/g,fe).replace(/punct/g,K).getRegex(),xt=h(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Ne).getRegex(),Et="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",St=h(Et,"gu").replace(/notPunctSpace/g,mt).replace(/punctSpace/g,gt).replace(/punct/g,Ne).getRegex(),At=h(/\\(punct)/,"gu").replace(/punct/g,K).getRegex(),Pt=h(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Tt=h(de).replace("(?:-->|$)","-->").getRegex(),It=h("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Tt).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Y=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Rt=h(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",Y).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Ve=h(/^!?\[(label)\]\[(ref)\]/).replace("label",Y).replace("ref",ue).getRegex(),He=h(/^!?\[(ref)\](?:\[\])?/).replace("ref",ue).getRegex(),Ot=h("reflink|nolink(?!\\()","g").replace("reflink",Ve).replace("nolink",He).getRegex(),be=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,he={_backpedal:I,anyPunctuation:At,autolink:Pt,blockSkip:wt,br:De,code:ut,del:I,delLDelim:I,delRDelim:I,emStrongLDelim:vt,emStrongRDelimAst:bt,emStrongRDelimUnd:yt,escape:ct,link:Rt,nolink:He,punctuation:pt,reflink:Ve,reflinkSearch:Ot,tag:It,text:dt,url:I},Ct={...he,link:h(/^!?\[(label)\]\((.*?)\)/).replace("label",Y).getRegex(),reflink:h(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Y).getRegex()},ne={...he,emStrongRDelimAst:kt,emStrongLDelim:_t,delLDelim:xt,delRDelim:St,url:h(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",be).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:h(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",be).getRegex()},Dt={...ne,br:h(De).replace("{2,}","*").getRegex(),text:h(ne.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},U={normal:pe,gfm:ot,pedantic:lt},N={normal:he,gfm:ne,breaks:Dt,pedantic:Ct},Mt={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ke=t=>Mt[t];function S(t,e){if(e){if(k.escapeTest.test(t))return t.replace(k.escapeReplace,ke)}else if(k.escapeTestNoEncode.test(t))return t.replace(k.escapeReplaceNoEncode,ke);return t}function ye(t){try{t=encodeURI(t).replace(k.percentDecode,"%")}catch{return null}return t}function xe(t,e){let r=t.replace(k.findPipe,(a,i,c)=>{let o=!1,u=i;for(;--u>=0&&c[u]==="\\";)o=!o;return o?"|":" |"}),s=r.split(k.splitPipe),n=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;n<s.length;n++)s[n]=s[n].trim().replace(k.slashPipe,"|");return s}function j(t,e,r){let s=t.length;if(s===0)return"";let n=0;for(;n<s&&t.charAt(s-n-1)===e;)n++;return t.slice(0,s-n)}function Lt(t,e){if(t.indexOf(e[1])===-1)return-1;let r=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])r++;else if(t[s]===e[1]&&(r--,r<0))return s;return r>0?-2:-1}function Nt(t,e=0){let r=e,s="";for(let n of t)if(n==="	"){let a=4-r%4;s+=" ".repeat(a),r+=a}else s+=n,r++;return s}function Ee(t,e,r,s,n){let a=e.href,i=e.title||null,c=t[1].replace(n.other.outputLinkReplace,"$1");s.state.inLink=!0;let o={type:t[0].charAt(0)==="!"?"image":"link",raw:r,href:a,title:i,text:c,tokens:s.inlineTokens(c)};return s.state.inLink=!1,o}function jt(t,e,r){let s=t.match(r.other.indentCodeCompensation);if(s===null)return e;let n=s[1];return e.split(`
`).map(a=>{let i=a.match(r.other.beginningSpace);if(i===null)return a;let[c]=i;return c.length>=n.length?a.slice(n.length):a}).join(`
`)}var q=class{options;rules;lexer;constructor(t){this.options=t||D}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let r=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?r:j(r,`
`)}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let r=e[0],s=jt(r,e[3]||"",this.rules);return{type:"code",raw:r,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let r=e[2].trim();if(this.rules.other.endingHash.test(r)){let s=j(r,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(r=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:r,tokens:this.lexer.inline(r)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:j(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let r=j(e[0],`
`).split(`
`),s="",n="",a=[];for(;r.length>0;){let i=!1,c=[],o;for(o=0;o<r.length;o++)if(this.rules.other.blockquoteStart.test(r[o]))c.push(r[o]),i=!0;else if(!i)c.push(r[o]);else break;r=r.slice(o);let u=c.join(`
`),l=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${u}`:u,n=n?`${n}
${l}`:l;let d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(l,a,!0),this.lexer.state.top=d,r.length===0)break;let p=a.at(-1);if(p?.type==="code")break;if(p?.type==="blockquote"){let f=p,g=f.raw+`
`+r.join(`
`),b=this.blockquote(g);a[a.length-1]=b,s=s.substring(0,s.length-f.raw.length)+b.raw,n=n.substring(0,n.length-f.text.length)+b.text;break}else if(p?.type==="list"){let f=p,g=f.raw+`
`+r.join(`
`),b=this.list(g);a[a.length-1]=b,s=s.substring(0,s.length-p.raw.length)+b.raw,n=n.substring(0,n.length-f.raw.length)+b.raw,r=g.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:a,text:n}}}list(t){let e=this.rules.block.list.exec(t);if(e){let r=e[1].trim(),s=r.length>1,n={type:"list",raw:"",ordered:s,start:s?+r.slice(0,-1):"",loose:!1,items:[]};r=s?`\\d{1,9}\\${r.slice(-1)}`:`\\${r}`,this.options.pedantic&&(r=s?r:"[*+-]");let a=this.rules.other.listItemRegex(r),i=!1;for(;t;){let o=!1,u="",l="";if(!(e=a.exec(t))||this.rules.block.hr.test(t))break;u=e[0],t=t.substring(u.length);let d=Nt(e[2].split(`
`,1)[0],e[1].length),p=t.split(`
`,1)[0],f=!d.trim(),g=0;if(this.options.pedantic?(g=2,l=d.trimStart()):f?g=e[1].length+1:(g=d.search(this.rules.other.nonSpaceChar),g=g>4?1:g,l=d.slice(g),g+=e[1].length),f&&this.rules.other.blankLine.test(p)&&(u+=p+`
`,t=t.substring(p.length+1),o=!0),!o){let b=this.rules.other.nextBulletRegex(g),E=this.rules.other.hrRegex(g),A=this.rules.other.fencesBeginRegex(g),H=this.rules.other.headingBeginRegex(g),X=this.rules.other.htmlBeginRegex(g),B=this.rules.other.blockquoteBeginRegex(g);for(;t;){let ee=t.split(`
`,1)[0],M;if(p=ee,this.options.pedantic?(p=p.replace(this.rules.other.listReplaceNesting,"  "),M=p):M=p.replace(this.rules.other.tabCharGlobal,"    "),A.test(p)||H.test(p)||X.test(p)||B.test(p)||b.test(p)||E.test(p))break;if(M.search(this.rules.other.nonSpaceChar)>=g||!p.trim())l+=`
`+M.slice(g);else{if(f||d.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||A.test(d)||H.test(d)||E.test(d))break;l+=`
`+p}f=!p.trim(),u+=ee+`
`,t=t.substring(ee.length+1),d=M.slice(g)}}n.loose||(i?n.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(i=!0)),n.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(l),loose:!1,text:l,tokens:[]}),n.raw+=u}let c=n.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;n.raw=n.raw.trimEnd();for(let o of n.items){if(this.lexer.state.top=!1,o.tokens=this.lexer.blockTokens(o.text,[]),o.task){if(o.text=o.text.replace(this.rules.other.listReplaceTask,""),o.tokens[0]?.type==="text"||o.tokens[0]?.type==="paragraph"){o.tokens[0].raw=o.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),o.tokens[0].text=o.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let l=this.lexer.inlineQueue.length-1;l>=0;l--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[l].src)){this.lexer.inlineQueue[l].src=this.lexer.inlineQueue[l].src.replace(this.rules.other.listReplaceTask,"");break}}let u=this.rules.other.listTaskCheckbox.exec(o.raw);if(u){let l={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};o.checked=l.checked,n.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=l.raw+o.tokens[0].raw,o.tokens[0].text=l.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(l)):o.tokens.unshift({type:"paragraph",raw:l.raw,text:l.raw,tokens:[l]}):o.tokens.unshift(l)}}if(!n.loose){let u=o.tokens.filter(d=>d.type==="space"),l=u.length>0&&u.some(d=>this.rules.other.anyLine.test(d.raw));n.loose=l}}if(n.loose)for(let o of n.items){o.loose=!0;for(let u of o.tokens)u.type==="text"&&(u.type="paragraph")}return n}}html(t){let e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){let e=this.rules.block.def.exec(t);if(e){let r=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:r,raw:e[0],href:s,title:n}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let r=xe(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),n=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:e[0],header:[],align:[],rows:[]};if(r.length===s.length){for(let i of s)this.rules.other.tableAlignRight.test(i)?a.align.push("right"):this.rules.other.tableAlignCenter.test(i)?a.align.push("center"):this.rules.other.tableAlignLeft.test(i)?a.align.push("left"):a.align.push(null);for(let i=0;i<r.length;i++)a.header.push({text:r[i],tokens:this.lexer.inline(r[i]),header:!0,align:a.align[i]});for(let i of n)a.rows.push(xe(i,a.header.length).map((c,o)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:a.align[o]})));return a}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let r=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:r,tokens:this.lexer.inline(r)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let r=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(r)){if(!this.rules.other.endAngleBracket.test(r))return;let a=j(r.slice(0,-1),"\\");if((r.length-a.length)%2===0)return}else{let a=Lt(e[2],"()");if(a===-2)return;if(a>-1){let i=(e[0].indexOf("!")===0?5:4)+e[1].length+a;e[2]=e[2].substring(0,a),e[0]=e[0].substring(0,i).trim(),e[3]=""}}let s=e[2],n="";if(this.options.pedantic){let a=this.rules.other.pedanticHrefTitle.exec(s);a&&(s=a[1],n=a[3])}else n=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(r)?s=s.slice(1):s=s.slice(1,-1)),Ee(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:n&&n.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let r;if((r=this.rules.inline.reflink.exec(t))||(r=this.rules.inline.nolink.exec(t))){let s=(r[2]||r[1]).replace(this.rules.other.multipleSpaceGlobal," "),n=e[s.toLowerCase()];if(!n){let a=r[0].charAt(0);return{type:"text",raw:a,text:a}}return Ee(r,n,r[0],this.lexer,this.rules)}}emStrong(t,e,r=""){let s=this.rules.inline.emStrongLDelim.exec(t);if(!(!s||s[3]&&r.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!r||this.rules.inline.punctuation.exec(r))){let n=[...s[0]].length-1,a,i,c=n,o=0,u=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,e=e.slice(-1*t.length+n);(s=u.exec(e))!=null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a)continue;if(i=[...a].length,s[3]||s[4]){c+=i;continue}else if((s[5]||s[6])&&n%3&&!((n+i)%3)){o+=i;continue}if(c-=i,c>0)continue;i=Math.min(i,i+c+o);let l=[...s[0]][0].length,d=t.slice(0,n+s.index+l+i);if(Math.min(n,i)%2){let f=d.slice(1,-1);return{type:"em",raw:d,text:f,tokens:this.lexer.inlineTokens(f)}}let p=d.slice(2,-2);return{type:"strong",raw:d,text:p,tokens:this.lexer.inlineTokens(p)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let r=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(r),n=this.rules.other.startingSpaceChar.test(r)&&this.rules.other.endingSpaceChar.test(r);return s&&n&&(r=r.substring(1,r.length-1)),{type:"codespan",raw:e[0],text:r}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,r=""){let s=this.rules.inline.delLDelim.exec(t);if(s&&(!s[1]||!r||this.rules.inline.punctuation.exec(r))){let n=[...s[0]].length-1,a,i,c=n,o=this.rules.inline.delRDelim;for(o.lastIndex=0,e=e.slice(-1*t.length+n);(s=o.exec(e))!=null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a||(i=[...a].length,i!==n))continue;if(s[3]||s[4]){c+=i;continue}if(c-=i,c>0)continue;i=Math.min(i,i+c);let u=[...s[0]][0].length,l=t.slice(0,n+s.index+u+i),d=l.slice(n,-n);return{type:"del",raw:l,text:d,tokens:this.lexer.inlineTokens(d)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let r,s;return e[2]==="@"?(r=e[1],s="mailto:"+r):(r=e[1],s=r),{type:"link",raw:e[0],text:r,href:s,tokens:[{type:"text",raw:r,text:r}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let r,s;if(e[2]==="@")r=e[0],s="mailto:"+r;else{let n;do n=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(n!==e[0]);r=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:r,href:s,tokens:[{type:"text",raw:r,text:r}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let r=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:r}}}},y=class se{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||D,this.options.tokenizer=this.options.tokenizer||new q,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let r={other:k,block:U.normal,inline:N.normal};this.options.pedantic?(r.block=U.pedantic,r.inline=N.pedantic):this.options.gfm&&(r.block=U.gfm,this.options.breaks?r.inline=N.breaks:r.inline=N.gfm),this.tokenizer.rules=r}static get rules(){return{block:U,inline:N}}static lex(e,r){return new se(r).lex(e)}static lexInline(e,r){return new se(r).inlineTokens(e)}lex(e){e=e.replace(k.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let r=0;r<this.inlineQueue.length;r++){let s=this.inlineQueue[r];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,r=[],s=!1){for(this.options.pedantic&&(e=e.replace(k.tabCharGlobal,"    ").replace(k.spaceLine,""));e;){let n;if(this.options.extensions?.block?.some(i=>(n=i.call({lexer:this},e,r))?(e=e.substring(n.raw.length),r.push(n),!0):!1))continue;if(n=this.tokenizer.space(e)){e=e.substring(n.raw.length);let i=r.at(-1);n.raw.length===1&&i!==void 0?i.raw+=`
`:r.push(n);continue}if(n=this.tokenizer.code(e)){e=e.substring(n.raw.length);let i=r.at(-1);i?.type==="paragraph"||i?.type==="text"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+n.raw,i.text+=`
`+n.text,this.inlineQueue.at(-1).src=i.text):r.push(n);continue}if(n=this.tokenizer.fences(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.heading(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.hr(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.blockquote(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.list(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.html(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.def(e)){e=e.substring(n.raw.length);let i=r.at(-1);i?.type==="paragraph"||i?.type==="text"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+n.raw,i.text+=`
`+n.raw,this.inlineQueue.at(-1).src=i.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title},r.push(n));continue}if(n=this.tokenizer.table(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.lheading(e)){e=e.substring(n.raw.length),r.push(n);continue}let a=e;if(this.options.extensions?.startBlock){let i=1/0,c=e.slice(1),o;this.options.extensions.startBlock.forEach(u=>{o=u.call({lexer:this},c),typeof o=="number"&&o>=0&&(i=Math.min(i,o))}),i<1/0&&i>=0&&(a=e.substring(0,i+1))}if(this.state.top&&(n=this.tokenizer.paragraph(a))){let i=r.at(-1);s&&i?.type==="paragraph"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+n.raw,i.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=i.text):r.push(n),s=a.length!==e.length,e=e.substring(n.raw.length);continue}if(n=this.tokenizer.text(e)){e=e.substring(n.raw.length);let i=r.at(-1);i?.type==="text"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+n.raw,i.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=i.text):r.push(n);continue}if(e){let i="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(i);break}else throw new Error(i)}}return this.state.top=!0,r}inline(e,r=[]){return this.inlineQueue.push({src:e,tokens:r}),r}inlineTokens(e,r=[]){let s=e,n=null;if(this.tokens.links){let o=Object.keys(this.tokens.links);if(o.length>0)for(;(n=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)o.includes(n[0].slice(n[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,n.index)+"["+"a".repeat(n[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(n=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,n.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let a;for(;(n=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)a=n[2]?n[2].length:0,s=s.slice(0,n.index+a)+"["+"a".repeat(n[0].length-a-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let i=!1,c="";for(;e;){i||(c=""),i=!1;let o;if(this.options.extensions?.inline?.some(l=>(o=l.call({lexer:this},e,r))?(e=e.substring(o.raw.length),r.push(o),!0):!1))continue;if(o=this.tokenizer.escape(e)){e=e.substring(o.raw.length),r.push(o);continue}if(o=this.tokenizer.tag(e)){e=e.substring(o.raw.length),r.push(o);continue}if(o=this.tokenizer.link(e)){e=e.substring(o.raw.length),r.push(o);continue}if(o=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(o.raw.length);let l=r.at(-1);o.type==="text"&&l?.type==="text"?(l.raw+=o.raw,l.text+=o.text):r.push(o);continue}if(o=this.tokenizer.emStrong(e,s,c)){e=e.substring(o.raw.length),r.push(o);continue}if(o=this.tokenizer.codespan(e)){e=e.substring(o.raw.length),r.push(o);continue}if(o=this.tokenizer.br(e)){e=e.substring(o.raw.length),r.push(o);continue}if(o=this.tokenizer.del(e,s,c)){e=e.substring(o.raw.length),r.push(o);continue}if(o=this.tokenizer.autolink(e)){e=e.substring(o.raw.length),r.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(e))){e=e.substring(o.raw.length),r.push(o);continue}let u=e;if(this.options.extensions?.startInline){let l=1/0,d=e.slice(1),p;this.options.extensions.startInline.forEach(f=>{p=f.call({lexer:this},d),typeof p=="number"&&p>=0&&(l=Math.min(l,p))}),l<1/0&&l>=0&&(u=e.substring(0,l+1))}if(o=this.tokenizer.inlineText(u)){e=e.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(c=o.raw.slice(-1)),i=!0;let l=r.at(-1);l?.type==="text"?(l.raw+=o.raw,l.text+=o.text):r.push(o);continue}if(e){let l="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(l);break}else throw new Error(l)}}return r}},J=class{options;parser;constructor(t){this.options=t||D}space(t){return""}code({text:t,lang:e,escaped:r}){let s=(e||"").match(k.notSpaceStart)?.[0],n=t.replace(k.endingNewline,"")+`
`;return s?'<pre><code class="language-'+S(s)+'">'+(r?n:S(n,!0))+`</code></pre>
`:"<pre><code>"+(r?n:S(n,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,r=t.start,s="";for(let i=0;i<t.items.length;i++){let c=t.items[i];s+=this.listitem(c)}let n=e?"ol":"ul",a=e&&r!==1?' start="'+r+'"':"";return"<"+n+a+`>
`+s+"</"+n+`>
`}listitem(t){return`<li>${this.parser.parse(t.tokens)}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",r="";for(let n=0;n<t.header.length;n++)r+=this.tablecell(t.header[n]);e+=this.tablerow({text:r});let s="";for(let n=0;n<t.rows.length;n++){let a=t.rows[n];r="";for(let i=0;i<a.length;i++)r+=this.tablecell(a[i]);s+=this.tablerow({text:r})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+s+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){let e=this.parser.parseInline(t.tokens),r=t.header?"th":"td";return(t.align?`<${r} align="${t.align}">`:`<${r}>`)+e+`</${r}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${S(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:r}){let s=this.parser.parseInline(r),n=ye(t);if(n===null)return s;t=n;let a='<a href="'+t+'"';return e&&(a+=' title="'+S(e)+'"'),a+=">"+s+"</a>",a}image({href:t,title:e,text:r,tokens:s}){s&&(r=this.parser.parseInline(s,this.parser.textRenderer));let n=ye(t);if(n===null)return S(r);t=n;let a=`<img src="${t}" alt="${S(r)}"`;return e&&(a+=` title="${S(e)}"`),a+=">",a}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:S(t.text)}},ge=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},x=class ie{options;renderer;textRenderer;constructor(e){this.options=e||D,this.options.renderer=this.options.renderer||new J,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new ge}static parse(e,r){return new ie(r).parse(e)}static parseInline(e,r){return new ie(r).parseInline(e)}parse(e){let r="";for(let s=0;s<e.length;s++){let n=e[s];if(this.options.extensions?.renderers?.[n.type]){let i=n,c=this.options.extensions.renderers[i.type].call({parser:this},i);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(i.type)){r+=c||"";continue}}let a=n;switch(a.type){case"space":{r+=this.renderer.space(a);break}case"hr":{r+=this.renderer.hr(a);break}case"heading":{r+=this.renderer.heading(a);break}case"code":{r+=this.renderer.code(a);break}case"table":{r+=this.renderer.table(a);break}case"blockquote":{r+=this.renderer.blockquote(a);break}case"list":{r+=this.renderer.list(a);break}case"checkbox":{r+=this.renderer.checkbox(a);break}case"html":{r+=this.renderer.html(a);break}case"def":{r+=this.renderer.def(a);break}case"paragraph":{r+=this.renderer.paragraph(a);break}case"text":{r+=this.renderer.text(a);break}default:{let i='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(i),"";throw new Error(i)}}}return r}parseInline(e,r=this.renderer){let s="";for(let n=0;n<e.length;n++){let a=e[n];if(this.options.extensions?.renderers?.[a.type]){let c=this.options.extensions.renderers[a.type].call({parser:this},a);if(c!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){s+=c||"";continue}}let i=a;switch(i.type){case"escape":{s+=r.text(i);break}case"html":{s+=r.html(i);break}case"link":{s+=r.link(i);break}case"image":{s+=r.image(i);break}case"checkbox":{s+=r.checkbox(i);break}case"strong":{s+=r.strong(i);break}case"em":{s+=r.em(i);break}case"codespan":{s+=r.codespan(i);break}case"br":{s+=r.br(i);break}case"del":{s+=r.del(i);break}case"text":{s+=r.text(i);break}default:{let c='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return s}},$=class{options;block;constructor(t){this.options=t||D}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?y.lex:y.lexInline}provideParser(){return this.block?x.parse:x.parseInline}},$t=class{defaults=oe();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=x;Renderer=J;TextRenderer=ge;Lexer=y;Tokenizer=q;Hooks=$;constructor(...t){this.use(...t)}walkTokens(t,e){let r=[];for(let s of t)switch(r=r.concat(e.call(this,s)),s.type){case"table":{let n=s;for(let a of n.header)r=r.concat(this.walkTokens(a.tokens,e));for(let a of n.rows)for(let i of a)r=r.concat(this.walkTokens(i.tokens,e));break}case"list":{let n=s;r=r.concat(this.walkTokens(n.items,e));break}default:{let n=s;this.defaults.extensions?.childTokens?.[n.type]?this.defaults.extensions.childTokens[n.type].forEach(a=>{let i=n[a].flat(1/0);r=r.concat(this.walkTokens(i,e))}):n.tokens&&(r=r.concat(this.walkTokens(n.tokens,e)))}}return r}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(r=>{let s={...r};if(s.async=this.defaults.async||s.async||!1,r.extensions&&(r.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let a=e.renderers[n.name];a?e.renderers[n.name]=function(...i){let c=n.renderer.apply(this,i);return c===!1&&(c=a.apply(this,i)),c}:e.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=e[n.level];a?a.unshift(n.tokenizer):e[n.level]=[n.tokenizer],n.start&&(n.level==="block"?e.startBlock?e.startBlock.push(n.start):e.startBlock=[n.start]:n.level==="inline"&&(e.startInline?e.startInline.push(n.start):e.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(e.childTokens[n.name]=n.childTokens)}),s.extensions=e),r.renderer){let n=this.defaults.renderer||new J(this.defaults);for(let a in r.renderer){if(!(a in n))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let i=a,c=r.renderer[i],o=n[i];n[i]=(...u)=>{let l=c.apply(n,u);return l===!1&&(l=o.apply(n,u)),l||""}}s.renderer=n}if(r.tokenizer){let n=this.defaults.tokenizer||new q(this.defaults);for(let a in r.tokenizer){if(!(a in n))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let i=a,c=r.tokenizer[i],o=n[i];n[i]=(...u)=>{let l=c.apply(n,u);return l===!1&&(l=o.apply(n,u)),l}}s.tokenizer=n}if(r.hooks){let n=this.defaults.hooks||new $;for(let a in r.hooks){if(!(a in n))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let i=a,c=r.hooks[i],o=n[i];$.passThroughHooks.has(a)?n[i]=u=>{if(this.defaults.async&&$.passThroughHooksRespectAsync.has(a))return(async()=>{let d=await c.call(n,u);return o.call(n,d)})();let l=c.call(n,u);return o.call(n,l)}:n[i]=(...u)=>{if(this.defaults.async)return(async()=>{let d=await c.apply(n,u);return d===!1&&(d=await o.apply(n,u)),d})();let l=c.apply(n,u);return l===!1&&(l=o.apply(n,u)),l}}s.hooks=n}if(r.walkTokens){let n=this.defaults.walkTokens,a=r.walkTokens;s.walkTokens=function(i){let c=[];return c.push(a.call(this,i)),n&&(c=c.concat(n.call(this,i))),c}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return y.lex(t,e??this.defaults)}parser(t,e){return x.parse(t,e??this.defaults)}parseMarkdown(t){return(e,r)=>{let s={...r},n={...this.defaults,...s},a=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&s.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=t),n.async)return(async()=>{let i=n.hooks?await n.hooks.preprocess(e):e,c=await(n.hooks?await n.hooks.provideLexer():t?y.lex:y.lexInline)(i,n),o=n.hooks?await n.hooks.processAllTokens(c):c;n.walkTokens&&await Promise.all(this.walkTokens(o,n.walkTokens));let u=await(n.hooks?await n.hooks.provideParser():t?x.parse:x.parseInline)(o,n);return n.hooks?await n.hooks.postprocess(u):u})().catch(a);try{n.hooks&&(e=n.hooks.preprocess(e));let i=(n.hooks?n.hooks.provideLexer():t?y.lex:y.lexInline)(e,n);n.hooks&&(i=n.hooks.processAllTokens(i)),n.walkTokens&&this.walkTokens(i,n.walkTokens);let c=(n.hooks?n.hooks.provideParser():t?x.parse:x.parseInline)(i,n);return n.hooks&&(c=n.hooks.postprocess(c)),c}catch(i){return a(i)}}}onError(t,e){return r=>{if(r.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+S(r.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(r);throw r}}},O=new $t;function m(t,e){return O.parse(t,e)}m.options=m.setOptions=function(t){return O.setOptions(t),m.defaults=O.defaults,Ie(m.defaults),m};m.getDefaults=oe;m.defaults=D;m.use=function(...t){return O.use(...t),m.defaults=O.defaults,Ie(m.defaults),m};m.walkTokens=function(t,e){return O.walkTokens(t,e)};m.parseInline=O.parseInline;m.Parser=x;m.parser=x.parse;m.Renderer=J;m.TextRenderer=ge;m.Lexer=y;m.lexer=y.lex;m.Tokenizer=q;m.Hooks=$;m.parse=m;m.options;m.setOptions;m.use;m.walkTokens;m.parseInline;x.parse;y.lex;m.setOptions({breaks:!0,gfm:!0});function C(t){return!t||typeof t!="string"?!1:["html>","<head>","<body"].some(e=>t.includes(e))}function Vt(t){if(!t)return!1;if(typeof t=="string")return/class="[^"]*TH-render[^"]*"/i.test(t)?!0:C(t);if(t.classList&&t.classList.contains("TH-render"))return!0;if(t.tagName==="PRE"){const e=t.textContent||t.innerText||"";return C(e)}return!1}function Ht(t){if(!t)return!1;if(Vt(t)||/<div[^>]*class="[^"]*TH-render[^"]*"[^>]*>/i.test(t))return!0;const e=t.match(/<pre[^>]*>([\s\S]*?)<\/pre>/gi);if(e)for(const r of e){const s=r.replace(/<\/?pre[^>]*>/gi,"");if(C(s))return!0}return!1}function Bt(t){if(!t)return!1;const e=t.match(/<pre[^>]*>([\s\S]*?)<\/pre>/gi);return e?e.some(r=>{const s=r.replace(/<\/?pre[^>]*>/gi,"");return C(s)}):!1}function zt(t){if(!t)return[];const e=[],r=/<pre[^>]*>([\s\S]*?)<\/pre>/gi;let s;for(;(s=r.exec(t))!==null;){const n=s[1];C(n)&&e.push({full:s[0],html:n.replace(/<\/?code[^>]*>/gi,"").trim()})}return e}function Ut(t){if(!t)return[];const e=[],r=/<div[^>]*class="[^"]*TH-render[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;let s;for(;(s=r.exec(t))!==null;)e.push({full:s[0],html:s[1].trim()});return e}function Gt(t){return t?/<[a-z][\s\S]*>/i.test(t):!1}function Se(t){return!t||typeof t!="string"?!1:[/^#{1,6}\s+/m,/\*\*[^*]+\*\*/,/\*[^*]+\*/,/^\s*[-*+]\s+/m,/^\s*\d+\.\s+/m,/\[.+\]\(.+\)/,/!\[.*\]\(.+\)/,/^>\s+/m,/`[^`]+`/,/^\|.+\|$/m].some(r=>r.test(t))}function Ft(t){return t?/<(script|iframe|audio|video|object|embed|form|input|button)[^>]*>/i.test(t):!1}function Wt(t){if(!t)return null;const e=t.match(/```html\s*\n?([\s\S]*?)```/i);if(e&&e[1]){let r=e[1].trim();const s=r.match(/<\/html>/i);return s&&s.index!==void 0&&(r=r.slice(0,s.index+7)),r}return null}function Yt(t){if(!t)return null;const e=t.match(/(<!DOCTYPE[\s\S]*?<\/html>|<html[\s\S]*?<\/html>)/i);return e&&e[1]?e[1]:null}function Ae(t){if(!t)return"";const e=t.match(/```html\s*\n?/i);if(e)return t.slice(0,e.index).replace(/```\w*\s*/g,"").replace(/<\/?maintext>/gi,"").trim();const r=t.match(/(<!DOCTYPE|<html)/i);return r&&r.index>0?t.slice(0,r.index).replace(/```\w*\s*/g,"").replace(/<\/?maintext>/gi,"").trim():t.replace(/```\w*\s*/g,"").trim()}function qt(t){return t&&t.replace(/\[\[CHOICE_START\]\][\s\S]*?\[\[CHOICE_END\]\]/g,"").replace(/\[\[CHOICE_START\]\][\s\S]*$/g,"").trim()}function Jt(t){return t&&((t.match(/```/g)||[]).length%2!==0?t.replace(/^```\w*\s*\n?/gm,"").replace(/\n?```\s*$/gm,"").replace(/```\w*\n/g,"").replace(/\n```/g,""):t)}function Qt(t){return t&&t.replace(/<\/?maintext>/gi,"").replace(/<\/?option[^>]*>/gi,"").replace(/<\/?tickbubble[^>]*>/gi,"").replace(/<\/?VariableInsert>/gi,"").replace(/<\/?speak[^>]*>/gi,"").replace(/<\/?think[^>]*>/gi,"").replace(/<\/?narrate[^>]*>/gi,"").replace(/<\/?ooc[^>]*>/gi,"").replace(/\^\^\^([\s\S]*?)\^\^\^/g,"$1").replace(/\[\[\[hidden\]\]\][\s\S]*?\[\[\[\/hidden\]\]\]/gi,"").replace(/\{\{hidden\}\}[\s\S]*?\{\{\/hidden\}\}/gi,"")}function Pe(t){if(!t)return{};const e={},n=t.split(`
`).map(c=>{let o=!1,u="",l=-1;for(let d=0;d<c.length;d++){const p=c[d],f=c[d-1];if(!o&&(p==='"'||p==="'"))o=!0,u=p;else if(o&&p===u&&f!=="\\")o=!1;else if(!o&&p==="/"&&c[d+1]==="/"){l=d;break}}return l>=0?c.slice(0,l):c}).join(`
`),a=/_\.set\s*\(\s*(['"`])([^'"`]+)\1\s*,\s*([^,\n;)]+)(?:\s*,\s*([^;\n)]+))?\s*\)/g;let i;for(;(i=a.exec(n))!==null;){const c=i[2].trim();let o=(i[4]||i[3]).trim(),u;try{u=JSON.parse(o)}catch{u=o.replace(/^['"`]|['"`]$/g,"")}const l=c.split(".");let d=e;for(let p=0;p<l.length-1;p++)d[l[p]]||(d[l[p]]={}),d=d[l[p]];d[l[l.length-1]]=u}return Object.keys(e).length>0&&console.log("[parseSetCommands] parsed variables:",JSON.stringify(e)),e}function ae(t,e){for(const r of Object.keys(e))e[r]&&typeof e[r]=="object"&&!Array.isArray(e[r])?(t[r]||(t[r]={}),ae(t[r],e[r])):t[r]=e[r];return t}function Zt(t){if(!t)return{content:t,variables:{}};let e={},r=t;const s=/<update[_-]?variable[^>]*>([\s\S]*?)<\/update[_-]?variable>/gi;let n=0;r=t.replace(s,(i,c)=>{n++,console.log("[extractAndParseUpdateVariable] found tag #"+n+":",c.slice(0,200));const o=Pe(c);return ae(e,o),""});const a=Pe(r);return ae(e,a),Object.keys(e).length>0&&console.log("[extractAndParseUpdateVariable] total variables:",JSON.stringify(e)),{content:r,variables:e}}function Kt(t,e="状态数据"){if(!t||Object.keys(t).length===0)return"";const r=(s,n=0)=>s==null?'<span style="color:#999">null</span>':typeof s=="boolean"?`<span style="color:#0066cc">${s}</span>`:typeof s=="number"?`<span style="color:#009900">${s}</span>`:typeof s!="object"?`<span style="color:#333">${R(String(s))}</span>`:Array.isArray(s)?s.length===0?'<span style="color:#999">[]</span>':s.map((a,i)=>`<div style="padding-left:${n*12}px"><span style="color:#666">[${i}]:</span> ${r(a,n+1)}</div>`).join(""):Object.entries(s).map(([a,i])=>`<div style="padding-left:${n*12}px"><span style="color:#5E5B9D;font-weight:500">${R(a)}:</span> ${r(i,n+1)}</div>`).join("");return`<details class="variable-panel" style="margin:8px 0;border:1px solid rgba(94,91,157,0.3);border-radius:8px;background:rgba(94,91,157,0.05);overflow:hidden;" open>
<summary style="padding:8px 12px;cursor:pointer;font-size:12px;color:rgba(94,91,157,0.9);user-select:none;">📊 ${R(e)}</summary>
<div style="padding:8px;max-height:300px;overflow:auto;font-size:11px;font-family:monospace;">${r(t)}</div>
</details>`}const W={global:{},chat:{},message:{},character:{},preset:{}};function G(t,e="chat"){const r=W[e]||{};if(!t)return r;const s=t.split(".");let n=r;for(const a of s){if(n==null)return;n=n[a]}return n}function Be(t,e,r="chat"){W[r]||(W[r]={});const s=t.split(".");let n=W[r];for(let i=0;i<s.length-1;i++){const c=s[i];n[c]||(n[c]={}),n=n[c]}const a=s[s.length-1];n[a]=e}function Q(t,e={}){if(!t)return t;const{userName:r="用户",charName:s="角色",lastUserMessage:n="",userInfo:a={},characterInfo:i={}}=e;let c=t;return c=c.replace(/\{\{user\}\}/gi,r).replace(/\{\{char\}\}/gi,s).replace(/\{\{User\}\}/g,r).replace(/\{\{Char\}\}/g,s).replace(/\{\{lastUserMessage\}\}/g,n).replace(/\{\{lastMessage\}\}/gi,n).replace(/\{\{time\}\}/gi,new Date().toLocaleTimeString()).replace(/\{\{date\}\}/gi,new Date().toLocaleDateString()).replace(/\{\{weekday\}\}/gi,()=>["日","一","二","三","四","五","六"][new Date().getDay()]||"日").replace(/\{\{isotime\}\}/gi,()=>new Date().toISOString()).replace(/\{\{isodate\}\}/gi,()=>new Date().toISOString().split("T")[0]||"").replace(/\{\{idle_duration\}\}/gi,"0").replace(/\{\{random\}\}/gi,()=>Math.random().toString()).replace(/\{\{roll:(\d+)\}\}/gi,(o,u)=>String(Math.floor(Math.random()*parseInt(u,10))+1)).replace(/\{\{random:(\d+)-(\d+)\}\}/gi,(o,u,l)=>{const d=parseInt(u,10),p=parseInt(l,10);return String(Math.floor(Math.random()*(p-d+1))+d)}).replace(/\{\{newline\}\}/gi,`
`).replace(/\{\{trim\}\}/gi,"").replace(/\{\{noop\}\}/gi,""),c=c.replace(/\{\{user_avatar\}\}/gi,a?.avatar||"").replace(/\{\{char_avatar\}\}/gi,i?.avatar||i?.image||"").replace(/\{\{persona\}\}/gi,a?.username||r).replace(/\{\{description\}\}/gi,i?.description||"").replace(/\{\{personality\}\}/gi,i?.personality||"").replace(/\{\{scenario\}\}/gi,i?.scenario||""),c=c.replace(/\{\{get_(message|chat|character|preset|global)_variable::(.*?)\}\}/gi,(o,u,l)=>{const d=G(l,u);return d==null?"":typeof d=="string"?d:JSON.stringify(d)}),c=c.replace(/\{\{format_(message|chat|character|preset|global)_variable::(.*?)\}\}/gi,(o,u,l)=>{const d=G(l,u);if(d==null)return"";if(typeof d=="string")return d;try{return JSON.stringify(d,null,2)}catch{return String(d)}}),c=c.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/gi,(o,u,l)=>G(u,"chat")?l:""),c=c.replace(/\{\{#unless\s+(\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/gi,(o,u,l)=>G(u,"chat")?"":l),c}function R(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}function Te(t){if(!t)return"";try{const e=m.parse(t);return typeof e=="string"?e:""}catch(e){return console.error("[renderMarkdown] error:",e),R(t)}}function Xt(t){return t?`<div class="stat-bar" style="margin:6px 0;padding:8px 10px;border:1px solid var(--border-color,#e0e0e0);border-radius:10px;background:rgba(0,0,0,0.02);font-size:12px;color:var(--text-secondary,#666);">${R(t).replace(/\n/g,"<br>")}</div>`:""}function er(){return`<style>
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
<\/script>`}function tr(t,e={}){if(!t||typeof t!="string")return t;const{userName:r="用户",charName:s="角色",userInfo:n={},characterInfo:a={},lastUserMessage:i=""}=e;let c=t;return c=c.replace(/\{\{user\}\}/gi,r).replace(/\{\{char\}\}/gi,s).replace(/\{\{User\}\}/g,r).replace(/\{\{Char\}\}/g,s).replace(/\{\{lastUserMessage\}\}/gi,i).replace(/\{\{lastMessage\}\}/gi,i).replace(/\{\{time\}\}/gi,new Date().toLocaleTimeString()).replace(/\{\{date\}\}/gi,new Date().toLocaleDateString()).replace(/\{\{weekday\}\}/gi,()=>["日","一","二","三","四","五","六"][new Date().getDay()]||"日").replace(/\{\{isotime\}\}/gi,()=>new Date().toISOString()).replace(/\{\{isodate\}\}/gi,()=>new Date().toISOString().split("T")[0]||"").replace(/\{\{idle_duration\}\}/gi,"0").replace(/\{\{random\}\}/gi,()=>Math.random().toString()).replace(/\{\{roll:(\d+)\}\}/gi,(o,u)=>String(Math.floor(Math.random()*parseInt(u,10))+1)).replace(/\{\{random:(\d+)-(\d+)\}\}/gi,(o,u,l)=>{const d=parseInt(u,10),p=parseInt(l,10);return String(Math.floor(Math.random()*(p-d+1))+d)}).replace(/\{\{newline\}\}/gi,`
`).replace(/\{\{trim\}\}/gi,"").replace(/\{\{noop\}\}/gi,""),c=c.replace(/\{\{user_avatar\}\}/gi,n?.avatar||"").replace(/\{\{char_avatar\}\}/gi,a?.avatar||a?.image||"").replace(/\{\{persona\}\}/gi,n?.username||r).replace(/\{\{description\}\}/gi,a?.description||"").replace(/\{\{personality\}\}/gi,a?.personality||"").replace(/\{\{scenario\}\}/gi,a?.scenario||"").replace(/\{\{char_name\}\}/gi,a?.name||s).replace(/\{\{user_name\}\}/gi,n?.username||r),c=c.replace(/\{\{getvar::([^}]+)\}\}/gi,()=>""),c}function rr(t){if(!t)return t;const e=/min-height\s*:\s*[^;{}]*\d+(?:\.\d+)?vh/gi.test(t),r=/style\s*=\s*(["'])[\s\S]*?min-height\s*:\s*[^;]*?\d+(?:\.\d+)?vh[\s\S]*?\1/gi.test(t),s=/(\.style\.minHeight\s*=\s*(["']))([\s\S]*?vh)(\2)/gi.test(t)||/(setProperty\s*\(\s*(["'])min-height\2\s*,\s*(["']))([\s\S]*?vh)(\3\s*\))/gi.test(t);if(!e&&!r&&!s)return t;const n="var(--TH-viewport-height, 100vh)",a=i=>i.replace(/(\d+(?:\.\d+)?)vh\b/gi,(c,o)=>{const u=parseFloat(o);return isFinite(u)?u===100?n:`calc(${n} * ${u/100})`:c});return t=t.replace(/(min-height\s*:\s*)([^;{}]*?\d+(?:\.\d+)?vh)(?=\s*[;}])/gi,(i,c,o)=>`${c}${a(o)}`),t=t.replace(/(style\s*=\s*(["']))([^"']*?)(\2)/gi,(i,c,o,u,l)=>{if(!/min-height\s*:\s*[^;]*vh/i.test(u))return i;const d=u.replace(/(min-height\s*:\s*)([^;]*?\d+(?:\.\d+)?vh)/gi,(p,f,g)=>`${f}${a(g)}`);return`${c}${d}${l}`}),t=t.replace(/(\.style\.minHeight\s*=\s*(["']))([\s\S]*?)(\2)/gi,(i,c,o,u,l)=>/\b\d+(?:\.\d+)?vh\b/i.test(u)?`${c}${a(u)}${l}`:i),t=t.replace(/(setProperty\s*\(\s*(["'])min-height\2\s*,\s*(["']))([\s\S]*?)(\3\s*\))/gi,(i,c,o,u,l,d)=>/\b\d+(?:\.\d+)?vh\b/i.test(l)?`${c}${a(l)}${d}`:i),t}function nr(t){return t?.avatar||"/static/images/default-avatar.png"}function sr(t){return t?.avatar||t?.image||"/static/images/default-char.png"}function ir(){return`<script>
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
<\/script>`}function ar(){return`<script>
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
<\/script>`}function or(){return`
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
`}function F(t,e={}){const{userInfo:r={},characterInfo:s={},useBlobUrl:n=!1,baseUrl:a="",messageId:i="",includeThirdParty:c=!0,userName:o="",charName:u="",lastUserMessage:l=""}=e;let d=(t||"").replace(/\t/g,"  ");const p=tr(d,{userName:o||r?.username||"用户",charName:u||s?.name||"角色",userInfo:r,characterInfo:s,lastUserMessage:l}),f=rr(p),g=er(),b=ir(),E=ar(),A=c?or():"",H=nr(r),X=sr(s),B=i?`TH-message--${i}`:`TH-iframe-${Date.now()}`;return`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
${n&&a?`<base href="${a}"/>`:""}
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
  background-image: url('${H}');
  background-size: cover;
  background-position: center;
}
.char_avatar, .char-avatar {
  background-image: url('${X}');
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
${g}
${A}
${b}
${E}
<script>
// 设置 iframe 名称供脚本使用
window.__TH_IFRAME_ID = '${B}';
window.name = '${B}';
<\/script>
</head>
<body>
${f}
</body>
</html>`}m.setOptions({breaks:!0,gfm:!0});const lr={userName:"用户",charName:"角色",lastUserMessage:"",userInfo:{},characterInfo:{},messageId:""};function cr(t){if(!t||typeof t!="string")return{type:"empty"};const e=t.trim();if(/<div[^>]*class="[^"]*TH-render[^"]*"[^>]*>/i.test(t)){const n=Ut(t);if(n.length>0){const a=n[0];return n.length===1&&t.trim()===a.full.trim()?{type:"fullHtmlDoc",html:a.html}:{type:"nestedFrontend",html:t,frontends:n}}}const r=Wt(t);if(r&&C(r)){const n=Ae(t);return{type:n?"mixed":"fullHtmlDoc",text:n,html:r}}const s=Yt(t);if(s){const n=Ae(t);return{type:n?"mixed":"fullHtmlDoc",text:n,html:s}}if(C(e))return{type:"fullHtmlDoc",html:e};if(Bt(t)){const n=zt(t);if(n.length>0)return{type:"nestedFrontend",html:t,frontends:n}}return Ft(t)?{type:"dangerousHtml",html:t}:Ht(t)?{type:"dangerousHtml",html:t}:Gt(t)&&!Se(t)?{type:"htmlFragment",html:t}:Se(t)?{type:"markdown",content:t}:{type:"text",content:t}}function ur(t){if(!t)return t;const e=[];let r=t.replace(/```([^`]*)```/gs,(s,n)=>{const a=(n||"").trim();if(a.startsWith("html")||/<[^>]+>/.test(a))return s;const i=e.length;return e.push(a),`__STATBAR_${i}__`});return r=r.replace(/__STATBAR_(\d+)__/g,(s,n)=>{const a=e[parseInt(n,10)];return Xt(a||"")}),r}function ze(t,e){for(const[r,s]of Object.entries(e)){const n=t?`${t}.${r}`:r;typeof s=="object"&&s!==null&&!Array.isArray(s)?ze(n,s):Be(n,s,"chat")}}function dr(t,e={}){if(!t)return{content:"",variables:{},variableHtml:""};let r=t;const{content:s,variables:n}=Zt(r);if(r=s,Object.keys(n).length>0)for(const[i,c]of Object.entries(n))typeof c=="object"&&c!==null?ze(i,c):Be(i,c,"chat");r=Jt(r),r=Qt(r),r=Q(r,e),r=ur(r);const a=Object.keys(n).length>0?Kt(n):"";return{content:r,variables:n,variableHtml:a}}function pr(t,e={}){if(!t)return t;let r=t;return r=Q(r,e),r=r.replace(/\r\n/g,`
`).replace(/\n/g,"<br>"),r}function fr(t,e={}){const r={...lr,...e},{role:s,content:n,id:a}=t||{},i=a||r.messageId||`msg_${Date.now()}`;if(!n)return{kind:"text",html:"",text:"",messageId:i,variables:{}};let c=qt(n),o={},u="";if(s!=="user"){const p=dr(c,r);c=p.content,o=p.variables,u=p.variableHtml}const l=cr(c),d={userInfo:r.userInfo,characterInfo:r.characterInfo,messageId:i,userName:r.userName,charName:r.charName,lastUserMessage:r.lastUserMessage};switch(l.type){case"empty":return{kind:"text",html:"",text:"",messageId:i,variables:o,variableHtml:u};case"fullHtmlDoc":return{kind:"iframe",html:F(l.html||"",d),messageId:i,variables:o,variableHtml:u};case"mixed":return{kind:"mixed",text:l.text||"",textHtml:Te(l.text||"")||R(l.text||"").replace(/\n/g,"<br>"),html:F(l.html||"",d),messageId:i,variables:o,variableHtml:u};case"dangerousHtml":return{kind:"iframe",html:F(l.html||"",d),messageId:i,variables:o,variableHtml:u};case"nestedFrontend":return{kind:"nestedIframe",html:l.html||"",frontends:(l.frontends||[]).map((g,b)=>({full:g.full,iframe:F(g.html,{...d,messageId:`${i}--${b}`})})),messageId:i,variables:o,variableHtml:u};case"htmlFragment":return{kind:"html",html:pr(l.html||"",r)+u,messageId:i,variables:o};case"markdown":const p=Q(l.content||"",r);return{kind:"markdown",html:Te(p)+u,messageId:i,variables:o};default:const f=Q(l.content||"",r);return{kind:"html",html:R(f).replace(/\n/g,"<br>")+u,messageId:i,variables:o}}}const hr={class:"shrink-0 flex flex-col h-full max-h-full overflow-hidden"},gr={key:0,class:"flex-1 min-h-[500px] max-h-[700px] rounded-2xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 transition-all hover:border-gray-400 dark:hover:border-gray-600"},mr={class:"flex-1 min-h-[500px] max-h-[700px] rounded-[2rem] border-[6px] border-gray-800 dark:border-gray-900 bg-gray-800 shadow-2xl overflow-hidden flex flex-col"},wr={key:0,class:"absolute inset-0 bg-gradient-to-b from-cyan-100 to-cyan-50 dark:from-gray-700 dark:to-gray-800"},vr={class:"relative z-10 flex items-center justify-center px-4 py-3 bg-black/40 backdrop-blur-sm shrink-0"},_r={class:"text-center"},br={class:"font-medium text-white text-sm drop-shadow-md"},kr={class:"flex-1 min-h-0 relative z-10 p-3 overflow-y-auto space-y-3"},yr={key:0,class:"flex items-center justify-center h-full"},xr=["src"],Er={key:1,class:"w-8 h-8 rounded-full mr-2 shrink-0 bg-gray-300 flex items-center justify-center self-start"},Sr={key:1,class:"iframe-wrap flex-1"},Ar=["src"],Pr={key:2,class:"flex-1"},Tr=["innerHTML"],Ir={class:"iframe-wrap"},Rr=["src"],Or={key:0},Cr=["innerHTML"],Dr={key:2,class:"flex justify-start"},Mr=["src"],Lr={key:1,class:"w-8 h-8 rounded-full mr-2 shrink-0 bg-gray-300 flex items-center justify-center self-start"},Nr={class:"bg-white/80 backdrop-blur rounded-lg p-3 text-sm text-gray-700 leading-relaxed max-w-[75%]"},jr={key:3,class:"flex items-center justify-center h-full"},$r={class:"relative z-10 p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm shrink-0"},Vr={class:"flex items-center gap-2"},Hr={class:"w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center text-white shadow-md"},Br=Fe({__name:"PhonePreview",props:{name:{default:"未命名角色"},backgroundImage:{default:""},avatarImage:{default:""},greetings:{default:()=>[]},chatHistory:{default:()=>[]},loading:{type:Boolean,default:!1},showToggle:{type:Boolean,default:!1}},setup(t,{expose:e}){const r=t,s=We(!r.showToggle),n=ve(()=>r.avatarImage||r.backgroundImage),a=u=>{const l=new Blob([u],{type:"text/html"});return URL.createObjectURL(l)},i=ve(()=>!r.chatHistory||r.chatHistory.length===0?[]:r.chatHistory.map(u=>{const l=fr({role:u.role,content:u.content});return l.kind==="iframe"||l.kind==="mixed"?{role:u.role,raw:u.content,kind:l.kind,html:l.html,blobUrl:a(l.html),text:l.text||""}:{role:u.role,raw:u.content,kind:l.kind,html:l.html,text:l.text||""}})),c=()=>{s.value=!0},o=()=>{s.value=!1};return e({showPreview:s,handlePreview:c,closePreview:o}),(u,l)=>{const d=Ue,p=Ge;return w(),v("div",hr,[t.showToggle&&!T(s)?(w(),v("div",gr,[P(d,{name:"i-lucide-eye",class:"w-12 h-12 text-gray-400 mb-4"}),l[2]||(l[2]=_("span",{class:"text-gray-500 dark:text-gray-400 mb-5 text-sm"},"点击预览聊天效果",-1)),P(p,{size:"sm",loading:t.loading,onClick:c},{leading:me(()=>[P(d,{name:"i-lucide-eye",class:"w-4 h-4"})]),default:me(()=>[te(" "+L(t.loading?"加载中...":"预览"),1)]),_:1},8,["loading"])])):(w(),v(re,{key:1},[_("div",mr,[_("div",{class:"flex-1 min-h-0 flex flex-col relative",style:Ye({backgroundImage:t.backgroundImage?`url(${t.backgroundImage})`:void 0,backgroundSize:"cover",backgroundPosition:"center"})},[t.backgroundImage?z("",!0):(w(),v("div",wr)),_("div",vr,[_("div",_r,[_("div",br,L(t.name||"未命名角色"),1),l[3]||(l[3]=_("div",{class:"text-xs text-cyan-300 flex items-center justify-center gap-1 mt-0.5"},[_("span",{class:"w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"}),te(" 24小时在线 ")],-1))])]),_("div",kr,[t.loading?(w(),v("div",yr,[P(d,{name:"i-lucide-loader-2",class:"animate-spin text-white text-2xl"})])):T(i).length>0?(w(!0),v(re,{key:1},qe(T(i),(f,g)=>(w(),v("div",{key:g,class:we(["flex",f.role==="user"?"justify-end":"justify-start"])},[f.role!=="user"?(w(),v(re,{key:0},[T(n)?(w(),v("img",{key:0,src:T(n),alt:"",class:"w-8 h-8 rounded-full mr-2 shrink-0 object-cover self-start"},null,8,xr)):(w(),v("div",Er,[P(d,{name:"i-lucide-user",class:"w-4 h-4 text-gray-500"})]))],64)):z("",!0),f.kind==="iframe"?(w(),v("div",Sr,[_("iframe",{class:"iframe",src:f.blobUrl,sandbox:"allow-scripts allow-same-origin allow-modals allow-forms",allow:"autoplay",referrerpolicy:"no-referrer",onLoad:l[0]||(l[0]=b=>{const E=b.target;try{const A=E.contentWindow?.document?.body?.scrollHeight||400;E.style.height=Math.max(A,400)+"px"}catch{}})},null,40,Ar)])):f.kind==="mixed"?(w(),v("div",Pr,[f.text?(w(),v("div",{key:0,class:"bg-white/80 backdrop-blur rounded-lg p-2 text-sm text-gray-700 mb-2 message-content",innerHTML:f.text},null,8,Tr)):z("",!0),_("div",Ir,[_("iframe",{class:"iframe",src:f.blobUrl,sandbox:"allow-scripts allow-same-origin allow-modals allow-forms",allow:"autoplay",referrerpolicy:"no-referrer",onLoad:l[1]||(l[1]=b=>{const E=b.target;try{const A=E.contentWindow?.document?.body?.scrollHeight||400;E.style.height=Math.max(A,400)+"px"}catch{}})},null,40,Rr)])])):(w(),v("div",{key:3,class:we(["flex-1 max-w-[75%] rounded-lg p-2 text-sm",f.role==="user"?"bg-cyan-500 text-white":"bg-white/80 backdrop-blur text-gray-700"])},[f.kind==="text"?(w(),v("span",Or,L(f.raw),1)):(w(),v("div",{key:1,class:"message-content",innerHTML:f.html},null,8,Cr))],2))],2))),128)):t.greetings&&t.greetings[0]?(w(),v("div",Dr,[T(n)?(w(),v("img",{key:0,src:T(n),alt:"",class:"w-8 h-8 rounded-full mr-2 shrink-0 object-cover self-start"},null,8,Mr)):(w(),v("div",Lr,[P(d,{name:"i-lucide-user",class:"w-4 h-4 text-gray-500"})])),_("div",Nr,L(t.greetings[0].slice(0,200))+L(t.greetings[0].length>200?"...":""),1)])):(w(),v("div",jr,[...l[4]||(l[4]=[_("span",{class:"text-white/60 text-sm"},"暂无聊天记录",-1)])]))]),_("div",$r,[_("div",Vr,[l[5]||(l[5]=_("div",{class:"flex-1 bg-white dark:bg-gray-800 rounded-full px-4 py-2 text-sm text-gray-400"}," 说点什么... ",-1)),_("div",Hr,[P(d,{name:"i-lucide-send",class:"w-4 h-4"})])])])],4)]),t.showToggle?(w(),v("button",{key:0,class:"w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center justify-center gap-1.5",onClick:o},[P(d,{name:"i-lucide-eye-off",class:"w-3.5 h-3.5"}),l[6]||(l[6]=te(" 关闭预览 ",-1))])):z("",!0)],64))])}}}),Fr=Object.assign(Je(Br,[["__scopeId","data-v-888a3f43"]]),{__name:"AmusementPhonePreview"});export{Fr as _};
