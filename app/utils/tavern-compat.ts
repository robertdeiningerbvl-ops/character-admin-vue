// SillyTavern + TavernHelper compatibility layer
// Reference: https://github.com/N0VI028/JS-Slash-Runner

export function getTavernCompatScript() {
	return `<style>
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
      if((v.charAt(0)==='\"'&&v.charAt(v.length-1)==='\"')||(v.charAt(0)===\"'\"&&v.charAt(v.length-1)===\"'\")){
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
    var setRegex=/_\.set\\s*\\(\\s*['"]([^'"]+)['"]\\s*,\\s*([^,)]+)(?:\\s*,\\s*([^)]+))?\\s*\\)/g;
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
  var match=name&&name.match(/--(\d+)--/);
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
      var processed=str.replace(/\t/g,'  ');

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
  if((v.startsWith('\"')&&v.endsWith('\"'))||(v.startsWith(\"'\")&&v.endsWith(\"'\"))){
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
<` + `/script>
<script src="https://cdn.jsdelivr.net/npm/vue@3.4.21/dist/vue.global.prod.js"><` + `/script>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"><` + `/script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"><` + `/script>
<script src="https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.js"><` + `/script>
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
<` + `/script>`;
}
