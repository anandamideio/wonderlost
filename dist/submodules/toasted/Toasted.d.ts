import { Tome } from "../../class/Tome";
export declare class Toasted extends Tome {
    toasts: string[];
    maxMessagesOnScreen: number;
    alwaysShowNotifications: boolean;
    fadeOutDelay: number;
    constructor(DEBUG?: boolean);
    protected removeMessage(node: ChildNode, { time, delay }?: {
        time?: number | undefined;
        delay?: number | undefined;
    }): void;
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
    protected updateMessage(newNode: ChildNode, oldNode: Node): void;
}
//# sourceMappingURL=Toasted.d.ts.map