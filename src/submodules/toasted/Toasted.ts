import { El } from '@magik_io/mote';
import consola from 'consola';
import { Tome } from '../../class/Tome';
// @ts-ignore
import { TweenMax } from '/scripts/greensock/esm/all.js';

type ToastPosition = 
  | 'upperLeft' 
  | 'upperCenter' 
  | 'upperRight' 
  | 'middleLeft' 
  | 'middleCenter' 
  | 'middleRight'
  | 'lowerLeft'
  | 'lowerCenter'
  | 'lowerRight';

export class Toasted extends Tome {
  public maxMessagesOnScreen = 5;
  public alwaysShowNotifications = true;
  public fadeOutDelay = 3000;
  public toastPosition: ToastPosition = 'upperLeft';
  public ToastedReady = false;
  public enabled = true;

  public menu: El<'div', true> | null = null;

  constructor(DEBUG = false) {
    super({
      moduleName: 'Toasted',
      moduleDescription: 'A customizable toast notification system',
      hooks: [
        [
          'renderChatLog',
          async (app, html) => {
            if (DEBUG) {
              consola.info('Toasted | Render chat log', { app, html });
            }

            const firstElementChild = html[0];
            if (!firstElementChild) {
              consola.error('Toasted | Render chat log failed', { app, html });
              return;
            }

            const chatLog = firstElementChild.querySelector('#chat-log') as HTMLDivElement;
            if (!chatLog) {
              consola.error('Toasted | Chat log not found', { app, html });
              return;
            }

            if (document.body.classList.contains('stream')) return;

            try {
              if (this.ToastedReady) {
                consola.warn('Toasted | Chat log already rendered');
                return;
              }

              const div = new El<'div', true>(chatLog.cloneNode(false) as unknown as `div#${string}`)
                .addClass(this.moduleName)
                .addClass(this.toastPosition.replace(/([A-Z])/g, '-$1').toLowerCase())
                .id(this.lowercaseName)
                .on('click', (ev) => this.handleMouseEvent(ev))
                .on('contextmenu' as 'click', (ev) => this.handleMouseEvent(ev));

              document.querySelector('body')?.appendChild(div.element);

              this.ready = true;
              this.ToastedReady = true;

              if (this.DEBUG) consola.success(`${this.moduleName} | Chat log rendered`);
            } catch (error) {
              consola.error('Toasted | Error rendering chat log', { error });
              this.ready = false;
            }
          },
        ],
        [
          'renderChatMessage',
          async (_app, html, _options) => {
            if (this.enabled === false){
              if (this.DEBUG){
                consola.info('Toasted | Disabled, would\'ve rendered a message')
              }
              return;
            }

            if (this.ready && this.ToastedReady) {
              const original = html[0];
              const clone = this.cloneMessage(original);
              this.addMessage(clone);
            }
          },
        ],
        [
          'collapseSidebar',
          async (app, html) => {

          },
        ],
      ],
      socketFns: new Map([
        [
          'module.toasted',
          (data) => {
            let toast:
              | {
                  element: HTMLDivElement;
                  close: () => void;
                }
              | undefined;

            if (this.alwaysShowNotifications) {
              toast = ui.notifications?.info(data);

              if (this.DEBUG) {
                consola.info('Toasted | Show notification', { data });
              }

              return;
            }
            if (!this.alwaysShowNotifications && ui.chat.element.isVisible() === false) {
              toast = ui.notifications?.info(data);
            }

            consola.info(data);

            // if (this.toasts.length > this.maxMessagesOnScreen) this.toasts.shift();

            // const toast = ui.notifications?.info(data);
            toast?.element.addEventListener('click', () => {
              // this.toasts.shift();
              toast.close();
            });
          },
        ],
      ]),
      DEBUG,
    });

    this.registerSettings([
      {
        name: 'Toast Duration',
        hint: 'How long would you like a message to stay on screen?',
        type: Number,
        defaultValue: this.fadeOutDelay,
        range: { min: 1000, max: 10000, step: 250 },
        scope: 'client',
        restricted: false,
        onChange: (value) => {
          this.fadeOutDelay = Number(value);
        },
      },
      {
        name: 'Max Messages',
        hint: 'How many messages would you like to see on screen (at most)?',
        type: Number,
        defaultValue: this.maxMessagesOnScreen,
        range: { min: 1, max: 10, step: 1 },
        scope: 'client',
        restricted: false,
        onChange: (value) => {
          this.maxMessagesOnScreen = Number(value);
        },
      },
      {
        name: 'Always Show Notifications',
        hint: 'Would you prefer toast are shown even if the chat panel is open?',
        type: Boolean,
        defaultValue: this.alwaysShowNotifications,
        scope: 'world',
        restricted: false,
        onChange: (value) => {
          this.alwaysShowNotifications = Boolean(value);
        },
      },
      {
        name: 'Toast Position',
        hint: 'Where would you like toast notifications to appear on screen?',
        type: String,
        defaultValue: this.toastPosition,
        choices: {
          upperLeft: 'Upper Left',
          upperCenter: 'Upper Center',
          upperRight: 'Upper Right',
          middleLeft: 'Middle Left',
          middleCenter: 'Middle Center',
          middleRight: 'Middle Right',
          lowerLeft: 'Lower Left',
          lowerCenter: 'Lower Center',
          lowerRight: 'Lower Right',
        },
        scope: 'world',
        restricted: false,
        onChange: (value) => {
          this.toastPosition = value as ToastPosition;
          this.updateToastPosition();
        },
      },
    ]);

    this.updateToastPosition();
  }

