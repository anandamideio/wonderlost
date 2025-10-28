import type { HookableEvents, HookEvent, RuleMenu, Rules, TomeRuleConstructor } from 'src/types/wonderlost/Tome';
import { TomeHookService } from './services/TomeHookService';
import { TomeI18nService } from './services/TomeI18nService';
import { TomeSettingsService } from './services/TomeSettingsService';
import { TomePhase } from './TomeLifecycle';
export declare abstract class Tome {
    moduleName: string;
    moduleDescription: string;
    socketFns: Map<string, (data: unknown) => void>;
    DEBUG?: boolean;
    enabled: boolean;
    dependencies: Array<string>;
    private _phase;
    protected hookService: TomeHookService;
    protected settingsService: TomeSettingsService;
    protected i18nService: TomeI18nService;
    private static registry;
    get name(): string;
    get lowercaseName(): string;
    /**
     * Get the current lifecycle phase
     */
    get phase(): TomePhase;
    /**
     * Check if the module is ready
     */
    get ready(): boolean;
    /**
     * Get the module's i18n namespace
     * @returns The namespace used for i18n keys
     */
    get i18nNamespace(): string;
    /**
     * Localize a string key
     * @param key The localization key within this module's namespace
     * @returns The localized string
     */
    localize(key: string): string;
    /**
     * Format a localized string with data
     * @param key The localization key within this module's namespace
     * @param data The data to use in the template
     * @returns The formatted string
     */
    format(key: string, data: Record<string, unknown>): string;
    /**
     * Check if a translation key exists
     * @param key The localization key within this module's namespace
     * @returns Whether the key exists
     */
    hasTranslation(key: string): boolean;
    /**
     * Check if the module has hooks
     * @returns True if hooks are present, otherwise false
     */
    get hasHooks(): boolean;
    get hasSettings(): boolean;
    get hasSocketFns(): boolean;
    get needsEarlyInitialization(): boolean;
    constructor(pTome: Pick<Tome, 'moduleDescription' | 'moduleName'> & {
        settings?: TomeRuleConstructor;
        hooks?: Array<[HookableEvents, HookEvent]>;
        socketFns?: Tome['socketFns'];
        stylesheets?: Array<string>;
        /** @default false */
        DEBUG?: boolean;
        /** Dependencies on other Tomes */
        dependencies?: string[];
    });
    /**
     * Handle the enabled state change
     */
    private handleEnabledChange;
    /**
     * Get a reference to another Tome by name
     * @param tomeName The name of the Tome to get
     * @returns The requested Tome instance or undefined if not found
     */
    getTome<T extends Tome = Tome>(tomeName: string): T | undefined;
    /**
     * Check if a Tome is initialized
     * @param tomeName The name of the Tome to check
     * @returns Whether the Tome is initialized and ready
     */
    isTomeReady(tomeName: string): boolean;
    /**
     * Add a hook for a specific event
     * @param event The event to hook into
     * @param callback The function to call when the event is triggered
     * @param overwrite Whether to overwrite an existing hook for the event
     */
    addHook(event: HookableEvents | `once:${HookableEvents}`, callback: HookEvent, overwrite?: boolean): void;
    /**
     * Remove a hook for a specific event
     * @param event The event to remove the hook from
     */
    removeHook(event: HookableEvents | `once:${HookableEvents}`): void;
    /**
     * Remove all hooks registered by this Tome
     */
    removeAllHooks(): this;
    initializeHooks(): Promise<this>;
    registerSettings(rules: Array<Rules & {
        scope: 'world' | 'client';
    }>): Tome;
    initializeSettings(): Promise<this>;
    static unregisterTome(tomeName: string): boolean;
    destroy(): void;
    protected onModuleEnabled(): void;
    protected onModuleDisabled(): void;
    getSetting<ExpectedReturn = unknown>(settingName: string): ExpectedReturn;
    setSetting(settingName: string, value: unknown): Promise<void>;
    registerSettingSubmenu<Data extends Record<string, unknown> = Record<string, unknown>>(menu: RuleMenu & {
        data: Data;
    }): void;
    initializeSocketListeners(): this;
    /**
     * Initialize the module - now async with error boundaries
     */
    initialize(): Promise<void>;
    /**
     * Hook for subclasses to override for custom initialization
     */
    protected onInitialize(): Promise<void>;
    /**
     * Wait for all dependencies to be ready
     */
    private waitForDependencies;
    /**
     * Check if all dependencies are ready
     * @returns Whether all dependencies are initialized and ready
     */
    areDependenciesReady(): boolean;
    static expandObject(value: unknown): Record<string, unknown>;
    static kebabCase(str: string): string;
    toJSON(): {
        moduleName: string;
        lowercaseName: string;
        i18nNamespace: string;
        moduleDescription: string;
        phase: TomePhase;
        ready: boolean;
        enabled: boolean;
        dependencies: string[];
        settings: (Rules & {
            scope: "world" | "client";
        })[];
        hooks: ["ready" | "init" | "i18nInit" | "setup" | "error" | "hotReload" | "pauseGame" | "updateWorldTime" | "canvasConfig" | "canvasInit" | "canvasPan" | "canvasReady" | "canvasTearDown" | "canvasDraw" | "dropCanvasData" | "highlightObjects" | "renderApplication" | "getApplicationHeaderButtons" | "closeApplication" | "getSceneControlButtons" | "hotbarDrop" | "collapseSceneNavigation" | "getApplicationEntryContext" | "collapseSidebar" | "changeSidebarTab" | "drawGroup" | "tearDownGroup" | "drawLayer" | "tearDownLayer" | "pastePlaceableObject" | "applyActiveEffect" | "updateCompendium" | "preCreateDocument" | "preUpdateDocument" | "preDeleteDocument" | "createDocument" | "updateDocument" | "deleteDocument" | "drawObject" | "refreshObject" | "destroyObject" | "controlObject" | "hoverObject" | "applyTokenStatusEffect" | "chatBubble" | "modifyTokenAttribute" | "targetToken" | "activateNote" | "initializeRenderedEffectSourceShaders" | "dealCards" | "passCards" | "returnCards" | "dropActorSheetData" | "activateLayer" | "deactivateLayer" | "initializeVisionSources" | "lightingRefresh" | "visibilityRefresh" | "initializeLightSources" | "initializeDarknessSources" | "sightRefresh" | "initializeWeatherEffects" | "preImportAdventure" | "importAdventure" | "userConnected" | "combatTurnChange" | "combatStart" | "combatTurn" | "combatRound" | "getProseMirrorMenuDropDowns" | "getProseMirrorMenuItems" | "createProseMirrorEditor" | "chatMessage" | "renderChatMessage" | "globalVolumeChanged" | "rtcSettingsChanged" | "dropRollTableSheetData" | "initializeDynamicTokenRingConfig" | "renderChatLog" | "once:ready" | "once:init" | "once:i18nInit" | "once:setup" | "once:error" | "once:hotReload" | "once:pauseGame" | "once:updateWorldTime" | "once:canvasConfig" | "once:canvasInit" | "once:canvasPan" | "once:canvasReady" | "once:canvasTearDown" | "once:canvasDraw" | "once:dropCanvasData" | "once:highlightObjects" | "once:renderApplication" | "once:getApplicationHeaderButtons" | "once:closeApplication" | "once:getSceneControlButtons" | "once:hotbarDrop" | "once:collapseSceneNavigation" | "once:getApplicationEntryContext" | "once:collapseSidebar" | "once:changeSidebarTab" | "once:drawGroup" | "once:tearDownGroup" | "once:drawLayer" | "once:tearDownLayer" | "once:pastePlaceableObject" | "once:applyActiveEffect" | "once:updateCompendium" | "once:preCreateDocument" | "once:preUpdateDocument" | "once:preDeleteDocument" | "once:createDocument" | "once:updateDocument" | "once:deleteDocument" | "once:drawObject" | "once:refreshObject" | "once:destroyObject" | "once:controlObject" | "once:hoverObject" | "once:applyTokenStatusEffect" | "once:chatBubble" | "once:modifyTokenAttribute" | "once:targetToken" | "once:activateNote" | "once:initializeRenderedEffectSourceShaders" | "once:dealCards" | "once:passCards" | "once:returnCards" | "once:dropActorSheetData" | "once:activateLayer" | "once:deactivateLayer" | "once:initializeVisionSources" | "once:lightingRefresh" | "once:visibilityRefresh" | "once:initializeLightSources" | "once:initializeDarknessSources" | "once:sightRefresh" | "once:initializeWeatherEffects" | "once:preImportAdventure" | "once:importAdventure" | "once:userConnected" | "once:combatTurnChange" | "once:combatStart" | "once:combatTurn" | "once:combatRound" | "once:getProseMirrorMenuDropDowns" | "once:getProseMirrorMenuItems" | "once:createProseMirrorEditor" | "once:chatMessage" | "once:renderChatMessage" | "once:globalVolumeChanged" | "once:rtcSettingsChanged" | "once:dropRollTableSheetData" | "once:initializeDynamicTokenRingConfig" | "once:renderChatLog", HookEvent][];
        socketFns: [string, (data: unknown) => void][];
        DEBUG: boolean | undefined;
    };
}
//# sourceMappingURL=Tome.d.ts.map