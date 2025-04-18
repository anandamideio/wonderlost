import type { HookableEvents, HookEvent, RuleMenu, Rules, TomeRuleConstructor } from 'src/types/wonderlost/Tome';
export declare abstract class Tome {
    moduleName: string;
    moduleDescription: string;
    settings: Array<Rules & {
        scope: "world" | "client";
    }>;
    hooks: Map<"init" | "i18nInit" | "setup" | "ready" | "error" | "hotReload" | "pauseGame" | "updateWorldTime" | "canvasConfig" | "canvasInit" | "canvasPan" | "canvasReady" | "canvasTearDown" | "canvasDraw" | "dropCanvasData" | "highlightObjects" | "renderApplication" | "getApplicationHeaderButtons" | "closeApplication" | "getSceneControlButtons" | "hotbarDrop" | "collapseSceneNavigation" | "getApplicationEntryContext" | "collapseSidebar" | "changeSidebarTab" | "renderChatLog" | "drawGroup" | "tearDownGroup" | "drawLayer" | "tearDownLayer" | "pastePlaceableObject" | "activateLayer" | "deactivateLayer" | "applyActiveEffect" | "updateCompendium" | "preCreateDocument" | "preUpdateDocument" | "preDeleteDocument" | "createDocument" | "updateDocument" | "deleteDocument" | "drawObject" | "refreshObject" | "destroyObject" | "controlObject" | "hoverObject" | "applyTokenStatusEffect" | "chatBubble" | "modifyTokenAttribute" | "targetToken" | "activateNote" | "initializeRenderedEffectSourceShaders" | "dealCards" | "passCards" | "returnCards" | "dropActorSheetData" | "initializeVisionSources" | "lightingRefresh" | "visibilityRefresh" | "initializeLightSources" | "initializeDarknessSources" | "sightRefresh" | "initializeWeatherEffects" | "preImportAdventure" | "importAdventure" | "userConnected" | "combatTurnChange" | "combatStart" | "combatTurn" | "combatRound" | "getProseMirrorMenuDropDowns" | "getProseMirrorMenuItems" | "createProseMirrorEditor" | "chatMessage" | "renderChatMessage" | "globalVolumeChanged" | "rtcSettingsChanged" | "dropRollTableSheetData" | "initializeDynamicTokenRingConfig", HookEvent>;
    socketFns: Map<string, (data: unknown) => void>;
    DEBUG?: boolean;
    ready: boolean;
    enabled: boolean;
    get name(): string;
    get lowercaseName(): string;
    get hasHooks(): boolean;
    get hasSettings(): boolean;
    get hasSocketFns(): boolean;
    get needsEarlyInitialization(): boolean;
    constructor(pTome: Pick<Tome, "moduleDescription" | "moduleName"> & {
        settings?: TomeRuleConstructor;
        hooks?: Array<[HookableEvents, HookEvent]>;
        socketFns?: Tome["socketFns"];
        stylesheets?: Array<string>;
        /** @default false */
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
    initializeSettings(): this;
    getSetting<ExpectedReturn = any>(settingName: string): ExpectedReturn;
    setSetting(settingName: string, value: unknown): Promise<unknown>;
    registerSettingSubmenu<Data extends Record<string, unknown> = Record<string, unknown>>(menu: RuleMenu & {
        data: Data;
    }): void;
    initializeSocketListeners(): this;
    initialize(): this;
    static expandObject(value: unknown): Record<string, unknown>;
    static kabob(str: string): string;
    toJSON(): {
        moduleName: string;
        moduleDescription: string;
        settings: (Rules & {
            scope: "world" | "client";
        })[];
        hooks: Map<"init" | "i18nInit" | "setup" | "ready" | "error" | "hotReload" | "pauseGame" | "updateWorldTime" | "canvasConfig" | "canvasInit" | "canvasPan" | "canvasReady" | "canvasTearDown" | "canvasDraw" | "dropCanvasData" | "highlightObjects" | "renderApplication" | "getApplicationHeaderButtons" | "closeApplication" | "getSceneControlButtons" | "hotbarDrop" | "collapseSceneNavigation" | "getApplicationEntryContext" | "collapseSidebar" | "changeSidebarTab" | "renderChatLog" | "drawGroup" | "tearDownGroup" | "drawLayer" | "tearDownLayer" | "pastePlaceableObject" | "activateLayer" | "deactivateLayer" | "applyActiveEffect" | "updateCompendium" | "preCreateDocument" | "preUpdateDocument" | "preDeleteDocument" | "createDocument" | "updateDocument" | "deleteDocument" | "drawObject" | "refreshObject" | "destroyObject" | "controlObject" | "hoverObject" | "applyTokenStatusEffect" | "chatBubble" | "modifyTokenAttribute" | "targetToken" | "activateNote" | "initializeRenderedEffectSourceShaders" | "dealCards" | "passCards" | "returnCards" | "dropActorSheetData" | "initializeVisionSources" | "lightingRefresh" | "visibilityRefresh" | "initializeLightSources" | "initializeDarknessSources" | "sightRefresh" | "initializeWeatherEffects" | "preImportAdventure" | "importAdventure" | "userConnected" | "combatTurnChange" | "combatStart" | "combatTurn" | "combatRound" | "getProseMirrorMenuDropDowns" | "getProseMirrorMenuItems" | "createProseMirrorEditor" | "chatMessage" | "renderChatMessage" | "globalVolumeChanged" | "rtcSettingsChanged" | "dropRollTableSheetData" | "initializeDynamicTokenRingConfig", HookEvent>;
        socketFns: Map<string, (data: unknown) => void>;
        DEBUG: boolean | undefined;
    };
}
//# sourceMappingURL=Tome.d.ts.map