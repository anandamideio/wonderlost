import { El, Mote } from "@magik_io/mote";
import { Tome } from "../../class/Tome";
import gsap, { TweenMax } from "/scripts/greensock/esm/all.js";
import consola from 'consola';

export class Toasted extends Tome {
  public toasts: string[] = [];
  public maxMessagesOnScreen = 5;
  public alwaysShowNotifications = false;
  public fadeOutDelay = 3000;

  constructor(DEBUG = false) {
    super({
      moduleName: "Toasted",
      moduleDescription: "A simple toast notification system",
      hooks: new Map([
        [
          "renderChatLog",
          async (app, html) => {
            if (document.body.classList.contains("stream")) return;
            const chatTab = html[0];

            new Mote(
              html[0]
                .querySelector("#chat-log")!
                .cloneNode(false) as unknown as `div#${string}`,
            )
              .addClass(this.moduleName)
              .on("click", (ev) => this.handleMouseEvent(ev))
              .on("contextmenu" as "click", (ev) => this.handleMouseEvent(ev))
              .appendToBody();

            Hooks.on("renderChatMessage", (app, html, options) => {
              if (
                chatTab.classList.contains("active") &&
                !chatTab.closest("#sidebar")?.classList.contains("collapsed")
              ) {
                return;
              }

              const newNode = html[0].cloneNode(true);
              this.addMessage(newNode as ChildNode);
            });
          },
        ],
      ]),
      socketFns: new Map([
        [
          "module.toasted",
          (data) => {
            if (this.alwaysShowNotifications) {
              ui.notifications?.info(data);
              return;
            }

            consola.info(data);

            // this.toasts.push(data);
            // if (this.toasts.length > this.maxMessagesOnScreen) this.toasts.shift();

            // const toast = ui.notifications?.info(data);
            // toast?.element.addEventListener("click", () => {
            //   this.toasts.shift();
            //   toast.close();
            // });
          },
        ]
      ]),
      DEBUG
    });

    this.registerSettings([
      {
        name: "Toast Duration",
        label: "How long would you like a message to stay on screen?",
        type: Number,
        defaultValue: this.fadeOutDelay,
        range: { min: 1000, max: 10000, step: 250 },
        icon: "clock",
        scope: "client",
        restricted: false,
        onChange: (value) => {
          this.fadeOutDelay = Number(value);
        },
      },
      {
        name: "Max Messages",
        label: "How many messages would you like to see on screen (at most)?",
        type: Number,
        defaultValue: this.maxMessagesOnScreen,
        range: { min: 1, max: 10, step: 1 },
        icon: "list",
        scope: "client",
        restricted: false,
        onChange: (value) => {
          this.maxMessagesOnScreen = Number(value);
        },
      },
      {
        name: "Always Show Notifications",
        label: "Would you prefer toast are shown even if the chat panel is open?",
        type: Boolean,
        defaultValue: this.alwaysShowNotifications,
        icon: "eye",
        scope: "client",
        restricted: false,
        onChange: (value) => {
          this.alwaysShowNotifications = Boolean(value);
        },
      },
    ]);
  }

  protected removeMessage(
    node: ChildNode,
    { time = 0.3, delay = this.fadeOutDelay } = {},
  ) {
    if (this.fadeOutDelay < 0) return;

    TweenMax.to(node, time, {
      opacity: 0,
      height: 0,
      delay,
      onComplete: () => {
        node.remove();
      },
    });
  }

  static expandSidebarInstant(sidebar: HTMLDivElement) {
    if (!sidebar) {
      throw new Error(
        "[Toasted:expandSidebarInstant] -> Error: Sidebar element was not passed",
      );
    }

    const sideB = new El<"div", true>(sidebar)
      .removeClass("collapsed")
      .unset(["width", "height"]);
    ui.sidebar._collapsed = false;

    const icon = sideB.element.querySelector(
      "#sidebar-tabs a.collapse i",
    ) as HTMLDivElement;

    if (!icon) {
      throw new Error(
        "[Toasted:expandSidebarInstant] -> Error: Icon element was not found",
      );
    }

    new El(icon).removeClass("fa-caret-left").addClass("fa-caret-right");

    Hooks.callAll("sidebarCollapse", ui.sidebar, ui.sidebar._collapsed);
  }

