import consola from 'consola';
import type { HookableEvents, HookEvent, RuleMenu, Rules, TomeRuleConstructor } from 'src/types/wonderlost/Tome';
import { TomeHookService } from './services/TomeHookService';
import { TomeI18nService } from './services/TomeI18nService';
import { TomeSettingsService } from './services/TomeSettingsService';
import { TomeErrorBoundary, TomePhase } from './TomeLifecycle';

export abstract class Tome {
  public moduleName: string;
  public moduleDescription: string;
  public socketFns: Map<string, (data: unknown) => void> = new Map();
  public DEBUG?: boolean = false;
  public enabled = true;
  public dependencies: Array<string> = [];

  // Lifecycle phase tracking
  private _phase: TomePhase = TomePhase.CREATED;

  // Service instances
  protected hookService: TomeHookService;
  protected settingsService: TomeSettingsService;
  protected i18nService: TomeI18nService;

  private static registry = new Map<string, Tome>();

  get name() {
    return this.moduleName;
  }

  get lowercaseName() {
    return this.moduleName.toLowerCase();
  }

  /**
   * Get the current lifecycle phase
   */
  get phase(): TomePhase {
    return this._phase;
  }

  /**
   * Check if the module is ready
   */
  get ready(): boolean {
    return this._phase === TomePhase.READY;
  }

  /**
   * Get the module's i18n namespace
   * @returns The namespace used for i18n keys
   */
  get i18nNamespace(): string {
    return this.i18nService.namespace;
  }

  /**
   * Localize a string key
   * @param key The localization key within this module's namespace
   * @returns The localized string
   */
  localize(key: string): string {
    return this.i18nService.localize(key);
  }

  /**
   * Format a localized string with data
   * @param key The localization key within this module's namespace
   * @param data The data to use in the template
   * @returns The formatted string
   */
  format(key: string, data: Record<string, unknown>): string {
    return this.i18nService.format(key, data);
  }

  /**
   * Check if a translation key exists
   * @param key The localization key within this module's namespace
   * @returns Whether the key exists
   */
  hasTranslation(key: string): boolean {
    return this.i18nService.hasTranslation(key);
  }

  /**
   * Check if the module has hooks
   * @returns True if hooks are present, otherwise false
   */
  get hasHooks() {
    return this.hookService.hasHooks;
  }

  get hasSettings() {
    return this.settingsService.hasSettings;
  }

  get hasSocketFns() {
    return this.socketFns.size > 0;
  }

  get needsEarlyInitialization() {
    return this.hasSettings || this.hookService.needsEarlyInitialization() || this.hasSocketFns;
  }

  constructor(
    pTome: Pick<Tome, 'moduleDescription' | 'moduleName'> & {
      settings?: TomeRuleConstructor;
      hooks?: Array<[HookableEvents, HookEvent]>;
      socketFns?: Tome['socketFns'];
      stylesheets?: Array<string>;
      /** @default false */
      DEBUG?: boolean;
      /** Dependencies on other Tomes */
      dependencies?: string[];
    },
  ) {
    this.moduleName = pTome.moduleName;
    this.moduleDescription = pTome.moduleDescription;
    this.DEBUG = pTome?.DEBUG ?? false;
    this.dependencies = pTome?.dependencies ?? [];
    this.socketFns = pTome?.socketFns ?? new Map();

    // Initialize services
    this.i18nService = new TomeI18nService(this.lowercaseName);

    this.hookService = new TomeHookService(this.moduleName, () => this.enabled, this.DEBUG);

    this.settingsService = new TomeSettingsService(
      this.moduleName,
      this.lowercaseName,
      (key: string) => this.i18nService.localize(key),
      (enabled: boolean) => this.handleEnabledChange(enabled),
      this.DEBUG,
    );

    if (pTome?.settings) {
      // Process settings from constructor
      const settings: Array<Rules & { scope: 'world' | 'client' }> = [];

      if (pTome.settings.globalSettings) {
        settings.push(
          ...pTome.settings.globalSettings.map((s) => ({
            ...s,
            scope: 'world' as const,
          })),
        );
      }

      if (pTome.settings.clientSettings) {
        settings.push(
          ...pTome.settings.clientSettings.map((s) => ({
            ...s,
            scope: 'client' as const,
          })),
        );
      }

      this.settingsService.registerSettings(settings);
    }

    if (pTome?.hooks) {
      // Process hooks from constructor
      this.hookService.addHooks(pTome.hooks);
    }

    Tome.registry.set(this.moduleName, this);
  }

