import { El, Mote } from '@magik_io/mote';
import { Tome } from '../../class/Tome';
import { TomeRules } from '../../class/Rules';

export class Toasted extends Tome {
  public toasts: string[] = [];

  constructor() {
    super({
      moduleName: 'Toasted',
      moduleDescription: 'A simple toast notification system',
      settings: new TomeRules({
        globalSettings: [],
        clientSettings: [{
          name: 'toastDuration',
          label: 'How long would you like a message to stay on screen?',
          type: Number,
          defaultValue: 3000,
          range: { min: 1000, max: 10000, step: 250 },
          icon: 'clock',
          restricted: false,
        }]
      }),
      hooks: new Map([
        ['renderChatLog', async (app, html) => {
          if (document.body.classList.contains('stream')) return;
          const chatTab = html[0];

          new Mote(
            html[0].querySelector('#chat-log')!.cloneNode(false) as unknown as `div#${string}`
          ).addClass(this.moduleName)
            .on('click', (ec) => handleMoustEvent(ev))
            .on('contextmenu', (ev) => { handleMouseEvent(ev) })
            .appendToBody()

          Hooks.on('renderChatMessage', (app, html, options) => {
            if (chatTab.classList.contains('active') && !chatTab.closest('#sidebar').classList.contains('collapsed')) return;
            const newNode = html[0].cloneNode(true);
            addMessage(newNode);
          });
        }],
      ])
    });

    this.registerRules();
  }

  addToast(message) {
    this.toasts.push(message);
    console.log(`Toast added: ${message}`);
  }

  public showToasts() {
    console.log('Current toasts:', this.toasts);
  }

  public removeMessage(node, { time = 0.3, delay = fadeOutDelay } = {}) {
    if (fadeOutDelay < 0) return;

    TweenMax.to(node, time, {
      opacity: 0, height: 0, delay, onComplete: () => {
        node.remove();
      }
    });
  }

  static expandSidebarInstant(sidebar: HTMLDivElement) {
    if (!sidebar) throw new Error('[Toasted:expandSidebarInstant] -> Error: Sidebar element was not passed');

    const sideB = new El<'div', true>(sidebar).removeClass('collapsed').unset(['width', 'height']);
    ui.sidebar._collapsed = false;

    const icon = sideB.element.querySelector('#sidebar-tabs a.collapse i') as HTMLDivElement;
    if (!icon) throw new Error('[Toasted:expandSidebarInstant] -> Error: Icon element was not found');

    new El(icon).removeClass('fa-caret-left').addClass('fa-caret-right');

    Hooks.callAll('sidebarCollapse', ui.sidebar, ui.sidebar._collapsed)
  }

  static findTarget(card: HTMLDivElement, event, messageID: string) {
    const cardRect = card.getBoundingClientRect();
    const popupRect = document.querySelector(`.${this.name}`)!.getBoundingClientRect();
    let x = event.clientX - popupRect.left + cardRect.left,
      y = event.clientY - popupRect.top + cardRect.top;

    let target = document.elementFromPoint(x, y);

    if (target && target.closest('.message')?.dataset.messageId === messageID) return { target, x, y };
    const targetRect = event.target.getBoundingClientRect();
    // If click element is obscured, rasterize the target and test if some point is free
    // doing 10 steps in each direction, with a minimum of 5 px is some arbitrary number chosen, but i think its quite okayish in regards of accuracy and performance
    const dx = Math.min(targetRect.width / 10, 5);
    const dy = Math.min(targetRect.height / 10, 5);
    for (let vert = targetRect.top + 1; vert < targetRect.bottom; vert += dy) {
      y = vert - popupRect.top + cardRect.top;
      for (let hor = targetRect.left + 1; hor < targetRect.right; hor += dx) {
        x = hor - popupRect.left + cardRect.left;
        target = document.elementFromPoint(x, y)

        if (target && target.closest('.message')?.dataset.messageId === messageID) return { target, x, y };
      }
    }

    return { target: null, x, y };
  }
}
