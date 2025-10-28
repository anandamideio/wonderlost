import type { HookableEvents, HookEvent } from 'src/types/wonderlost/Tome';
/**
 * Service for managing Tome hooks with error boundaries
 */
export declare class TomeHookService {
    private moduleName;
    private isEnabled;
    private debug;
    private hooks;
    private registeredHookIDs;
    constructor(moduleName: string, isEnabled: () => boolean, debug?: boolean);
    /**
     * Get all registered hooks
     */
    get allHooks(): Map<HookableEvents | `once:${HookableEvents}`, HookEvent>;
    /**
     * Check if the service has any hooks
     */
    get hasHooks(): boolean;
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
     * Remove all hooks registered by this service
     */
    removeAllHooks(): void;
    /**
     * Initialize all hooks with error boundaries
     */
    initializeHooks(): Promise<void>;
    /**
     * Register a single hook with error boundary
     */
    private registerSingleHook;
    /**
     * Check if the service needs early initialization (has init/ready hooks)
     */
    needsEarlyInitialization(): boolean;
    /**
     * Bulk add hooks from a map or array
     */
    addHooks(hooks: Map<HookableEvents | `once:${HookableEvents}`, HookEvent> | Array<[HookableEvents | `once:${HookableEvents}`, HookEvent]>): void;
    /**
     * Get the number of registered hooks
     */
    get hookCount(): number;
}
//# sourceMappingURL=TomeHookService.d.ts.map