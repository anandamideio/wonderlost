import{TweenMax as e}from"../../../scripts/greensock/esm/all.js";const t={silent:Number.NEGATIVE_INFINITY,fatal:0,error:0,warn:1,log:2,info:3,success:3,fail:3,ready:3,start:3,box:3,debug:4,trace:5,verbose:Number.POSITIVE_INFINITY},s={silent:{level:-1},fatal:{level:t.fatal},error:{level:t.error},warn:{level:t.warn},log:{level:t.log},info:{level:t.info},success:{level:t.success},fail:{level:t.fail},ready:{level:t.info},start:{level:t.info},box:{level:t.info},debug:{level:t.debug},trace:{level:t.trace},verbose:{level:t.verbose}};function n(e){return null!==e&&"object"==typeof e}function o(e,t,s=".",i){if(!n(t))return o(e,{},s);const r=Object.assign({},t);for(const t in e){if("__proto__"===t||"constructor"===t)continue;const i=e[t];null!=i&&(Array.isArray(i)&&Array.isArray(r[t])?r[t]=[...i,...r[t]]:n(i)&&n(r[t])?r[t]=o(i,r[t],(s?`${s}.`:"")+t.toString()):r[t]=i)}return r}const i=(...e)=>e.reduce(((e,t)=>o(e,t,"")),{});function r(e){return t=e,"[object Object]"===Object.prototype.toString.call(t)&&(!(!e.message&&!e.args)&&!e.stack);var t}let a=!1;const l=[];class h{constructor(e={}){const t=e.types||s;this.options=i({...e,defaults:{...e.defaults},level:c(e.level,t),reporters:[...e.reporters||[]]},{types:s,throttle:1e3,throttleMin:5,formatOptions:{date:!0,colors:!1,compact:!0}});for(const e in t){const s={type:e,...this.options.defaults,...t[e]};this[e]=this._wrapLogFn(s),this[e].raw=this._wrapLogFn(s,!0)}this.options.mockFn&&this.mockTypes(),this._lastLog={}}get level(){return this.options.level}set level(e){this.options.level=c(e,this.options.types,this.options.level)}prompt(e,t){if(!this.options.prompt)throw new Error("prompt is not supported!");return this.options.prompt(e,t)}create(e){const t=new h({...this.options,...e});return this._mockFn&&t.mockTypes(this._mockFn),t}withDefaults(e){return this.create({...this.options,defaults:{...this.options.defaults,...e}})}withTag(e){return this.withDefaults({tag:this.options.defaults.tag?this.options.defaults.tag+":"+e:e})}addReporter(e){return this.options.reporters.push(e),this}removeReporter(e){if(e){const t=this.options.reporters.indexOf(e);if(t>=0)return this.options.reporters.splice(t,1)}else this.options.reporters.splice(0);return this}setReporters(e){return this.options.reporters=Array.isArray(e)?e:[e],this}wrapAll(){this.wrapConsole(),this.wrapStd()}restoreAll(){this.restoreConsole(),this.restoreStd()}wrapConsole(){for(const e in this.options.types)console["__"+e]||(console["__"+e]=console[e]),console[e]=this[e].raw}restoreConsole(){for(const e in this.options.types)console["__"+e]&&(console[e]=console["__"+e],delete console["__"+e])}wrapStd(){this._wrapStream(this.options.stdout,"log"),this._wrapStream(this.options.stderr,"log")}_wrapStream(e,t){e&&(e.__write||(e.__write=e.write),e.write=e=>{this[t].raw(String(e).trim())})}restoreStd(){this._restoreStream(this.options.stdout),this._restoreStream(this.options.stderr)}_restoreStream(e){e&&e.__write&&(e.write=e.__write,delete e.__write)}pauseLogs(){a=!0}resumeLogs(){a=!1;const e=l.splice(0);for(const t of e)t[0]._logFn(t[1],t[2])}mockTypes(e){const t=e||this.options.mockFn;if(this._mockFn=t,"function"==typeof t)for(const e in this.options.types)this[e]=t(e,this.options.types[e])||this[e],this[e].raw=this[e]}_wrapLogFn(e,t){return(...s)=>{if(!a)return this._logFn(e,s,t);l.push([this,e,s,t])}}_logFn(e,t,s){if((e.level||0)>this.level)return!1;const n={date:new Date,args:[],...e,level:c(e.level,this.options.types)};!s&&1===t.length&&r(t[0])?Object.assign(n,t[0]):n.args=[...t],n.message&&(n.args.unshift(n.message),delete n.message),n.additional&&(Array.isArray(n.additional)||(n.additional=n.additional.split("\n")),n.args.push("\n"+n.additional.join("\n")),delete n.additional),n.type="string"==typeof n.type?n.type.toLowerCase():"log",n.tag="string"==typeof n.tag?n.tag:"";const o=(e=!1)=>{const t=(this._lastLog.count||0)-this.options.throttleMin;if(this._lastLog.object&&t>0){const e=[...this._lastLog.object.args];t>1&&e.push(`(repeated ${t} times)`),this._log({...this._lastLog.object,args:e}),this._lastLog.count=1}e&&(this._lastLog.object=n,this._log(n))};clearTimeout(this._lastLog.timeout);const i=this._lastLog.time&&n.date?n.date.getTime()-this._lastLog.time.getTime():0;if(this._lastLog.time=n.date,i<this.options.throttle)try{const e=JSON.stringify([n.type,n.tag,n.args]),t=this._lastLog.serialized===e;if(this._lastLog.serialized=e,t&&(this._lastLog.count=(this._lastLog.count||0)+1,this._lastLog.count>this.options.throttleMin))return void(this._lastLog.timeout=setTimeout(o,this.options.throttle))}catch{}o(!0)}_log(e){for(const t of this.options.reporters)t.log(e,{options:this.options})}}function c(e,t={},s=3){return void 0===e?s:"number"==typeof e?e:t[e]&&void 0!==t[e].level?t[e].level:s}h.prototype.add=h.prototype.addReporter,h.prototype.remove=h.prototype.removeReporter,h.prototype.clear=h.prototype.removeReporter,h.prototype.withScope=h.prototype.withTag,h.prototype.mock=h.prototype.mockTypes,h.prototype.pause=h.prototype.pauseLogs,h.prototype.resume=h.prototype.resumeLogs;class m{constructor(e){this.options={...e},this.defaultColor="#7f8c8d",this.levelColorMap={0:"#c0392b",1:"#f39c12",3:"#00BCD4"},this.typeColorMap={success:"#2ecc71"}}_getLogFn(e){return e<1?console.__error||console.error:1===e?console.__warn||console.warn:console.__log||console.log}log(e){const t=this._getLogFn(e.level),s="log"===e.type?"":e.type,n=e.tag||"",o=`\n      background: ${this.typeColorMap[e.type]||this.levelColorMap[e.level]||this.defaultColor};\n      border-radius: 0.5em;\n      color: white;\n      font-weight: bold;\n      padding: 2px 0.5em;\n    `,i=`%c${[n,s].filter(Boolean).join(":")}`;"string"==typeof e.args[0]?t(`${i}%c ${e.args[0]}`,o,"",...e.args.slice(1)):t(i,o,...e.args)}}const u=function(e={}){return function(e={}){return new h(e)}({reporters:e.reporters||[new m({})],prompt:(e,t={})=>"confirm"===t.type?Promise.resolve(confirm(e)):Promise.resolve(prompt(e)),...e})}();var d=Object.defineProperty,p=(e,t,s)=>(((e,t,s)=>{t in e?d(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s})(e,"symbol"!=typeof t?t+"":t,s),s);function g(e){return e instanceof HTMLElement}class f{constructor(e){if(p(this,"element"),p(this,"debug",!1),g(e))return void(this.element=e);if("function"==typeof e){const t=e();if(!t)throw new Error("Function must return an element");if(this.debug&&console.log("Function returned",t),g(t))return void(this.element=t);if("string"==typeof t){const s=document.querySelector(t);if(!s)throw new Error(`You tried to grab using '${e}' but that doesn't exist!`);return void(this.element=s)}}const t=document.querySelector(e);if(!t)throw new Error(`You tried to grab using '${e}' but that doesn't exist!`);this.element=t}self(){return this.element}toggleClass(e){return"string"==typeof e&&e.includes(" ")&&(e=e.split(" ")),Array.isArray(e)||(e=[e]),e.forEach((e=>this.element.classList.toggle(e))),this}addClass(e){return"function"==typeof e&&(e=e()),"string"==typeof e&&e.includes(" ")&&(e=e.split(" ")),Array.isArray(e)||(e=[e]),e.forEach((e=>this.element.classList.add(e))),this}removeClass(e){return"function"==typeof e&&(e=e()),"string"==typeof e&&e.includes(" ")&&(e=e.split(" ")),Array.isArray(e)||(e=[e]),e.forEach((e=>this.element.classList.remove(e))),this}hasClass(e){return this.element.classList.contains(e)}replaceWith(e){return this.element.outerHTML=e,this}replaceWithElement(e,t=void 0){const s=document.createElement(e);if(s.id=t??this.element.id,!this.element?.parentNode)throw new Error("Element has no parent node, can not replace");return this.element.parentNode.replaceChild(s,this.element),new f(`#${s.id}`)}html(e){return this.element.innerHTML=e,this}empty(){return this.element.innerHTML="",this}check(e){if(this.element instanceof HTMLInputElement)return this.element.checked=e,this;throw new TypeError(`[El::${this.element.id}] You can only use check() on input elements'`)}checked(){if(this.element instanceof HTMLInputElement)return this.element.checked;throw new TypeError(`[El::${this.element.id}] You can only use checked() on input elements'`)}click(){return this.element.dispatchEvent(new MouseEvent("click",{view:window,bubbles:!0,cancelable:!1})),this}if(e){return e?this:null}wrap(e){const t=document.createElement("div");if(t.className=e,!this.element?.parentNode)throw new Error("Element has no parent node, can not wrap");return this.element.parentNode.insertBefore(t,this.element),this.element.parentNode.removeChild(this.element),t.appendChild(this.element),this}src(e){if(!(this.element instanceof HTMLImageElement))throw new TypeError(`[El::${this.element.id}] You can only use src() on image elements'`);return this.element.src=e,this}alt(e){if(!(this.element instanceof HTMLImageElement))throw new TypeError(`[El::${this.element.id}] You can only use alt() on image elements'`);return this.element.alt=e,this}parent(){const e=this.element.parentElement;if(!e)throw new Error("Element has no parent node, can not get parent");return e.id||(e.id=`parent-${this.element.id}`),new f(`#${e?.id}`)}remove(){if(!this.element?.parentNode)throw new Error("Element has no parent node, can not remove");return this.element.parentNode.removeChild(this.element),this}clear(){return this.element.innerHTML="",this}unset(e){return"string"==typeof e&&(e=[e]),e.forEach((e=>{this.element.removeAttribute(e)})),this}set(e){return Object.entries(e).forEach((([e,t])=>{t&&this.element.setAttribute(e,"string"==typeof t?t:t.toString())})),this}firstChild(){return this.element.firstElementChild}child(e,t=null){return"string"==typeof e?t&&"append"!==t?this.element.insertAdjacentHTML("afterbegin",e):this.element.insertAdjacentHTML("beforeend",e):("append"!==t&&null!=t||this.element.append(e),"prepend"===t&&this.element.prepend(e)),this}children(){return this.element.childNodes}text(e){return e?(this.element.textContent=e.toString(),this):this}textContent(e){return e?(this.element.textContent=e,this):this.element.textContent}textChild(e){const t=document.createTextNode(e.toString());return this.element.appendChild(t),this}type(e){return"type"in this.element&&this.element.setAttribute("type",e),this}name(e){return"name"in this.element&&(this.element.name=e),this}input(e){return"name"in this.element&&(this.element.name=this.element.id),"type"in this.element&&this.element.setAttribute("type",e),this}htmlFor(e){return"htmlFor"in this.element&&this.element.setAttribute("for",e),this}id(e){return e?(this.element.id=e,this):this.element.id}val(e){if(this.element instanceof HTMLInputElement||this.element instanceof HTMLSelectElement||this.element instanceof HTMLTextAreaElement||this.element instanceof HTMLOptionElement||this.element instanceof HTMLProgressElement)return null==e?this.element.value:(this.element.value=e instanceof Date?`${e.getFullYear()}-${e.getMonth()+1}-${e.getDate()}`:"string"==typeof e?e:e.toString(),this);throw new TypeError(`[El::${this.element.id}] You can only use val() on input / select / text area / progress elements'`)}data(e){return this.element.getAttribute(`data-${e}`)}dataset(){return this.element.dataset}on(e,t,s){return this.element.addEventListener(e,t,s),this}once(e,t){return this.element.addEventListener(e,t,{once:!0}),this}now(e,t){return this.element.dispatchEvent(new CustomEvent(e,{detail:t})),this}off(e,t,s){return this.element.removeEventListener(e,t,s),this}trigger(e,t){return this.element.dispatchEvent(new CustomEvent(e,t)),this}triggerChange(){if(this.element instanceof HTMLSelectElement){const e=document.createEvent("HTMLEvents");return e.initEvent("change",!0,!0),this.element.dispatchEvent(e),this}throw new TypeError(`[El::${this.element.id}] You can only use triggerChange() on select elements'`)}find(e){return this.element.querySelectorAll(e)}dispatchEvent(e){return this.element.dispatchEvent(new Event(e)),this}nestFrom(e){return e(`#${this.element.id}`),this}}class y{moduleName;moduleDescription;settings=[];hooks=new Map([]);socketFns=new Map;DEBUG=!1;ready=!1;get name(){return this.moduleName}get lowercaseName(){return this.moduleName.toLowerCase()}constructor(e){this.moduleName=e.moduleName,this.moduleDescription=e.moduleDescription,e?.settings&&(this.settings=e.settings.globalSettings?.map((e=>(e.scope="world",e)))??[],this.settings.push(...e.settings.clientSettings?.map((e=>(e.scope="client",e)))??[])),this.hooks=e?.hooks??new Map,this.socketFns=e?.socketFns??new Map,this.DEBUG=e?.DEBUG??!1}addHook(e,t,s=!1){!this.hooks.has(e)||s?this.hooks.set(e,t):u.warn(`Hook for event "${e}" already exists.`)}initializeHooks(){return this.hooks.forEach(((e,t)=>{this.DEBUG&&u.box({title:`[TOME::${this.moduleName}] => Registering hook for ${t}`,additional:{callback:e.toString()}}),Hooks.on(t,e)})),this}registerSetting(e){switch(e.type){case Number:case Boolean:case String:case Object:case Array:case Color:this.settings.push({...e});break;default:throw new Error(`Unsupported rule type: ${e.type}`)}return this}registerSettings(e){return e.forEach((e=>{this.registerSetting(e)})),this}initializeSettings(){return this.settings.forEach((e=>{this.DEBUG&&u.box({title:`[TOME::${this.moduleName}] => Registering ${e.name}`,additional:{...e}}),game.settings?.register("wonderlost",y.kabob(`${this.lowercaseName}-${e.name}`),{name:e.name,hint:e.hint,scope:e.scope,config:!0,default:e?.defaultValue,type:e.type,choices:e?.choices,range:e?.range,onChange:e.onChange,requiresReload:e.requiresReload})})),this}getSetting(e){return game.settings?.get("wonderlost",y.kabob(`${this.lowercaseName}-${e}`))}async setSetting(e,t){return game.settings?.set("wonderlost",y.kabob(`${this.lowercaseName}-${e}`),t)}registerSettingSubmenu(e){game.settings?.register("wonderlost",y.kabob(`${this.lowercaseName}-allSettings`),{scope:"world",config:!1,type:Object,default:e.data});const t=`${this.lowercaseName}`,s=this.moduleName.toString();game.settings?.registerMenu("wonderlost",y.kabob(`${this.lowercaseName}-allSettings`),{name:e.name,label:e.label,hint:e.hint,icon:e.icon,restricted:e.restricted,type:class extends FormApplication{constructor(){super({})}static get defaultOptions(){return foundry.utils.mergeObject(super.defaultOptions,{title:`Wonderlost: ${s}`,id:`${s}-settings`,width:550,height:"auto",popOut:!0,closeOnSubmit:!0,template:`modules/wonderlost/submodules/${t}/settings.hbs`})}static get moduleName(){return s}getData(){return foundry.utils.isEmpty(game.settings?.get(s,`${s.toLowerCase()}-allSettings`))?game.settings?.get(s,`${s.toLowerCase()}-allSettings`):e.data}async _updateObject(e,t){await(game.settings?.set(s,`${s.toLowerCase()}-allSettings`,t))}}})}initializeSocketListeners(){return 0===this.socketFns.size||this.socketFns.forEach(((e,t)=>{this.DEBUG&&u.info(`Registering socket listener for event: ${t}`),game.socket?.on(t,(t=>e(t)))})),this}initialize(){return this.initializeSettings().initializeHooks().initializeSocketListeners(),this.ready=!0,this}static expandObject(e){if("object"==typeof e&&null!==e)return Object.entries(e).reduce(((e,[t,s])=>{if("string"==typeof s)try{e[t]=JSON.parse(s)}catch(n){e[t]=s}else e[t]=s;return e}),{});throw new Error("Expected object but received "+typeof e)}static kabob(e){return e?e.split("").join("-"):""}}class w extends y{maxMessagesOnScreen=5;alwaysShowNotifications=!0;fadeOutDelay=3e3;menu=null;constructor(e=!1){super({moduleName:"Toasted",moduleDescription:"A customizable toast notification system",hooks:new Map([["renderChatLog",async(e,t)=>{try{if(document.body.classList.contains("stream"))return;const e=new f(t[0].querySelector("#chat-log").cloneNode(!1)).addClass(this.moduleName).id(this.lowercaseName).on("click",(e=>this.handleMouseEvent(e))).on("contextmenu",(e=>this.handleMouseEvent(e)));document.querySelector("body")?.appendChild(e.element),this.DEBUG&&u.success(`${this.moduleName} | Chat log rendered`)}catch(e){}}],["renderChatMessage",async(e,t,s)=>{this.addMessage(t[0].cloneNode(!0))}]]),socketFns:new Map([["module.toasted",e=>{this.alwaysShowNotifications?ui.notifications?.info(e):u.info(e)}]]),DEBUG:e}),this.registerSettings([{name:"Toast Duration",hint:"How long would you like a message to stay on screen?",type:Number,defaultValue:this.fadeOutDelay,range:{min:1e3,max:1e4,step:250},scope:"client",restricted:!1,onChange:e=>{this.fadeOutDelay=Number(e)}},{name:"Max Messages",hint:"How many messages would you like to see on screen (at most)?",type:Number,defaultValue:this.maxMessagesOnScreen,range:{min:1,max:10,step:1},scope:"client",restricted:!1,onChange:e=>{this.maxMessagesOnScreen=Number(e)}},{name:"Always Show Notifications",hint:"Would you prefer toast are shown even if the chat panel is open?",type:Boolean,defaultValue:this.alwaysShowNotifications,scope:"client",restricted:!1,onChange:e=>{this.alwaysShowNotifications=Boolean(e)}}])}static expandSidebarInstant(e){if(!e)throw new Error("[Toasted:expandSidebarInstant] -> Error: Sidebar element was not passed");const t=new f(e).removeClass("collapsed").unset(["width","height"]);ui.sidebar._collapsed=!1;const s=t.element.querySelector("#sidebar-tabs a.collapse i");if(!s)throw new Error("[Toasted:expandSidebarInstant] -> Error: Icon element was not found");new f(s).removeClass("fa-caret-left").addClass("fa-caret-right"),Hooks.callAll("sidebarCollapse",ui.sidebar,ui.sidebar._collapsed)}static findTarget(e,t,s){const n=e.getBoundingClientRect(),o=document.querySelector(`.${this.name}`).getBoundingClientRect();let i=t.clientX-o.left+n.left,r=t.clientY-o.top+n.top,a=document.elementFromPoint(i,r),l=a?.closest(".message"),h=new f(l).data("messageId");if(a&&h===s)return{target:a,x:i,y:r};const c=t.target.getBoundingClientRect(),m=Math.min(c.width/10,5),u=Math.min(c.height/10,5);for(let e=c.top+1;e<c.bottom;e+=u){r=e-o.top+n.top;for(let e=c.left+1;e<c.right;e+=m)if(i=e-o.left+n.left,a=document.elementFromPoint(i,r),l=a?.closest(".message"),h=new f(l).data("messageId"),a&&h===s)return{target:a,x:i,y:r}}return{target:null,x:i,y:r}}delegateEvent(e,t){const s=new f(e),n=new f(`.${this.moduleName}`).element.querySelector(`[data-message-id="${s.data("messageId")}"]`);if(!n)return;n.scrollIntoView();const{target:o,x:i,y:r}=w.findTarget(n,t,s.data("messageId"));if(!o)return;const a=new MouseEvent(t.type,{bubbles:!0,cancelable:!0,shiftKey:t.shiftKey,metaKey:t.metaKey,ctrlKey:t.ctrlKey,clientX:i,clientY:r});u.info({title:`${this.moduleName} | Delegating event to chat log`,data:{target:o,x:i,y:r,event:a}}),o.dispatchEvent(a)}handleMouseEvent(e){const t=e.target,s=t?.closest(".message");if(!s)return;const n=document.getElementById("sidebar-tabs")?.children[0];n&&!n.classList.contains("active")&&n.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0}));const o=n?.closest("#sidebar");o&&o?.classList.contains("collapsed")&&w.expandSidebarInstant(o),this.delegateEvent(s,e),s.remove()}addMessage(t){if(!this.ready)return;const s=new f(`#${this.lowercaseName}`);if(!s)throw this.DEBUG&&u.error(`${this.moduleName} | Chat log not found`,{this:this,node:t,div:s}),new Error("Chat log not found");const{messageId:n}=t.dataset;if(!n)throw new Error("Message ID not found");const o=s.element.querySelector(`[data-message-id="${n}"]`);if(o)return this.updateMessage(t,o);s.children.length>=this.maxMessagesOnScreen&&s.element.firstElementChild?.remove(),s.child(t,"append"),e.from(t,.3,{height:0,onComplete:()=>{t.style.height="",this.DEBUG&&u.success(`${this.moduleName} | Toasted message ${n}`),setTimeout((()=>{this.removeMessage(t)}),this.fadeOutDelay)}})}removeMessage(t,{time:s=.3,delay:n=this.fadeOutDelay}={}){this.fadeOutDelay<0||e.to(t,s,{opacity:0,height:0,delay:n,onComplete:()=>{t.remove()}})}updateMessage(e,t){t.parentNode?.replaceChild(e,t),this.removeMessage(e)}}class b extends y{constructor(e=!1){super({moduleName:"Narrator",moduleDescription:"An extremely customizable on screen narrator system",hooks:new Map([]),socketFns:new Map([]),DEBUG:e})}}class E{DEBUG;tomes=new Map([["Toasted",w],["Narrator",b]]);constructor(e=!1){this.DEBUG=e,u.info("Wonderlost | Initializing"),this.initializeTomes()}initializeTomes(){this.tomes.forEach(((e,t)=>{new e(this.DEBUG).initialize(),this.DEBUG&&u.info(`Wonderlost | Initialized ${t}`)}))}}Hooks.once("init",(async function(){u.start("Wonderlost | Initialized"),new E(!0),u.success("Wonderlost | Ready")})),Hooks.once("ready",(async function(){}));
//# sourceMappingURL=wonderlost.mjs.map
