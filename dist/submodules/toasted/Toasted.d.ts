import { El } from "@magik_io/mote";
import { Tome } from "../../class/Tome";
export declare class Toasted extends Tome {
    maxMessagesOnScreen: number;
    alwaysShowNotifications: boolean;
    fadeOutDelay: number;
    menu: El<'div', true> | null;
    constructor(DEBUG?: boolean);
    static expandSidebarInstant(sidebar: HTMLDivElement): void;
    static findTarget(card: HTMLDivElement, event: MouseEvent, messageID: string): {
        target: Element;
        x: number;
        y: number;
    } | {
        target: null;
        x: number;
        y: number;
    };
    protected delegateEvent(n: Node, ev: MouseEvent): void;
    protected handleMouseEvent(ev: MouseEvent): void;
    protected addMessage(node: ChildNode): void;
    protected removeMessage(node: ChildNode, { time, delay }?: {
        time?: number | undefined;
        delay?: number | undefined;
    }): void;
    protected updateMessage(newNode: ChildNode, oldNode: Node): void;
}
//# sourceMappingURL=Toasted.d.ts.map