  static findTarget(
    card: HTMLDivElement,
    event: MouseEvent,
    messageID: string,
  ) {
    const cardRect = card.getBoundingClientRect();
    const popupRect = document
      .querySelector(`.${this.name}`)!
      .getBoundingClientRect();
    let x = event.clientX - popupRect.left + cardRect.left;
    let y = event.clientY - popupRect.top + cardRect.top;

    let target = document.elementFromPoint(x, y);
    let closestMessage = target?.closest(".message");
    let closestMessageID = new El(closestMessage as HTMLDivElement).data(
      "messageId",
    );

    if (target && closestMessageID === messageID) {
      return { target, x, y };
    }
    const targetRect = (event.target as HTMLElement).getBoundingClientRect();
    // If click element is obscured, rasterize the target and test if some point is free
    // doing 10 steps in each direction, with a minimum of 5 px is some arbitrary number chosen, but i think its quite okayish in regards of accuracy and performance
    const dx = Math.min(targetRect.width / 10, 5);
    const dy = Math.min(targetRect.height / 10, 5);
    for (let vert = targetRect.top + 1; vert < targetRect.bottom; vert += dy) {
      y = vert - popupRect.top + cardRect.top;
      for (let hor = targetRect.left + 1; hor < targetRect.right; hor += dx) {
        x = hor - popupRect.left + cardRect.left;
        target = document.elementFromPoint(x, y);
        closestMessage = target?.closest(".message");
        closestMessageID = new El(closestMessage as HTMLDivElement).data(
          "messageId",
        );

        if (target && closestMessageID === messageID) return { target, x, y };
      }
    }

    return { target: null, x, y };
  }

  protected delegateEvent(n: Node, ev: MouseEvent) {
    const node = new El(n as HTMLDivElement);
    const card = new El("#chat-log").element.querySelector(
      `[data-message-id="${node.data("messageId")}"]`,
    ) as HTMLDivElement;
    // Card not found? strange.. just return
    if (!card) return;
    card.scrollIntoView();
    // Get target element on "real" chat-card
    const { target, x, y } = Toasted.findTarget(
      card,
      ev,
      node.data("messageId")!,
    );
    // If for some reason wrong one was found.. just do nothing
    if (!target) return;

    const event = new MouseEvent(ev.type, {
      bubbles: true,
      // @ts-ignore
      canceable: true,
      shiftKey: ev.shiftKey,
      metaKey: ev.metaKey,
      ctrlKey: ev.ctrlKey,
      clientX: x,
      clientY: y,
    });
    target.dispatchEvent(event);
  }

  protected handleMouseEvent(ev: MouseEvent) {
    const targetElement = ev.target as HTMLElement;
    const node = targetElement?.closest(".message");
    if (!node) return;
    // activate chat
    const tabBtn = document.getElementById("sidebar-tabs")?.children[0];
    if (tabBtn && !tabBtn.classList.contains("active")) {
      tabBtn.dispatchEvent(
        // @ts-ignore
        new MouseEvent("click", { bubbles: true, canceable: true }),
      );
    }

    const sidebar = tabBtn?.closest("#sidebar");
    if (sidebar && sidebar?.classList.contains("collapsed")) {
      Toasted.expandSidebarInstant(sidebar as HTMLDivElement);
    }
    this.delegateEvent(node, ev);
    node.remove();
  }

  protected addMessage(node: ChildNode) {
    const div = new El(`.${this.moduleName}`);
    const messageId = div.data("messageId");
    if (!messageId) throw new Error("Message ID not found");

    const oldNode = div.element.querySelector(
      `[data-message-id="${messageId}"]`,
    );
    if (oldNode) return this.updateMessage(node, oldNode);
    if (div.children.length >= this.maxMessagesOnScreen) {
      div.element.firstElementChild?.remove();
    }

    div.child(node as HTMLDivElement, "append");
    TweenMax.from(node, 0.3, {
      height: 0,
      onComplete: () => {
        new El(node as HTMLDivElement).set({ height: "" });
        this.removeMessage(node);
      },
    });
  }

  protected updateMessage(newNode: ChildNode, oldNode: Node) {
    oldNode.parentNode?.replaceChild(newNode, oldNode);
    this.removeMessage(newNode);
  }
}
