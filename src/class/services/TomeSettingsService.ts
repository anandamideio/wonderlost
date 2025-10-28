import consola from 'consola';
import type { DataModel } from 'src/types/foundry/common/abstract/module.mjs';
import type { MaybePromise } from 'src/types/types/utils.mjs';
import type { RuleMenu, Rules } from 'src/types/wonderlost/Tome';
import { TomeErrorBoundary } from '../TomeLifecycle';

/**
 * Service for managing Tome settings
 */
export class TomeSettingsService {
  private settings: Array<Rules & { scope: 'world' | 'client' }> = [];

  constructor(
    private moduleName: string,
    private lowercaseName: string,
    private localize: (key: string) => string,
    private onEnabledChange: (enabled: boolean) => void,
    private debug = false,
  ) {}

  /**
   * Get all registered settings
   */
  get allSettings(): Array<Rules & { scope: 'world' | 'client' }> {
    return [...this.settings];
  }

  /**
   * Check if the service has any settings
   */
  get hasSettings(): boolean {
    return this.settings.length > 0;
  }

  /**
   * Register settings from array
   */
  registerSettings(rules: Array<Rules & { scope: 'world' | 'client' }>): void {
    rules.forEach((rule) => {
      this.settings.push(rule as Rules & { scope: 'world' | 'client' });
    });
  }

  /**
   * Initialize all settings with error boundaries
   */
  async initializeSettings(): Promise<void> {
    return TomeErrorBoundary.execute(
      () => this.performSettingsInitialization(),
      'settings initialization',
      this.moduleName,
    ).then(() => undefined);
  }

  /**
   * Perform the actual settings initialization
   */
  private performSettingsInitialization(): void {
    if (this.debug) {
      consola.info(`${this.moduleName} | Initializing settings`, this.settings);
    }

    // Create the isEnabled setting for the module
    this.registerEnabledSetting();

    // Register all other settings
    this.settings.forEach((setting) => {
      this.registerSingleSetting(setting);
    });
  }

  /**
   * Register the enabled/disabled toggle setting
   */
  private registerEnabledSetting(): void {
    const kebabName = TomeSettingsService.kebabCase(`${this.lowercaseName}-isEnabled`);

    game.settings?.register('wonderlost', kebabName, {
      name: this.localize('isEnabled'),
      hint: this.localize('isEnabled_hint'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
      onChange: (value: unknown) => {
        this.onEnabledChange(value as boolean);

        if (this.debug) {
          consola.info(`${this.moduleName} | Module enabled: ${value}`);
        }
      },
    });
  }

  /**
   * Register a single setting with error boundary
   */
  private registerSingleSetting(setting: Rules & { scope: 'world' | 'client' }): void {
    const kebabName = TomeSettingsService.kebabCase(`${this.lowercaseName}-${setting.name}`);

    TomeErrorBoundary.executeSync(
      () => {
        game.settings?.register('wonderlost', kebabName, {
          name: setting.name,
          hint: setting.hint,
          scope: setting.scope,
          config: true,
          default: setting?.defaultValue,
          // biome-ignore lint/suspicious/noExplicitAny: <any is expected here>
          type: setting.type as unknown as any,
          choices: setting?.choices,
          // @ts-expect-error -> Same as above
          range: setting?.range,
          onChange: setting.onChange,
          requiresReload: setting.requiresReload,
        });
      },
      `registering setting ${setting.name}`,
      this.moduleName,
    );
  }

  /**
   * Get a setting value
   */
  getSetting<ExpectedReturn = unknown>(settingName: string): ExpectedReturn {
    const kebabName = TomeSettingsService.kebabCase(`${this.lowercaseName}-${settingName}`);
    return game.settings?.get('wonderlost', kebabName) as ExpectedReturn;
  }

  /**
   * Set a setting value
   */
  async setSetting(settingName: string, value: unknown): Promise<void> {
    const kebabName = TomeSettingsService.kebabCase(`${this.lowercaseName}-${settingName}`);

    return TomeErrorBoundary.execute(
      () => game.settings?.set('wonderlost', kebabName, value),
      `setting ${settingName}`,
      this.moduleName,
    ).then(() => undefined);
  }

  /**
   * Register a settings submenu
   */
  registerSettingSubmenu<Data extends Record<string, unknown> = Record<string, unknown>>(
    menu: RuleMenu & { data: Data },
  ): void {
    const kebabName = TomeSettingsService.kebabCase(`${this.lowercaseName}-allSettings`);

    game.settings?.register('wonderlost', kebabName, {
      scope: 'world',
      config: false,
      // biome-ignore lint/suspicious/noExplicitAny: <any is fine here>
      type: Object as unknown as DataModel<any, any>,
      default: menu.data,
    });

    const lowercaseName = this.lowercaseName;
    const moduleName = this.moduleName;

    game.settings?.registerMenu('wonderlost', kebabName, {
      name: menu.name,
      label: menu.label,
      hint: menu.hint,
      icon: menu.icon,
      restricted: menu.restricted,
      type: class extends FormApplication {
        constructor() {
          super({});
        }

        static get defaultOptions() {
          return foundry.utils.mergeObject(super.defaultOptions, {
            title: `Wonderlost: ${moduleName}`,
            id: `${moduleName}-settings`,
            width: 550,
            height: 'auto',
            popOut: true,
            closeOnSubmit: true as boolean,
            template: `modules/wonderlost/submodules/${lowercaseName}/settings.hbs`,
          });
        }

        static get moduleName() {
          return moduleName;
        }

        getData() {
          return foundry.utils.isEmpty(
            game.settings?.get(
              moduleName,
              `${moduleName.toLowerCase()}-allSettings`,
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            ) as any,
          )
            ? (game.settings?.get(moduleName, `${moduleName.toLowerCase()}-allSettings`) as MaybePromise<Data>)
            : (menu.data as MaybePromise<Data>);
        }

        async _updateObject(_event: Event, formData: Data) {
          await game.settings?.set(moduleName, `${moduleName.toLowerCase()}-allSettings`, formData);
        }
      },
    });
  }

  /**
   * Convert a string to kebab-case
   */
  static kebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }
}