  protected updateSidebarPosition(collapsed: boolean) {
    const container = document.querySelector(`.${this.moduleName}`) ?? document.querySelector(`#${this.lowercaseName}`);
    if (!container) {
      if (this.DEBUG) consola.error('Toasted | Toast container not found, could not update sidebar position');
      return;
    }

    // Skip if not a right-side position
    if (!this.toastPosition.includes('Right')) return;

    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
      if (this.DEBUG) consola.error('Toasted | Sidebar not found');
      return;
    }

    const sidebarWidth = collapsed ? 10 : sidebar.offsetWidth;
    const rightOffset = sidebarWidth + 20; // 20px padding

    // Apply the right offset as a CSS variable
    (container as HTMLElement).style.setProperty('--right-offset', `${rightOffset}px`);

    if (this.DEBUG) {
      consola.info('Toasted | Updated sidebar position', { 
        collapsed, 
        sidebarWidth, 
        rightOffset 
      });
    }
  }

  protected updateToastPosition() {
    const container = document.querySelector(`.${this.moduleName}`) ?? document.querySelector(`#${this.lowercaseName}`);
    if (!container){
      consola.error('Toasted | Toast container not found, could not update its position', { container });
      return;
    }
    
    // Remove any existing position classes
    const positionClasses = ['upper-left', 'upper-center', 'upper-right', 'middle-left', 'middle-center', 'middle-right', 'lower-left', 'lower-center', 'lower-right'];
    
    container.classList.remove(...positionClasses);
    
    // Add the new position class (convert camelCase to kebab-case)
    const positionClass = this.toastPosition
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase();
    container.classList.add(positionClass);


    // Update position for sidebar if it's a right-side position
    if (this.toastPosition.includes('Right')) {
      this.updateSidebarPosition(ui.sidebar._collapsed);
    }

    consola.info('Toasted | Updated toast position', { positionClass });
  }

  static expandSidebarInstant(sidebar: HTMLDivElement) {
    if (!sidebar) {
      throw new Error('[Toasted:expandSidebarInstant] -> Error: Sidebar element was not passed');
    }

    const sideB = new El<'div', true>(sidebar).removeClass('collapsed').unset(['width', 'height']);
    ui.sidebar._collapsed = false;

    const icon = sideB.element.querySelector('#sidebar-tabs a.collapse i') as HTMLDivElement;

    if (!icon) {
      throw new Error('[Toasted:expandSidebarInstant] -> Error: Icon element was not found');
    }

    new El(icon).removeClass('fa-caret-left').addClass('fa-caret-right');

    Hooks.callAll('sidebarCollapse', ui.sidebar, ui.sidebar._collapsed);
  }

  protected delegateEvent(n: Node, ev: MouseEvent) {
    const node = new El(n as HTMLDivElement);
    const messageId = node.data('messageId');
    if (!messageId) {
      consola.error('Toasted | Message ID not found', { node });
      return;
    }

  // Look for the ORIGINAL message in the main chat log, not in the toast container
  const originalCard = document.querySelector(`#chat-log .message[data-message-id="${messageId}"]`) as HTMLDivElement;

    // Card not found? strange.. just return
    if (!originalCard) {
      if (this.DEBUG) console.warn(`${this.moduleName} | Original message not found`, { messageId });
      return;
    }

    originalCard.scrollIntoView();

    // Get target element on "real" chat-card
    const { target, x, y } = Toasted.findTarget(originalCard, ev);

    // If for some reason wrong one was found.. just do nothing
    if (!target) {
      if (this.DEBUG) console.warn(`${this.moduleName} | Target element not found in original message`);
      return;
    }

    const event = new MouseEvent(ev.type, {
      bubbles: true,
      cancelable: true,
      shiftKey: ev.shiftKey,
      metaKey: ev.metaKey,
      ctrlKey: ev.ctrlKey,
      clientX: x,
      clientY: y,
    });

  if (this.DEBUG) {
    consola.info(`${this.moduleName} | Delegating event to chat log`, {
      target,
      x,
      y,
      event
    });
  }

    target.dispatchEvent(event);
  }

  protected handleMouseEvent(ev: MouseEvent) {
    const targetElement = ev.target as HTMLElement;
    const node = targetElement?.closest('.message');
    if (!node) return;
    // activate chat
    const tabBtn = document.getElementById('sidebar-tabs')?.children[0];
    if (tabBtn && !tabBtn.classList.contains('active')) {
      tabBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }

    const sidebar = tabBtn?.closest('#sidebar');
    if (sidebar?.classList.contains('collapsed')) {
      Toasted.expandSidebarInstant(sidebar as HTMLDivElement);
    }
    this.delegateEvent(node, ev);
    node.remove();
  }

  protected addMessage(node: ChildNode) {
    if (!this.ready) return;
    const div = document.querySelector(`.${this.moduleName}`) ?? document.querySelector(`#${this.lowercaseName}`);
    if (!div) {
      if (this.DEBUG) {
        consola.error(`${this.moduleName} | Chat log not found`, { this: this, node, div });
      }
      throw new Error('Chat log not found');
    }

    const { messageId } = (node as HTMLElement).dataset;
    if (!messageId) throw new Error('Message ID not found');

    const oldNode = div.querySelector(`[data-message-id="${messageId}"]`);
    if (oldNode) return this.updateMessage(node, oldNode);
    if (div.children.length >= this.maxMessagesOnScreen) {
      div.firstElementChild?.remove();
    }

    div.appendChild(node);
    TweenMax.from(node, 0.3, {
      height: 0,
      onComplete: () => {
        (node as HTMLDivElement).style.height = '';
        if (this.DEBUG) consola.success(`${this.moduleName} | Toasted message ${messageId}`);

        setTimeout(() => {
          this.removeMessage(node);
        }, this.fadeOutDelay);
      },
    });
  }

  protected removeMessage(node: ChildNode, { time = 0.3, delay = this.fadeOutDelay } = {}) {
    if (!this.ready) return;
    if (this.DEBUG) {
      consola.info(`${this.moduleName} | Removing message`, { node, time, delay });
    }

    setTimeout(() => {
      node.remove();
    }, delay);

    // TweenMax.to(node, time, {
    //   opacity: 0,
    //   height: 0,
    //   delay,
    //   onComplete: () => {
    //     if (this.DEBUG) consola.start(`${this.moduleName} | Message animation finished`, node);

    //     node.remove();

    //     if (this.DEBUG) consola.success(`${this.moduleName} | Message removed`, node);
    //   },
    // });
  }

  protected updateMessage(newNode: ChildNode, oldNode: Node) {
    oldNode.parentNode?.replaceChild(newNode, oldNode);
    this.removeMessage(newNode);
  }

  protected cloneMessage(original: HTMLElement) {
    const clone = original.cloneNode(true) as HTMLDivElement;

    // Tag all interactive elements with unique IDs
    const interactiveElements = original.querySelectorAll('button, a, input, select, textarea');

    interactiveElements.forEach((el, index) => {
      const uniqueID = `${el.tagName.toLowerCase()}-${original.dataset.messageId}-${index}`;
      el.setAttribute('data-interact-id', uniqueID);

      const matchedElement = clone.querySelector(`:nth-child(${this.getElementIndex(el)})`);
      if (matchedElement) matchedElement.setAttribute('data-interact-id', uniqueID);
    });

    return clone;
  }

  protected getElementIndex(element: Element) {
    if (!element.parentElement) return -1;

    let index = 0;
    let sibling = element.previousElementSibling;

    while (sibling) {
      index++;
      sibling = sibling.previousElementSibling;
    }

    return index;
  }

  static findTarget(originalMessage: HTMLDivElement, event: MouseEvent) {
    const target = (event.target as HTMLElement).closest('[data-interact-id]');
    if (!target || !(target as HTMLElement).dataset.interactId) return { target: null, x: 0, y: 0 };

    const matchingElement = originalMessage.querySelector(`[data-interact-id="${(target as HTMLElement).dataset.interactId}"]`);
    return {
      target: matchingElement,
      x: event.clientX,
      y: event.clientY,
    };
  }

}
