import{TweenMax as t}from"../../../scripts/greensock/esm/all.js";const e={silent:Number.NEGATIVE_INFINITY,fatal:0,error:0,warn:1,log:2,info:3,success:3,fail:3,ready:3,start:3,box:3,debug:4,trace:5,verbose:Number.POSITIVE_INFINITY},s={silent:{level:-1},fatal:{level:e.fatal},error:{level:e.error},warn:{level:e.warn},log:{level:e.log},info:{level:e.info},success:{level:e.success},fail:{level:e.fail},ready:{level:e.info},start:{level:e.info},box:{level:e.info},debug:{level:e.debug},trace:{level:e.trace},verbose:{level:e.verbose}};function n(t){return null!==t&&"object"==typeof t}function i(t,e,s=".",o){if(!n(e))return i(t,{},s);const r=Object.assign({},e);for(const e in t){if("__proto__"===e||"constructor"===e)continue;const o=t[e];null!=o&&(Array.isArray(o)&&Array.isArray(r[e])?r[e]=[...o,...r[e]]:n(o)&&n(r[e])?r[e]=i(o,r[e],(s?`${s}.`:"")+e.toString()):r[e]=o)}return r}const o=(...t)=>t.reduce(((t,e)=>i(t,e,"")),{});function r(t){return e=t,"[object Object]"===Object.prototype.toString.call(e)&&(!(!t.message&&!t.args)&&!t.stack);var e}let a=!1;const l=[];class h{constructor(t={}){const e=t.types||s;this.options=o({...t,defaults:{...t.defaults},level:c(t.level,e),reporters:[...t.reporters||[]]},{types:s,throttle:1e3,throttleMin:5,formatOptions:{date:!0,colors:!1,compact:!0}});for(const t in e){const s={type:t,...this.options.defaults,...e[t]};this[t]=this._wrapLogFn(s),this[t].raw=this._wrapLogFn(s,!0)}this.options.mockFn&&this.mockTypes(),this._lastLog={}}get level(){return this.options.level}set level(t){this.options.level=c(t,this.options.types,this.options.level)}prompt(t,e){if(!this.options.prompt)throw new Error("prompt is not supported!");return this.options.prompt(t,e)}create(t){const e=new h({...this.options,...t});return this._mockFn&&e.mockTypes(this._mockFn),e}withDefaults(t){return this.create({...this.options,defaults:{...this.options.defaults,...t}})}withTag(t){return this.withDefaults({tag:this.options.defaults.tag?this.options.defaults.tag+":"+t:t})}addReporter(t){return this.options.reporters.push(t),this}removeReporter(t){if(t){const e=this.options.reporters.indexOf(t);if(e>=0)return this.options.reporters.splice(e,1)}else this.options.reporters.splice(0);return this}setReporters(t){return this.options.reporters=Array.isArray(t)?t:[t],this}wrapAll(){this.wrapConsole(),this.wrapStd()}restoreAll(){this.restoreConsole(),this.restoreStd()}wrapConsole(){for(const t in this.options.types)console["__"+t]||(console["__"+t]=console[t]),console[t]=this[t].raw}restoreConsole(){for(const t in this.options.types)console["__"+t]&&(console[t]=console["__"+t],delete console["__"+t])}wrapStd(){this._wrapStream(this.options.stdout,"log"),this._wrapStream(this.options.stderr,"log")}_wrapStream(t,e){t&&(t.__write||(t.__write=t.write),t.write=t=>{this[e].raw(String(t).trim())})}restoreStd(){this._restoreStream(this.options.stdout),this._restoreStream(this.options.stderr)}_restoreStream(t){t&&t.__write&&(t.write=t.__write,delete t.__write)}pauseLogs(){a=!0}resumeLogs(){a=!1;const t=l.splice(0);for(const e of t)e[0]._logFn(e[1],e[2])}mockTypes(t){const e=t||this.options.mockFn;if(this._mockFn=e,"function"==typeof e)for(const t in this.options.types)this[t]=e(t,this.options.types[t])||this[t],this[t].raw=this[t]}_wrapLogFn(t,e){return(...s)=>{if(!a)return this._logFn(t,s,e);l.push([this,t,s,e])}}_logFn(t,e,s){if((t.level||0)>this.level)return!1;const n={date:new Date,args:[],...t,level:c(t.level,this.options.types)};!s&&1===e.length&&r(e[0])?Object.assign(n,e[0]):n.args=[...e],n.message&&(n.args.unshift(n.message),delete n.message),n.additional&&(Array.isArray(n.additional)||(n.additional=n.additional.split("\n")),n.args.push("\n"+n.additional.join("\n")),delete n.additional),n.type="string"==typeof n.type?n.type.toLowerCase():"log",n.tag="string"==typeof n.tag?n.tag:"";const i=(t=!1)=>{const e=(this._lastLog.count||0)-this.options.throttleMin;if(this._lastLog.object&&e>0){const t=[...this._lastLog.object.args];e>1&&t.push(`(repeated ${e} times)`),this._log({...this._lastLog.object,args:t}),this._lastLog.count=1}t&&(this._lastLog.object=n,this._log(n))};clearTimeout(this._lastLog.timeout);const o=this._lastLog.time&&n.date?n.date.getTime()-this._lastLog.time.getTime():0;if(this._lastLog.time=n.date,o<this.options.throttle)try{const t=JSON.stringify([n.type,n.tag,n.args]),e=this._lastLog.serialized===t;if(this._lastLog.serialized=t,e&&(this._lastLog.count=(this._lastLog.count||0)+1,this._lastLog.count>this.options.throttleMin))return void(this._lastLog.timeout=setTimeout(i,this.options.throttle))}catch{}i(!0)}_log(t){for(const e of this.options.reporters)e.log(t,{options:this.options})}}function c(t,e={},s=3){return void 0===t?s:"number"==typeof t?t:e[t]&&void 0!==e[t].level?e[t].level:s}h.prototype.add=h.prototype.addReporter,h.prototype.remove=h.prototype.removeReporter,h.prototype.clear=h.prototype.removeReporter,h.prototype.withScope=h.prototype.withTag,h.prototype.mock=h.prototype.mockTypes,h.prototype.pause=h.prototype.pauseLogs,h.prototype.resume=h.prototype.resumeLogs;class d{constructor(t){this.options={...t},this.defaultColor="#7f8c8d",this.levelColorMap={0:"#c0392b",1:"#f39c12",3:"#00BCD4"},this.typeColorMap={success:"#2ecc71"}}_getLogFn(t){return t<1?console.__error||console.error:1===t?console.__warn||console.warn:console.__log||console.log}log(t){const e=this._getLogFn(t.level),s="log"===t.type?"":t.type,n=t.tag||"",i=`\n      background: ${this.typeColorMap[t.type]||this.levelColorMap[t.level]||this.defaultColor};\n      border-radius: 0.5em;\n      color: white;\n      font-weight: bold;\n      padding: 2px 0.5em;\n    `,o=`%c${[n,s].filter(Boolean).join(":")}`;"string"==typeof t.args[0]?e(`${o}%c ${t.args[0]}`,i,"",...t.args.slice(1)):e(o,i,...t.args)}}const m=function(t={}){return function(t={}){return new h(t)}({reporters:t.reporters||[new d({})],prompt:(t,e={})=>"confirm"===e.type?Promise.resolve(confirm(t)):Promise.resolve(prompt(t)),...t})}();var u,g=Object.defineProperty,p=(t,e,s)=>(((t,e,s)=>{e in t?g(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s})(t,"symbol"!=typeof e?e+"":e,s),s);function f(t){return t instanceof HTMLElement}class y{constructor(t){if(p(this,"element"),p(this,"debug",!1),f(t))return void(this.element=t);if("function"==typeof t){const e=t();if(!e)throw new Error("Function must return an element");if(this.debug&&console.log("Function returned",e),f(e))return void(this.element=e);if("string"==typeof e){const s=document.querySelector(e);if(!s)throw new Error(`You tried to grab using '${t}' but that doesn't exist!`);return void(this.element=s)}}const e=document.querySelector(t);if(!e)throw new Error(`You tried to grab using '${t}' but that doesn't exist!`);this.element=e}self(){return this.element}toggleClass(t){return"string"==typeof t&&t.includes(" ")&&(t=t.split(" ")),Array.isArray(t)||(t=[t]),t.forEach((t=>this.element.classList.toggle(t))),this}addClass(t){return"function"==typeof t&&(t=t()),"string"==typeof t&&t.includes(" ")&&(t=t.split(" ")),Array.isArray(t)||(t=[t]),t.forEach((t=>this.element.classList.add(t))),this}removeClass(t){return"function"==typeof t&&(t=t()),"string"==typeof t&&t.includes(" ")&&(t=t.split(" ")),Array.isArray(t)||(t=[t]),t.forEach((t=>this.element.classList.remove(t))),this}hasClass(t){return this.element.classList.contains(t)}replaceWith(t){return this.element.outerHTML=t,this}replaceWithElement(t,e=void 0){const s=document.createElement(t);if(s.id=e??this.element.id,!this.element?.parentNode)throw new Error("Element has no parent node, can not replace");return this.element.parentNode.replaceChild(s,this.element),new y(`#${s.id}`)}html(t){return this.element.innerHTML=t,this}empty(){return this.element.innerHTML="",this}check(t){if(this.element instanceof HTMLInputElement)return this.element.checked=t,this;throw new TypeError(`[El::${this.element.id}] You can only use check() on input elements'`)}checked(){if(this.element instanceof HTMLInputElement)return this.element.checked;throw new TypeError(`[El::${this.element.id}] You can only use checked() on input elements'`)}click(){return this.element.dispatchEvent(new MouseEvent("click",{view:window,bubbles:!0,cancelable:!1})),this}if(t){return t?this:null}wrap(t){const e=document.createElement("div");if(e.className=t,!this.element?.parentNode)throw new Error("Element has no parent node, can not wrap");return this.element.parentNode.insertBefore(e,this.element),this.element.parentNode.removeChild(this.element),e.appendChild(this.element),this}src(t){if(!(this.element instanceof HTMLImageElement))throw new TypeError(`[El::${this.element.id}] You can only use src() on image elements'`);return this.element.src=t,this}alt(t){if(!(this.element instanceof HTMLImageElement))throw new TypeError(`[El::${this.element.id}] You can only use alt() on image elements'`);return this.element.alt=t,this}parent(){const t=this.element.parentElement;if(!t)throw new Error("Element has no parent node, can not get parent");return t.id||(t.id=`parent-${this.element.id}`),new y(`#${t?.id}`)}remove(){if(!this.element?.parentNode)throw new Error("Element has no parent node, can not remove");return this.element.parentNode.removeChild(this.element),this}clear(){return this.element.innerHTML="",this}unset(t){return"string"==typeof t&&(t=[t]),t.forEach((t=>{this.element.removeAttribute(t)})),this}set(t){return Object.entries(t).forEach((([t,e])=>{e&&this.element.setAttribute(t,"string"==typeof e?e:e.toString())})),this}firstChild(){return this.element.firstElementChild}child(t,e=null){return"string"==typeof t?e&&"append"!==e?this.element.insertAdjacentHTML("afterbegin",t):this.element.insertAdjacentHTML("beforeend",t):("append"!==e&&null!=e||this.element.append(t),"prepend"===e&&this.element.prepend(t)),this}children(){return this.element.childNodes}text(t){return t?(this.element.textContent=t.toString(),this):this}textContent(t){return t?(this.element.textContent=t,this):this.element.textContent}textChild(t){const e=document.createTextNode(t.toString());return this.element.appendChild(e),this}type(t){return"type"in this.element&&this.element.setAttribute("type",t),this}name(t){return"name"in this.element&&(this.element.name=t),this}input(t){return"name"in this.element&&(this.element.name=this.element.id),"type"in this.element&&this.element.setAttribute("type",t),this}htmlFor(t){return"htmlFor"in this.element&&this.element.setAttribute("for",t),this}id(t){return t?(this.element.id=t,this):this.element.id}val(t){if(this.element instanceof HTMLInputElement||this.element instanceof HTMLSelectElement||this.element instanceof HTMLTextAreaElement||this.element instanceof HTMLOptionElement||this.element instanceof HTMLProgressElement)return null==t?this.element.value:(this.element.value=t instanceof Date?`${t.getFullYear()}-${t.getMonth()+1}-${t.getDate()}`:"string"==typeof t?t:t.toString(),this);throw new TypeError(`[El::${this.element.id}] You can only use val() on input / select / text area / progress elements'`)}data(t){return this.element.getAttribute(`data-${t}`)}dataset(){return this.element.dataset}on(t,e,s){return this.element.addEventListener(t,e,s),this}once(t,e){return this.element.addEventListener(t,e,{once:!0}),this}now(t,e){return this.element.dispatchEvent(new CustomEvent(t,{detail:e})),this}off(t,e,s){return this.element.removeEventListener(t,e,s),this}trigger(t,e){return this.element.dispatchEvent(new CustomEvent(t,e)),this}triggerChange(){if(this.element instanceof HTMLSelectElement){const t=document.createEvent("HTMLEvents");return t.initEvent("change",!0,!0),this.element.dispatchEvent(t),this}throw new TypeError(`[El::${this.element.id}] You can only use triggerChange() on select elements'`)}find(t){return this.element.querySelectorAll(t)}dispatchEvent(t){return this.element.dispatchEvent(new Event(t)),this}nestFrom(t){return t(`#${this.element.id}`),this}}class w{moduleName;moduleDescription;settings=[];hooks=new Map([]);socketFns=new Map;DEBUG=!1;ready=!1;get name(){return this.moduleName}get lowercaseName(){return this.moduleName.toLowerCase()}get hasHooks(){return this.hooks.size>0}get hasSettings(){return this.settings.length>0}get hasSocketFns(){return this.socketFns.size>0}get needsEarlyInitialization(){return this.hasSettings||this.hasHooks&&this.hooks.has("init")||this.hasHooks&&this.hooks.has("ready")||this.hasSocketFns}constructor(t){this.moduleName=t.moduleName,this.moduleDescription=t.moduleDescription,t?.settings&&(this.settings=t.settings.globalSettings?.map((t=>(t.scope="world",t)))??[],this.settings.push(...t.settings.clientSettings?.map((t=>(t.scope="client",t)))??[])),this.hooks=t?.hooks??new Map,this.socketFns=t?.socketFns??new Map,this.DEBUG=t?.DEBUG??!1}addHook(t,e,s=!1){!this.hooks.has(t)||s?this.hooks.set(t,e):m.warn(`Hook for event "${t}" already exists.`)}initializeHooks(){return this.hooks.forEach(((t,e)=>{this.DEBUG&&m.box({title:`[TOME::${this.moduleName}] => Registering hook for ${e}`,additional:{callback:t.toString()}}),Hooks.on(e,t)})),this}registerSetting(t){switch(t.type){case Number:case Boolean:case String:case Object:case Array:case Color:this.settings.push({...t});break;default:throw new Error(`Unsupported rule type: ${t.type}`)}return this}registerSettings(t){return t.forEach((t=>{this.registerSetting(t)})),this}initializeSettings(){return this.settings.forEach((t=>{this.DEBUG&&m.box({title:`[TOME::${this.moduleName}] => Registering ${t.name}`,additional:{...t}}),game.settings?.register("wonderlost",w.kabob(`${this.lowercaseName}-${t.name}`),{name:t.name,hint:t.hint,scope:t.scope,config:!0,default:t?.defaultValue,type:t.type,choices:t?.choices,range:t?.range,onChange:t.onChange,requiresReload:t.requiresReload})})),this}getSetting(t){return game.settings?.get("wonderlost",w.kabob(`${this.lowercaseName}-${t}`))}async setSetting(t,e){return game.settings?.set("wonderlost",w.kabob(`${this.lowercaseName}-${t}`),e)}registerSettingSubmenu(t){game.settings?.register("wonderlost",w.kabob(`${this.lowercaseName}-allSettings`),{scope:"world",config:!1,type:Object,default:t.data});const e=`${this.lowercaseName}`,s=this.moduleName.toString();game.settings?.registerMenu("wonderlost",w.kabob(`${this.lowercaseName}-allSettings`),{name:t.name,label:t.label,hint:t.hint,icon:t.icon,restricted:t.restricted,type:class extends FormApplication{constructor(){super({})}static get defaultOptions(){return foundry.utils.mergeObject(super.defaultOptions,{title:`Wonderlost: ${s}`,id:`${s}-settings`,width:550,height:"auto",popOut:!0,closeOnSubmit:!0,template:`modules/wonderlost/submodules/${e}/settings.hbs`})}static get moduleName(){return s}getData(){return foundry.utils.isEmpty(game.settings?.get(s,`${s.toLowerCase()}-allSettings`))?game.settings?.get(s,`${s.toLowerCase()}-allSettings`):t.data}async _updateObject(t,e){await(game.settings?.set(s,`${s.toLowerCase()}-allSettings`,e))}}})}initializeSocketListeners(){return 0===this.socketFns.size||this.socketFns.forEach(((t,e)=>{this.DEBUG&&m.info(`Registering socket listener for event: ${e}`),game.socket?.on(e,(e=>t(e)))})),this}initialize(){return this.hasSettings&&this.initializeSettings(),this.hasHooks&&this.initializeHooks(),this.hasSocketFns&&this.initializeSocketListeners(),this.ready=!0,this}static expandObject(t){if("object"==typeof t&&null!==t)return Object.entries(t).reduce(((t,[e,s])=>{if("string"==typeof s)try{t[e]=JSON.parse(s)}catch(n){t[e]=s}else t[e]=s;return t}),{});throw new Error("Expected object but received "+typeof t)}static kabob(t){return t?t.split("").join("-"):""}}class _ extends w{maxMessagesOnScreen=5;alwaysShowNotifications=!0;fadeOutDelay=3e3;ToastedReady=!1;menu=null;constructor(t=!1){super({moduleName:"Toasted",moduleDescription:"A customizable toast notification system",hooks:new Map([["renderChatLog",async(t,e)=>{try{if(document.body.classList.contains("stream"))return;const t=new y(e[0].querySelector("#chat-log").cloneNode(!1)).addClass(this.moduleName).id(this.lowercaseName).on("click",(t=>this.handleMouseEvent(t))).on("contextmenu",(t=>this.handleMouseEvent(t)));document.querySelector("body")?.appendChild(t.element),this.ready=!0,this.ToastedReady=!0,this.DEBUG&&m.success(`${this.moduleName} | Chat log rendered`)}catch(t){}}],["renderChatMessage",async(t,e,s)=>{this.ready&&this.ToastedReady&&this.addMessage(e[0].cloneNode(!0))}]]),socketFns:new Map([["module.toasted",t=>{this.alwaysShowNotifications?ui.notifications?.info(t):m.info(t)}]]),DEBUG:t}),this.registerSettings([{name:"Toast Duration",hint:"How long would you like a message to stay on screen?",type:Number,defaultValue:this.fadeOutDelay,range:{min:1e3,max:1e4,step:250},scope:"client",restricted:!1,onChange:t=>{this.fadeOutDelay=Number(t)}},{name:"Max Messages",hint:"How many messages would you like to see on screen (at most)?",type:Number,defaultValue:this.maxMessagesOnScreen,range:{min:1,max:10,step:1},scope:"client",restricted:!1,onChange:t=>{this.maxMessagesOnScreen=Number(t)}},{name:"Always Show Notifications",hint:"Would you prefer toast are shown even if the chat panel is open?",type:Boolean,defaultValue:this.alwaysShowNotifications,scope:"client",restricted:!1,onChange:t=>{this.alwaysShowNotifications=Boolean(t)}}])}static expandSidebarInstant(t){if(!t)throw new Error("[Toasted:expandSidebarInstant] -> Error: Sidebar element was not passed");const e=new y(t).removeClass("collapsed").unset(["width","height"]);ui.sidebar._collapsed=!1;const s=e.element.querySelector("#sidebar-tabs a.collapse i");if(!s)throw new Error("[Toasted:expandSidebarInstant] -> Error: Icon element was not found");new y(s).removeClass("fa-caret-left").addClass("fa-caret-right"),Hooks.callAll("sidebarCollapse",ui.sidebar,ui.sidebar._collapsed)}static findTarget(t,e,s){const n=t.getBoundingClientRect(),i=document.querySelector(`.${this.name}`).getBoundingClientRect();let o=e.clientX-i.left+n.left,r=e.clientY-i.top+n.top,a=document.elementFromPoint(o,r),l=a?.closest(".message"),h=new y(l).data("messageId");if(a&&h===s)return{target:a,x:o,y:r};const c=e.target.getBoundingClientRect(),d=Math.min(c.width/10,5),m=Math.min(c.height/10,5);for(let t=c.top+1;t<c.bottom;t+=m){r=t-i.top+n.top;for(let t=c.left+1;t<c.right;t+=d)if(o=t-i.left+n.left,a=document.elementFromPoint(o,r),l=a?.closest(".message"),h=new y(l).data("messageId"),a&&h===s)return{target:a,x:o,y:r}}return{target:null,x:o,y:r}}delegateEvent(t,e){const s=new y(t),n=new y(`.${this.moduleName}`).element.querySelector(`[data-message-id="${s.data("messageId")}"]`);if(!n)return;n.scrollIntoView();const{target:i,x:o,y:r}=_.findTarget(n,e,s.data("messageId"));if(!i)return;const a=new MouseEvent(e.type,{bubbles:!0,cancelable:!0,shiftKey:e.shiftKey,metaKey:e.metaKey,ctrlKey:e.ctrlKey,clientX:o,clientY:r});m.info({title:`${this.moduleName} | Delegating event to chat log`,data:{target:i,x:o,y:r,event:a}}),i.dispatchEvent(a)}handleMouseEvent(t){const e=t.target,s=e?.closest(".message");if(!s)return;const n=document.getElementById("sidebar-tabs")?.children[0];n&&!n.classList.contains("active")&&n.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0}));const i=n?.closest("#sidebar");i&&i?.classList.contains("collapsed")&&_.expandSidebarInstant(i),this.delegateEvent(s,t),s.remove()}addMessage(e){if(!this.ready)return;const s=document.querySelector(`.${this.moduleName}`)??document.querySelector(`#${this.lowercaseName}`);if(!s)throw this.DEBUG&&m.error(`${this.moduleName} | Chat log not found`,{this:this,node:e,div:s}),new Error("Chat log not found");const{messageId:n}=e.dataset;if(!n)throw new Error("Message ID not found");const i=s.querySelector(`[data-message-id="${n}"]`);if(i)return this.updateMessage(e,i);s.children.length>=this.maxMessagesOnScreen&&s.firstElementChild?.remove(),s.appendChild(e),t.from(e,.3,{height:0,onComplete:()=>{e.style.height="",this.DEBUG&&m.success(`${this.moduleName} | Toasted message ${n}`),setTimeout((()=>{this.removeMessage(e)}),this.fadeOutDelay)}})}removeMessage(e,{time:s=.3,delay:n=this.fadeOutDelay}={}){this.fadeOutDelay<0||t.to(e,s,{opacity:0,height:0,delay:n,onComplete:()=>{e.remove()}})}updateMessage(t,e){e.parentNode?.replaceChild(t,e),this.removeMessage(t)}}class v{fonts_;uris_;constructor(t){this.fonts_=[],this.uris_=t.urls||[],this.parseFamilyConfig_(t.families)}getUris(){return this.uris_||[]}getFonts(){return this.fonts_}getParsedFonts(){return[]}parseFamilyConfig_(t){t.forEach((t=>{if("string"!=typeof t)this.fonts_.push({family:t.name,variation:"n4"}),this.uris_?.push(t.url);else{const e=t.split(":"),s=e[0];let n=e[1]?.split(",");(!n||n.length<1)&&(n=["n4"]),n.forEach((t=>{this.fonts_.push({family:s,variation:t})}))}}))}}class E{css_;rules_=[];constructor(t){this.css_=t}getParsedFonts(){return this.rules_}parseCSS(){this.css_=this.removeNewLines_(this.css_);const t=this.css_.split("}");t.pop(),t.forEach((t=>{const e=t.split("{"),s=this.parseCSSBlock_(e[1]);this.rules_.push({fontFamily:s["font-family"],fontStyle:s["font-style"],fontWeight:s["font-weight"],src:s.src,unicodeRange:s["font-range"]})}))}parseCSSBlock_(t){const e={},s=t.split(";");return s.pop(),s.forEach((t=>{const s=t.indexOf(":"),n=t.substring(0,s).trim();let i=t.substring(s+1).trim();"'"===i[0]&&"'"===i[i.length-1]&&(i=i.replace(/'/g,"")),""!=n&&""!=i&&(e[n]=i)})),e}removeNewLines_(t){return t.replace(/\n/g,"")}}class b{fontFamilies;parsedFonts;fontTestStrings;INT_FONTS={latin:"BESbswy","latin-ext":"çöüğş",cyrillic:"йяЖ",greek:"αβΣ",khmer:"កខគ",Hanuman:"កខគ"};WEIGHTS={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"};STYLES={i:"i",italic:"i",n:"n",normal:"n"};VARIATION_MATCH=new RegExp("^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$");constructor(t){this.fontFamilies=t,this.parsedFonts=[],this.fontTestStrings={}}parse(){for(const t of this.fontFamilies){const e=t.split(":"),s=e[0].replace(/\+/g," ");let n=["n4"];if(e.length>=2){const t=this.parseVariations(e[1]);if(t.length>0&&(n=t),3===e.length){const t=this.parseSubsets(e[2]);if(t.length>0){const e=this.INT_FONTS[t[0]];e&&(this.fontTestStrings[s]=e)}}}if(!this.fontTestStrings[s]){const t=this.INT_FONTS[s];t&&(this.fontTestStrings[s]=t)}for(const t of n)this.parsedFonts.push({family:s,variation:t})}}generateFontVariationDescription(t){if(!t.match(/^[\w-]+$/))return"";const e=t.toLowerCase(),s=this.VARIATION_MATCH.exec(e);if(null==s)return"";return[this.normalizeStyle(s[2]),this.normalizeWeight(s[1])].join("")}normalizeStyle(t){return null==t||""==t?"n":this.STYLES[t]}normalizeWeight(t){if(null==t||""==t)return"4";if("string"==typeof t){const e=this.WEIGHTS[t];if(e)return e}return"number"==typeof t&&isNaN(t)?"4":t.toString().substr(0,1)}parseVariations(t){const e=[];if(!t)return e;const s=t.split(","),n=s.length;for(let t=0;t<n;t++){const n=s[t],i=this.generateFontVariationDescription(n);i&&e.push(i)}return e}parseSubsets(t){const e=[];return t?t.split(","):e}getFonts(){return this.parsedFonts}getFontTestStrings(){return this.fontTestStrings}}class T{apiUrl_="https://fonts.googleapis.com/css";fonts_;version_;constructor(t,e=1){this.fonts_=t,this.version_=e}buildUri(){const t=new b(this.fonts_);t.parse();const e=t.getFonts().map((t=>`${t.family}:${t.variation}`.replace(/\s/g,"+"))).join("|");return`${this.apiUrl_}?family=${e}`}}class S{fonts_;uri_;constructor(t){this.fonts_=t,this.generateUri_()}getUris(){return this.uri_?[this.uri_]:[]}getFonts(){const t=new b(this.fonts_.families);return t.parse(),t.getFonts()}async getParsedFonts(){if(!this.uri_)throw new Error("No uri provided. Nothing to parse.");const t=await fetch(this.uri_).then((t=>t.text())),e=new E(t);return e.parseCSS(),e.getParsedFonts()}generateUri_(){const t=new T(this.fonts_.families);this.uri_=t.buildUri()}}!function(t){t.LOADING="loading",t.ACTIVE="active",t.INACTIVE="inactive",t.FONT_LOADING="fontloading",t.FONT_ACTIVE="fontactive",t.FONT_INACTIVE="fontinactive"}(u||(u={}));class C{namespace_="wf";classSeparator_="-";event_;config_;htmlElement_;constructor(t){this.config_=t,this.event_=document.createEvent("CustomEvent"),this.htmlElement_=document.documentElement,document.addEventListener(u.LOADING,(()=>{this.handleLoading_()}),!1),document.addEventListener(u.ACTIVE,(()=>{this.handleActive_()}),!1),document.addEventListener(u.INACTIVE,(()=>{this.handleInactive_()}),!1),document.addEventListener(u.FONT_LOADING,(t=>{const{detail:e}=t;this.handleFontLoading_(e)}),!1),document.addEventListener(u.FONT_ACTIVE,(t=>{const{detail:e}=t;this.handleFontActive_(e)}),!1),document.addEventListener(u.FONT_INACTIVE,(t=>{const{detail:e}=t;this.handleFontInactive_(e)}),!1)}handleLoading_(){this.config_.events&&this.config_.loading&&(this.config_.loading.call(null),this.addClassToHtml_(u.LOADING),this.removeClassFromHtml_(u.ACTIVE),this.removeClassFromHtml_(u.INACTIVE))}handleActive_(){this.config_.events&&this.config_.active&&(this.config_.active.call(null),this.removeClassFromHtml_(u.LOADING),this.addClassToHtml_(u.ACTIVE),this.removeClassFromHtml_(u.INACTIVE))}handleInactive_(){this.config_.events&&this.config_.inactive&&(this.config_.inactive.call(null),this.removeClassFromHtml_(u.LOADING),this.removeClassFromHtml_(u.ACTIVE),this.addClassToHtml_(u.INACTIVE))}handleFontLoading_(t){if(this.config_.events&&this.config_.fontloading){const e=t.split(":");this.config_.fontloading.call(null,e[0],e[1]),this.addClassToHtml_(u.LOADING,[e[0],e[1]]),this.removeClassFromHtml_(u.ACTIVE,[e[0],e[1]]),this.removeClassFromHtml_(u.INACTIVE,[e[0],e[1]])}}handleFontActive_(t){if(this.config_.events&&this.config_.fontactive){const e=t.split(":");this.config_.fontactive.call(null,e[0],e[1]),this.removeClassFromHtml_(u.LOADING,[e[0],e[1]]),this.addClassToHtml_(u.ACTIVE,[e[0],e[1]]),this.removeClassFromHtml_(u.INACTIVE,[e[0],e[1]])}}handleFontInactive_(t){if(this.config_.events&&this.config_.fontinactive){const e=t.split(":");this.config_.fontinactive.call(null,e[0],e[1]),this.removeClassFromHtml_(u.LOADING,[e[0],e[1]]),this.removeClassFromHtml_(u.ACTIVE,[e[0],e[1]]),this.addClassToHtml_(u.INACTIVE,[e[0],e[1]])}}addClassToHtml_(t,e=[]){this.htmlElement_.classList.add([this.namespace_].concat(e.map(this.sanitizeClassName_),t).join(this.classSeparator_))}removeClassFromHtml_(t,e=[]){this.htmlElement_.classList.remove([this.namespace_].concat(e.map(this.sanitizeClassName_),t).join(this.classSeparator_))}sanitizeClassName_(t){return t.replace(/[\W_]+/g,"").toLowerCase()}}class F{font_;load_;constructor(t,e){this.font_=t,this.load_=e,this.loading_()}loading_(){document.dispatchEvent(new CustomEvent(u.FONT_LOADING,{detail:`${this.font_.family}:${this.font_.variation}`}))}getFont(){return this.font_}watch(){return document.fonts.check(`16px ${this.font_.family}`,"BESbswy")}}class N{fontWatchers_=[];loadedFonts_=[];watched_=!1;add(t,e){this.fontWatchers_.push(new F(t,e))}fontLoaded(t){this.loadedFonts_.push(t)}watchFonts(){if(!this.watched_){this.watched_=!0;let t=!1;this.fontWatchers_.forEach((e=>{const s=e.getFont(),n=this.loadedFonts_.includes(s.family)||e.watch();n&&(t=!0),document.dispatchEvent(new CustomEvent(n?u.FONT_ACTIVE:u.FONT_INACTIVE,{detail:`${s.family}:${s.variation}`}))})),document.dispatchEvent(new CustomEvent(t?u.ACTIVE:u.INACTIVE,{}))}}}const L={events:!1,classes:!1,timeout:3e3},k=async t=>{const e={...L,...t},s=new N;if((e.classes||e.events)&&new C(e),e.google){const t=new S(e.google);"native"===e.google.load?await I(await t.getParsedFonts()):t.getUris().forEach(A),t.getFonts().forEach((t=>{s.add(t,e.google?.load||"link")}))}if(e.custom){if("native"===e.custom.load)throw new Error("Native load is not implemented for custom fonts.");const t=new v(e.custom);t.getUris().forEach(A),t.getFonts().forEach((t=>{s.add(t,"link")}))}(e.classes||e.events)&&(document.dispatchEvent(new CustomEvent(u.LOADING,{})),document.fonts.onloadingdone=t=>{t.fontfaces.forEach((async t=>{"loaded"===t.status&&s.fontLoaded(t.family)})),s.watchFonts()},setTimeout((()=>{s.watchFonts()}),e.timeout))},I=async t=>{for(const e of t){const t=new FontFace(e.fontFamily,e.src,{style:e.fontStyle,unicodeRange:e.unicodeRange,weight:e.fontWeight});await t.load(),document.fonts.add(t)}},A=t=>{const e=document.createElement("link");e.rel="stylesheet",e.href=t,e.media="all",document.head.appendChild(e)};class H extends w{static fonts=["Caslon","CaslonAntique","SignikaBold","Riffic","IronSans","LinLibertine","TimesNewRomance","TimesNewYorker","LPEducational","Cardinal","OldLondon","StoneHenge","SunnyDay","PaulSignature","LemonTuesday","FairProsper","BalletHarmony","MagieraScript","Cathallina","Hamish","DreamersBrush","FastInMyCar","ChildWriting","Kindergarten","FuturaHandwritten","Fewriter","TrashHand","GoodBrush","BaksoSapi","SuplexmentaryComic","ComicInk","DreamyLand","Yikes","GangOfThree","JianGkrik","Yozakura","Hiroshio","ArabDances","Rooters","Subway","Himagsikan","MilTown","Galactico","Oko","Ethnocentric","VenusRising","StampAct","Kirsty","Western","BreakAway","YoungerThanMe","Underground","VarsityTeam","Valentino","GlassHouses","Makayla","DancingVampyrish","Codex","DSNetStamped","HappyFrushZero","Shoplifter","Stereofidelic","Headache","HorrorHouse","GhostTheory2","Syemox","GhostChase"];static fontWeights=["100","200","300","400","500","600","700","800","900"];static fontStyles=["normal","italic","oblique"];get titleFont(){return this.getSetting("Title Font")??"GhostTheory2"}static get titleFont(){return game.settings?.get("wonderlost","narrator-title-font")??"GhostTheory2"}static set titleFont(t){game.settings?.set("wonderlost","narrator-title-font",t)}get textFont(){return this.getSetting("Text Font")??"GhostTheory2"}static get textFont(){return game.settings?.get("wonderlost","narrator-text-font")??"GhostTheory2"}static set textFont(t){game.settings?.set("wonderlost","narrator-text-font",t)}get titleWeight(){return this.getSetting("Title Weight")??"400"}static get titleWeight(){return game.settings?.get("wonderlost","narrator-title-weight")??"400"}static set titleWeight(t){game.settings?.set("wonderlost","narrator-title-weight",t)}constructor(t=!1){super({moduleName:"Narrator",moduleDescription:"An extremely customizable on screen narrator system",hooks:new Map([["ready",(t,e)=>{k({custom:{families:[H.titleFont,H.textFont]}});let s=[];for(let t=H.fonts.length-1;t>=0;--t)H.fonts[t]!==H.titleFont&&H.fonts[t]!==H.textFont&&s.push(H.fonts[t]);!async function(t){k({custom:{families:t}})}(s)}]]),socketFns:new Map([]),DEBUG:t}),this.registerSettings([{name:"Title Font",hint:"The font used for the title text",type:String,scope:"world",defaultValue:"GhostTheory2",choices:Object.fromEntries(H.fonts.map((t=>[t,t])))},{name:"Text Font",hint:"The font used for the text body",type:String,scope:"world",defaultValue:"GhostTheory2",choices:Object.fromEntries(H.fonts.map((t=>[t,t])))},{name:"Title Weight",hint:"The weight of the title font",type:String,scope:"world",defaultValue:"400",choices:Object.fromEntries(H.fontWeights.map((t=>[t,t])))}])}}class M{DEBUG;tomes=new Map([["Toasted",_],["Narrator",H]]);constructor(t=!1){this.DEBUG=t,this.DEBUG=t,m.info("Wonderlost | Initialized",this)}initializeTomes(){for(const[t,e]of this.tomes)new e(this.DEBUG).initialize(),this.DEBUG&&m.info(`Wonderlost | Initialized ${t}`,e)}}Hooks.once("init",(async function(){m.start("Wonderlost | Initialized"),new M(!0).initializeTomes(),m.success("Wonderlost | Ready")}));
//# sourceMappingURL=wonderlost.mjs.map
