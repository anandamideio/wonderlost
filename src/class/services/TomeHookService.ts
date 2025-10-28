import consola from 'consola';
import type { HookableEvents, HookEvent } from 'src/types/wonderlost/Tome';
import { TomeErrorBoundary } from '../TomeLifecycle';

/**
 * Service for managing Tome hooks with error boundaries
 */
export class TomeHookService {
  private hooks = new Map<HookableEvents | `once:${HookableEvents}`, HookEvent>();
  private registeredHookIDs: Array<{ event: string; id: number }> = [];

  constructor(
    private moduleName: string,
    private isEnabled: () => boolean,
    private debug = false,
  ) {}

  /**
   * Get all registered hooks
   */
  get allHooks(): Map<HookableEvents | `once:${HookableEvents}`, HookEvent> {
    return new Map(this.hooks);
  }

  /**
   * Check if the service has any hooks
   */
  get hasHooks(): boolean {
    return this.hooks.size > 0;
  }

  /**
   * Add a hook for a specific event
   * @param event The event to hook into
   * @param callback The function to call when the event is triggered
   * @param overwrite Whether to overwrite an existing hook for the event
   */
  addHook(event: HookableEvents | `once:${HookableEvents}`, callback: HookEvent, overwrite = false): void {
    if (!this.hooks.has(event) || overwrite) {
      this.hooks.set(event, callback);
    } else {
      consola.warn(`${this.moduleName} | Hook for event "${event}" already exists.`);
    }
  }

  /**
   * Remove a hook for a specific event
   * @param event The event to remove the hook from
   */
  removeHook(event: HookableEvents | `once:${HookableEvents}`): void {
    if (this.hooks.has(event)) {
      this.hooks.delete(event);
    } else {
      consola.warn(`${this.moduleName} | No hook found for event "${event}".`);
    }
  }

  /**
   * Remove all hooks registered by this service
   */
  removeAllHooks(): void {
    if (this.debug) {
      consola.info(`${this.moduleName} | Removing ${this.registeredHookIDs.length} hooks`);
    }

    this.registeredHookIDs.forEach(({ event, id }) => {
      Hooks.off(event, id);
    });

    this.registeredHookIDs = [];
    this.hooks.clear();
  }

  /**
   * Initialize all hooks with error boundaries
   */
  async initializeHooks(): Promise<void> {
    const hookPromises: Promise<void>[] = [];

    for (const [event, callback] of this.hooks.entries()) {
      const promise = TomeErrorBoundary.execute(
        () => this.registerSingleHook(event, callback),
        `hook registration for ${event}`,
        this.moduleName,
      );

      hookPromises.push(promise.then(() => undefined));
    }

    await Promise.all(hookPromises);
  }

  /**
   * Register a single hook with error boundary
   */
  private registerSingleHook(event: HookableEvents | `once:${HookableEvents}`, callback: HookEvent): void {
    if (this.debug) {
      consola.info(`${this.moduleName} | Registering hook for ${event}`);
    }

    const isOnce = event.startsWith('once:');
    const actualEvent = isOnce ? event.replace('once:', '') : event;

    // Wrap callback with error boundary and enabled check
    const wrappedCallback = (...args: Parameters<HookEvent>) => {
      if (!this.isEnabled()) {
        return;
      }

      return TomeErrorBoundary.execute(() => callback(...args), `hook execution for ${actualEvent}`, this.moduleName);
    };

    let hookID: number;
    if (isOnce) {
      hookID = Hooks.once(actualEvent, wrappedCallback);
    } else {
      hookID = Hooks.on(actualEvent, wrappedCallback);
    }

    // Store the ID of the hook for later removal
    this.registeredHookIDs.push({ event: actualEvent, id: hookID });
  }

  /**
   * Check if the service needs early initialization (has init/ready hooks)
   */
  needsEarlyInitialization(): boolean {
    return this.hooks.has('init') || this.hooks.has('ready');
  }

  /**
   * Bulk add hooks from a map or array
   */
  addHooks(
    hooks:
      | Map<HookableEvents | `once:${HookableEvents}`, HookEvent>
      | Array<[HookableEvents | `once:${HookableEvents}`, HookEvent]>,
  ): void {
    const hookArray = hooks instanceof Map ? Array.from(hooks.entries()) : hooks;

    for (const [event, callback] of hookArray) {
      this.addHook(event, callback);
    }
  }

  /**
   * Get the number of registered hooks
   */
  get hookCount(): number {
    return this.hooks.size;
  }
}
