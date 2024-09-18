type HookableEvents = "renderChatLog" | "renderChatMessage";
type HookEvent = (app: Application, html: JQuery, data?: any) => void | Promise<void>;
interface Rule {
    name: string;
    label?: string;
    icon?: string;
    restricted?: boolean;
    onChange?: (value: unknown) => void | Promise<void>;
    requiresReload?: boolean;
}
type NumberRule = Rule & {
    type: typeof Number;
    range?: {
        min?: number;
        max?: number;
        step?: number;
    };
    defaultValue?: number;
};
type BooleanRule = Rule & {
    type: typeof Boolean;
    defaultValue?: boolean;
};
type StringRule = Rule & {
    type: typeof String;
    defaultValue?: string;
};
type ObjectRule = Rule & {
    type: typeof Object;
    defaultValue?: Record<string, unknown>;
};
type ArrayRule = Rule & {
    type: typeof Array;
    defaultValue?: unknown[];
};
type ColorRule = Rule & {
    type: typeof Color;
    defaultValue?: string;
};
type Rules = NumberRule | BooleanRule | StringRule | ObjectRule | ArrayRule | ColorRule;
interface TomeRuleConstructor {
    globalSettings?: Array<Rules & {
        scope?: "world" | "client";
    }>;
    clientSettings?: Array<Rules & {
        scope?: "world" | "client";
    }>;
}
export declare abstract class Tome {
    moduleName: string;
    moduleDescription: string;
    settings: Array<Rules & {
        scope: "world" | "client";
    }>;
    hooks: Map<HookableEvents, HookEvent>;
    socketFns: Map<string, (data: unknown) => void>;
    DEBUG?: boolean;
    constructor(pTome: Pick<Tome, "moduleDescription" | "moduleName"> & {
        settings?: TomeRuleConstructor;
        hooks?: Tome["hooks"];
        socketFns?: Tome["socketFns"];
        DEBUG?: boolean;
    });
    addHook(event: HookableEvents, callback: HookEvent, overwrite?: boolean): void;
    initializeHooks(): this;
    registerSetting(rule: Rules & {
        scope: "world" | "client";
    }): Tome;
    registerSettings(rules: Array<Rules & {
        scope: "world" | "client";
    }>): Tome;
    updateSettings(): void;
    saveSettings(): void;
    initializeSettings(): this;
    initializeSocketListeners(): this;
    static expandObject(value: unknown): Record<string, unknown>;
    static kabob(str: string): string;
}
export {};
//# sourceMappingURL=Tome.d.ts.map