  /**
   * Handle the enabled state change
   */
  private handleEnabledChange(enabled: boolean): void {
    this.enabled = enabled;

    if (this.enabled) {
      this.onModuleEnabled();
    } else {
      this.onModuleDisabled();
    }
  }

  /**
   * Get a reference to another Tome by name
   * @param tomeName The name of the Tome to get
   * @returns The requested Tome instance or undefined if not found
   */
  public getTome<T extends Tome = Tome>(tomeName: string): T | undefined {
    return Tome.registry.get(tomeName) as T | undefined;
  }

  /**
   * Check if a Tome is initialized
   * @param tomeName The name of the Tome to check
   * @returns Whether the Tome is initialized and ready
   */
  public isTomeReady(tomeName: string): boolean {
    const tome = Tome.registry.get(tomeName);
    return tome?.ready || false;
  }

  /**
   * Add a hook for a specific event
   * @param event The event to hook into
   * @param callback The function to call when the event is triggered
   * @param overwrite Whether to overwrite an existing hook for the event
   */
  public addHook(event: HookableEvents | `once:${HookableEvents}`, callback: HookEvent, overwrite = false) {
    this.hookService.addHook(event, callback, overwrite);
  }

  /**
   * Remove a hook for a specific event
   * @param event The event to remove the hook from
   */
  public removeHook(event: HookableEvents | `once:${HookableEvents}`) {
    this.hookService.removeHook(event);
  }

  /**
   * Remove all hooks registered by this Tome
   */
  public removeAllHooks() {
    this.hookService.removeAllHooks();
    return this;
  }

  public async initializeHooks() {
    await this.hookService.initializeHooks();
    return this;
  }

  // Method to register global settings
  public registerSettings(rules: Array<Rules & { scope: 'world' | 'client' }>): Tome {
    this.settingsService.registerSettings(rules);
    return this;
  }

  public async initializeSettings() {
    await this.settingsService.initializeSettings();
    return this;
  }

  public static unregisterTome(tomeName: string): boolean {
    return this.registry.delete(tomeName);
  }

  public destroy(): void {
    if (this.DEBUG) {
      console.log(`[TOME::${this.moduleName}] => Destroying module`);
    }

    // Remove from registry
    Tome.unregisterTome(this.moduleName);

    // Clean up hooks
    this.removeAllHooks();

    // Clear collections
    this.socketFns.clear();

    // Mark as destroyed
    this._phase = TomePhase.DESTROYED;
    this.enabled = false;
  }

  protected onModuleEnabled(): void {
    // Default implementation - override in subclasses if needed
  }

  protected onModuleDisabled(): void {
    this.removeAllHooks();
  }

  public getSetting<ExpectedReturn = unknown>(settingName: string) {
    return this.settingsService.getSetting<ExpectedReturn>(settingName);
  }

  public async setSetting(settingName: string, value: unknown) {
    return this.settingsService.setSetting(settingName, value);
  }

  public registerSettingSubmenu<Data extends Record<string, unknown> = Record<string, unknown>>(
    menu: RuleMenu & { data: Data },
  ) {
    this.settingsService.registerSettingSubmenu(menu);
  }

