import { El } from '@magik_io/mote';
import { Tome } from '../../class/Tome';
export declare class Toasted extends Tome {
    maxMessagesOnScreen: number;
    alwaysShowNotifications: boolean;
    fadeOutDelay: number;
    ToastedReady: boolean;
    menu: El<'div', true> | null;
    constructor(DEBUG?: boolean);
    static expandSidebarInstant(sidebar: HTMLDivElement): void;
    protected delegateEvent(n: Node, ev: MouseEvent): void;
    protected handleMouseEvent(ev: MouseEvent): void;
    protected addMessage(node: ChildNode): void;
    protected removeMessage(node: ChildNode, { time, delay }?: {
        time?: number | undefined;
        delay?: number | undefined;
    }): void;
    protected updateMessage(newNode: ChildNode, oldNode: Node): void;
    protected cloneMessage(original: HTMLElement): HTMLDivElement;
    static findTarget(originalMessage: HTMLDivElement, event: MouseEvent): {
        target: Element | null;
        x: number;
        y: number;
    };
    protected getElementIndex(element: Element): number;
}
//# sourceMappingURL=Toasted.d.ts.map