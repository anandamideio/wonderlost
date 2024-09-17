import consola from 'consola';
import { Mote, El } from '@magik_io/mote';
import { TweenMax } from '../../../../../scripts/greensock/esm/all.js';

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Tome {
  constructor(pTome) {
    __publicField$2(this, "moduleName");
    __publicField$2(this, "moduleDescription");
    __publicField$2(this, "settings", []);
    __publicField$2(this, "hooks", /* @__PURE__ */ new Map([]));
    __publicField$2(this, "DEBUG", false);
    this.moduleName = pTome.moduleName;
    this.moduleDescription = pTome.moduleDescription;
    if (pTome?.settings) {
      this.settings = pTome.settings.globalSettings?.map((s) => {
        s.scope = "world";
        return s;
      }) ?? [];
      this.settings.push(
        ...pTome.settings.clientSettings?.map((s) => {
          s.scope = "client";
          return s;
        }) ?? []
      );
    }
    this.DEBUG = pTome?.DEBUG ?? false;
  }
  initializeSettings() {
    this.settings.forEach((setting) => {
      if (this.DEBUG) {
        consola.info(
          `[TOME::${this.moduleName}] => Registering ${setting.scope} setting: ${setting.name}`
        );
      }
      game.settings?.register(this.moduleName, setting.name, {
        name: setting.name,
        hint: setting.label,
        scope: setting.scope,
        config: true,
        default: setting?.defaultValue,
        type: setting.type,
        // @ts-ignore
        choices: setting?.choices,
        // @ts-ignore
        range: setting?.range,
        onChange: setting.onChange,
        requiresReload: setting.requiresReload
      });
    });
    return this;
  }
  addHook(event, callback, overwrite = false) {
    if (!this.hooks.has(event) || overwrite) {
      this.hooks.set(event, callback);
    } else {
      consola.warn(`Hook for event "${event}" already exists.`);
    }
  }
  registerHooks() {
    this.hooks.forEach((callback, event) => {
      Hooks.on(event, callback);
      if (this.DEBUG)
        consola.info(`Registered hook for event: ${event}`);
    });
    return this;
  }
  // Method to register global settings
  registerSetting(rule) {
    switch (rule.type) {
      case Number:
        this.settings.push({ ...rule });
        break;
      case Boolean:
        this.settings.push({ ...rule });
        break;
      case String:
        this.settings.push({ ...rule });
        break;
      case Object:
        this.settings.push({ ...rule });
        break;
      case Array:
        this.settings.push({ ...rule });
        break;
      case Color:
        this.settings.push({ ...rule });
        break;
      default:
        throw new Error(`Unsupported rule type: ${rule.type}`);
    }
    return this;
  }
  registerSettings(rules) {
    rules.forEach((rule) => {
      this.registerSetting(rule);
    });
    return this;
  }
  // Utility function to expand object rules
  static expandObject(value) {
    if (typeof value === "object" && value !== null) {
      return Object.entries(value).reduce(
        (acc, [key, val]) => {
          if (typeof val === "string") {
            try {
              acc[key] = JSON.parse(val);
            } catch (e) {
              acc[key] = val;
            }
          } else {
            acc[key] = val;
          }
          return acc;
        },
        {}
      );
    }
    throw new Error(`Expected object but received ${typeof value}`);
  }
  // Method to update settings
  updateSettings() {
    const globalData = game.settings?.get(this.moduleName, "global");
    const clientData = game.settings?.get(
      this.moduleName,
      game.user.id
    );
    this.settings.forEach((rule) => {
      if (rule.scope === "world") {
        rule?.onChange?.(globalData[rule.name]);
      } else if (rule.scope === "client") {
        rule?.onChange?.(clientData[rule.name]);
      }
    });
  }
  // Method to save settings
  saveSettings() {
    const rules = {
      world: {},
      client: {}
    };
    this.settings.forEach((rule) => {
      switch (rule.type) {
        case Number:
          rules[rule.scope][rule.name] = Number(rule.defaultValue);
          break;
        case Boolean:
          rules[rule.scope][rule.name] = Boolean(rule.defaultValue);
          break;
        case String:
          rules[rule.scope][rule.name] = String(rule.defaultValue);
          break;
        case Object:
          rules[rule.scope][rule.name] = JSON.stringify(
            Tome.expandObject(rule.defaultValue)
          );
          break;
        case Array:
          rules[rule.scope][rule.name] = JSON.stringify(
            JSON.parse(String(rule.defaultValue))
          );
          break;
        case Color:
          rules[rule.scope][rule.name] = String(rule.defaultValue);
          break;
      }
    });
    game.settings?.register(this.moduleName, "global", rules.world);
    game.settings?.register(this.moduleName, game.user.id, rules.client);
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Toasted extends Tome {
  constructor(DEBUG = false) {
    super({
      moduleName: "Toasted",
      moduleDescription: "A simple toast notification system",
      hooks: /* @__PURE__ */ new Map([
        [
          "renderChatLog",
          async (app, html) => {
            if (document.body.classList.contains("stream"))
              return;
            const chatTab = html[0];
            new Mote(
              html[0].querySelector("#chat-log").cloneNode(false)
            ).addClass(this.moduleName).on("click", (ev) => this.handleMouseEvent(ev)).on("contextmenu", (ev) => this.handleMouseEvent(ev)).appendToBody();
            Hooks.on("renderChatMessage", (app2, html2, options) => {
              if (chatTab.classList.contains("active") && !chatTab.closest("#sidebar")?.classList.contains("collapsed")) {
                return;
              }
              const newNode = html2[0].cloneNode(true);
              this.addMessage(newNode);
            });
          }
        ]
      ]),
      DEBUG
    });
    __publicField$1(this, "toasts", []);
    __publicField$1(this, "maxMessagesOnScreen", 5);
    __publicField$1(this, "alwaysShowNotifications", false);
    __publicField$1(this, "fadeOutDelay", 3e3);
    this.registerSettings([
      {
        name: "toastDuration",
        label: "How long would you like a message to stay on screen?",
        type: Number,
        defaultValue: this.fadeOutDelay,
        range: { min: 1e3, max: 1e4, step: 250 },
        icon: "clock",
        scope: "client",
        restricted: false,
        onChange: (value) => {
          this.fadeOutDelay = Number(value);
        }
      },
      {
        name: "maxMessages",
        label: "How many messages would you like to see on screen (at most)?",
        type: Number,
        defaultValue: this.maxMessagesOnScreen,
        range: { min: 1, max: 10, step: 1 },
        icon: "list",
        scope: "client",
        restricted: false,
        onChange: (value) => {
          this.maxMessagesOnScreen = Number(value);
        }
      },
      {
        name: "alwaysShowNotifications",
        label: "Always show notifications",
        type: Boolean,
        defaultValue: this.alwaysShowNotifications,
        icon: "eye",
        scope: "client",
        restricted: false,
        onChange: (value) => {
          this.alwaysShowNotifications = Boolean(value);
        }
      }
    ]);
  }
  removeMessage(node, { time = 0.3, delay = this.fadeOutDelay } = {}) {
    if (this.fadeOutDelay < 0)
      return;
    TweenMax.to(node, time, {
      opacity: 0,
      height: 0,
      delay,
      onComplete: () => {
        node.remove();
      }
    });
  }
  static expandSidebarInstant(sidebar) {
    if (!sidebar)
      throw new Error(
        "[Toasted:expandSidebarInstant] -> Error: Sidebar element was not passed"
      );
    const sideB = new El(sidebar).removeClass("collapsed").unset(["width", "height"]);
    ui.sidebar._collapsed = false;
    const icon = sideB.element.querySelector(
      "#sidebar-tabs a.collapse i"
    );
    if (!icon)
      throw new Error(
        "[Toasted:expandSidebarInstant] -> Error: Icon element was not found"
      );
    new El(icon).removeClass("fa-caret-left").addClass("fa-caret-right");
    Hooks.callAll("sidebarCollapse", ui.sidebar, ui.sidebar._collapsed);
  }
  static findTarget(card, event, messageID) {
    const cardRect = card.getBoundingClientRect();
    const popupRect = document.querySelector(`.${this.name}`).getBoundingClientRect();
    let x = event.clientX - popupRect.left + cardRect.left, y = event.clientY - popupRect.top + cardRect.top;
    let target = document.elementFromPoint(x, y);
    let closestMessage = target?.closest(".message");
    let closestMessageID = new El(closestMessage).data(
      "messageId"
    );
    if (target && closestMessageID === messageID) {
      return { target, x, y };
    }
    const targetRect = event.target.getBoundingClientRect();
    const dx = Math.min(targetRect.width / 10, 5);
    const dy = Math.min(targetRect.height / 10, 5);
    for (let vert = targetRect.top + 1; vert < targetRect.bottom; vert += dy) {
      y = vert - popupRect.top + cardRect.top;
      for (let hor = targetRect.left + 1; hor < targetRect.right; hor += dx) {
        x = hor - popupRect.left + cardRect.left;
        target = document.elementFromPoint(x, y);
        closestMessage = target?.closest(".message");
        closestMessageID = new El(closestMessage).data(
          "messageId"
        );
        if (target && closestMessageID === messageID)
          return { target, x, y };
      }
    }
    return { target: null, x, y };
  }
  delegateEvent(n, ev) {
    const node = new El(n);
    const card = new El("#chat-log").element.querySelector(
      `[data-message-id="${node.data("messageId")}"]`
    );
    if (!card)
      return;
    card.scrollIntoView();
    const { target, x, y } = Toasted.findTarget(
      card,
      ev,
      node.data("messageId")
    );
    if (!target)
      return;
    const event = new MouseEvent(ev.type, {
      bubbles: true,
      // @ts-ignore
      canceable: true,
      shiftKey: ev.shiftKey,
      metaKey: ev.metaKey,
      ctrlKey: ev.ctrlKey,
      clientX: x,
      clientY: y
    });
    target.dispatchEvent(event);
  }
  handleMouseEvent(ev) {
    const targetElement = ev.target;
    const node = targetElement?.closest(".message");
    if (!node)
      return;
    const tabBtn = document.getElementById("sidebar-tabs")?.children[0];
    if (tabBtn && !tabBtn.classList.contains("active")) {
      tabBtn.dispatchEvent(
        // @ts-ignore
        new MouseEvent("click", { bubbles: true, canceable: true })
      );
    }
    const sidebar = tabBtn?.closest("#sidebar");
    if (sidebar && sidebar?.classList.contains("collapsed")) {
      Toasted.expandSidebarInstant(sidebar);
    }
    this.delegateEvent(node, ev);
    node.remove();
  }
  addMessage(node) {
    const div = new El(`.${this.moduleName}`);
    const messageId = div.data("messageId");
    if (!messageId)
      throw new Error("Message ID not found");
    const oldNode = div.element.querySelector(
      `[data-message-id="${messageId}"]`
    );
    if (oldNode)
      return this.updateMessage(node, oldNode);
    if (div.children.length >= this.maxMessagesOnScreen)
      div.element.firstElementChild?.remove();
    div.child(node, "append");
    TweenMax.from(node, 0.3, {
      height: 0,
      onComplete: () => {
        new El(node).set({ height: "" });
        this.removeMessage(node);
      }
    });
  }
  updateMessage(newNode, oldNode) {
    oldNode.parentNode?.replaceChild(newNode, oldNode);
    this.removeMessage(newNode);
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Wonderlost {
  constructor(DEBUG = false) {
    this.DEBUG = DEBUG;
    __publicField(this, "tomes", /* @__PURE__ */ new Map([
      ["Toasted", Toasted]
    ]));
    consola.info("Wonderlost | Initializing");
    this.initializeTomes();
  }
  initializeTomes() {
    this.tomes.forEach((tome, tomeName) => {
      new tome(this.DEBUG).initializeSettings().registerHooks();
      if (this.DEBUG) {
        consola.info(`Wonderlost | Initialized ${tome.name}`);
      }
    });
  }
}
Hooks.once("init", async function() {
  new Wonderlost(true);
});
Hooks.once("ready", async function() {
});