  public initializeSocketListeners() {
    if (this.socketFns.size === 0) return this;

    this.socketFns.forEach((fn, event) => {
      TomeErrorBoundary.executeSync(
        () => {
          if (this.DEBUG) {
            consola.info(`${this.moduleName} | Registering socket listener for event: ${event}`);
          }
          game.socket?.on(event, (data: unknown) => fn(data));
        },
        `socket listener registration for ${event}`,
        this.moduleName,
      );
    });

    return this;
  }

  /**
   * Initialize the module - now async with error boundaries
   */
  public async initialize(): Promise<void> {
    return TomeErrorBoundary.execute(
      async () => {
        if (this._phase !== TomePhase.CREATED) {
          consola.warn(`${this.moduleName} | Already initialized, current phase: ${this._phase}`);
          return;
        }

        // Wait for dependencies
        await this.waitForDependencies();

        // Initialize settings
        if (this.hasSettings) {
          await this.initializeSettings();
        }

        // Initialize hooks
        if (this.hasHooks) {
          await this.initializeHooks();
        }

        // Initialize socket listeners
        if (this.hasSocketFns) {
          this.initializeSocketListeners();
        }

        // Move to initialized phase
        this._phase = TomePhase.INITIALIZED;

        // Call onInitialize hook for subclasses
        await this.onInitialize();

        // Mark as ready
        this._phase = TomePhase.READY;

        if (this.DEBUG) {
          consola.success(`${this.moduleName} | Initialized successfully`);
        }
      },
      'module initialization',
      this.moduleName
    ).then(() => undefined);
  }

  /**
   * Hook for subclasses to override for custom initialization
   */
  protected async onInitialize(): Promise<void> {
    // Override in subclasses
  }

  /**
   * Wait for all dependencies to be ready
   */
  private async waitForDependencies(): Promise<void> {
    if (this.dependencies.length === 0) {
      return;
    }

    const maxAttempts = 50;
    const delayMs = 100;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (this.areDependenciesReady()) {
        if (this.DEBUG) {
          consola.info(`${this.moduleName} | All dependencies ready`);
        }
        return;
      }

      if (this.DEBUG && attempt === 1) {
        const unreadyDeps = this.dependencies.filter((dep) => !this.isTomeReady(dep));
        consola.info(`${this.moduleName} | Waiting for dependencies: ${unreadyDeps.join(', ')}`);
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const unreadyDeps = this.dependencies.filter((dep) => !this.isTomeReady(dep));
    throw new Error(`Timeout waiting for dependencies: ${unreadyDeps.join(', ')}`);
  }

  /**
   * Check if all dependencies are ready
   * @returns Whether all dependencies are initialized and ready
   */
  public areDependenciesReady(): boolean {
    return this.dependencies.every((dep) => this.isTomeReady(dep));
  }

  // Utility function to expand object rules
  static expandObject(value: unknown): Record<string, unknown> {
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value).reduce(
        (acc, [key, val]) => {
          if (typeof val === 'string') {
            try {
              acc[key] = JSON.parse(val);
            } catch {
              acc[key] = val;
            }
          } else {
            acc[key] = val;
          }
          return acc;
        },
        {} as Record<string, unknown>,
      );
    }
    throw new Error(`Expected object but received ${typeof value}`);
  }

  static kebabCase(str: string): string {
    if (!str) return '';
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2') // Insert dash between camelCase
      .replace(/[\s_]+/g, '-') // Replace spaces and underscores with dashes
      .toLowerCase(); // Convert to lowercase
  }

  toJSON() {
    return {
      moduleName: this.moduleName,
      lowercaseName: this.lowercaseName,
      i18nNamespace: this.i18nNamespace,
      moduleDescription: this.moduleDescription,
      phase: this._phase,
      ready: this.ready,
      enabled: this.enabled,
      dependencies: this.dependencies,
      settings: this.settingsService.allSettings,
      hooks: Array.from(this.hookService.allHooks.entries()),
      socketFns: Array.from(this.socketFns.entries()),
      DEBUG: this.DEBUG,
    };
  }
}
