import { El } from '@magik_io/mote';
import { Tome, TomeRules } from '../../class/Tome';

class Toasted extends Tome {
  public toasts: string[];
  public settings = new TomeRules({
    globalSettings: [],
    clientSettings: [{
      name: 'toastDuration',
      type: Number,
      defaultValue: 3000,
      range: {
        min: 1000,
        max: 10000,
        step: 250,
      },
      icon: 'clock',
      restricted: false,
    }]
  });

  constructor() {
    super({ moduleName: 'Toasted', moduleDescription: 'A simple toast notification system' });
    this.toasts = [];


  }

  addToast(message) {
    this.toasts.push(message);
    console.log(`Toast added: ${message}`);
  }

  showToasts() {
    console.log('Current toasts:', this.toasts);
  }

  static expandSidebarInstant(sidebar: HTMLDivElement) {
    if (!sidebar) throw new Error('[Toasted:expandSidebarInstant] -> Error: Sidebar element was not passed');

    const sideB = new El<'div', true>(sidebar).removeClass('collapsed').unset(['width', 'height']);
    ui.sidebar._collapsed = false;

    const icon = sideB.element.querySelector('#sidebar-tabs a.collapse i');
    if (!icon) throw new Error('[Toasted:expandSidebarInstant] -> Error: Icon element was not found');

    new El(icon).removeClass('fa-caret-left').addClass('fa-caret-right');

    Hooks.callAll('sidebarCollapse', ui.sidebar, ui.sidebar._collapsed)
  }

  static findTarget(card: HTMLDivElement, event, messageID) {
    const cardRect = card.getBoundingClientRect();
    const popupRect = document.querySelector(`.${moduleName}`)!.getBoundingClientRect();
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
