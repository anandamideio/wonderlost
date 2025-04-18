import consola from 'consola';
import type { DataModel } from 'src/types/foundry/common/abstract/module.mjs';
import type { MaybePromise } from 'src/types/types/utils.mjs';
import type { HookEvent, HookableEvents, RuleMenu, Rules, TomeRuleConstructor } from 'src/types/wonderlost/Tome';

export abstract class Tome {
  public moduleName: string;
  public moduleDescription: string;
  public settings: Array<Rules & { scope: 'world' | 'client' }> = [];
  public hooks = new Map([] as Array<[HookableEvents | `once:${HookableEvents}`, HookEvent]>);
  public socketFns: Map<string, (data: unknown) => void> = new Map();
  public DEBUG?: boolean = false;
  public ready = false;
  public enabled = true;

  get name() {
    return this.moduleName;
  }

  get lowercaseName() {
    return this.moduleName.toLowerCase();
  }

  /**
   * Get the module's i18n namespace
   * @returns The namespace used for i18n keys
   */
  get i18nNamespace(): string {
    return `${this.lowercaseName}`;
  }

  /**
   * Localize a string key
   * @param key The localization key within this module's namespace
   * @returns The localized string
   */
  localize(key: string): string {
    return game.i18n!.localize(`${this.i18nNamespace}.${key}`);
  }

  /**
   * Format a localized string with data
   * @param key The localization key within this module's namespace
   * @param data The data to use in the template
   * @returns The formatted string
   */
  format(key: string, data: Record<string, unknown>): string {
    return game.i18n!.format(`${this.i18nNamespace}.${key}`, data);
  }

  /**
   * Check if a translation key exists
   * @param key The localization key within this module's namespace
   * @returns Whether the key exists
   */
  hasTranslation(key: string): boolean {
    return game.i18n!.has(`${this.i18nNamespace}.${key}`);
  }

  /**
   * Check if the module has hooks
   * @returns True if hooks are present, otherwise false
   */
  get hasHooks() {
    return this.hooks.size > 0;
  }

  get hasSettings() {
    return this.settings.length > 0;
  }

  get hasSocketFns() {
    return this.socketFns.size > 0;
  }

  get needsEarlyInitialization() {
    return (
      this.hasSettings ||
      (this.hasHooks && this.hooks.has('init')) ||
      (this.hasHooks && this.hooks.has('ready')) ||
      this.hasSocketFns
    );
  }

  constructor(
    pTome: Pick<Tome, 'moduleDescription' | 'moduleName'> & {
      settings?: TomeRuleConstructor;
      hooks?: Array<[HookableEvents, HookEvent]>;
      socketFns?: Tome['socketFns'];
      stylesheets?: Array<string>;
      /** @default false */
      DEBUG?: boolean;
    },
  ) {
    this.moduleName = pTome.moduleName;
    this.moduleDescription = pTome.moduleDescription;
    if (pTome?.settings) {
      this.settings =
        pTome.settings.globalSettings?.map((s) => {
          s.scope = 'world';
          return s as Rules & { scope: 'world' };
        }) ?? [];

      this.settings.push(
        ...(pTome.settings.clientSettings?.map((s) => {
          s.scope = 'client';
          return s as Rules & { scope: 'client' };
        }) ?? []),
      );
    }

    this.hooks = pTome?.hooks ? new Map(pTome?.hooks) : new Map();
    this.socketFns = pTome?.socketFns ?? new Map();
    this.DEBUG = pTome?.DEBUG ?? false;
  }

  public addHook(event: HookableEvents | `once:${HookableEvents}`, callback: HookEvent, overwrite = false) {
    if (!this.hooks.has(event) || overwrite) {
      this.hooks.set(event, callback);
    } else {
      consola.warn(`Hook for event "${event}" already exists.`);
    }
  }

  public initializeHooks() {
    this.hooks.forEach((callback, event) => {
      if (this.DEBUG) {
        console.log(`[TOME::${this.moduleName}] => Registering hook for ${event}`);
      }

      const isOnce = event.startsWith('once:');
      const actualEvent = isOnce ? event.replace('once:', '') : event;

      /* Create a wrapped callback so we don't run the hook if disabled */
      const wrappedCallback = (...args: Parameters<HookEvent>) => {
        if (!this.enabled) return;
        return callback(...args);
      };

      if (isOnce) {
        Hooks.once(actualEvent, wrappedCallback);
      } else {
        Hooks.on(actualEvent, wrappedCallback);
      }
    });

    return this;
  }

  // Method to register global settings
  public registerSettings(rules: Array<Rules & { scope: 'world' | 'client' }>): Tome {
    rules.forEach((rule) => {
      this.settings.push(rule as Rules & { scope: 'world' | 'client' });
    });
    return this;
  }

  public initializeSettings() {
    if (this.DEBUG) {
      consola.info(`[TOME::${this.moduleName}] => Initializing settings`, this.settings);
    }

    /** Create the isEnabled rule typed to the module so users can disable the module with ease */
    game.settings?.register('wonderlost', Tome.kebabCase(`${this.lowercaseName}-isEnabled`), {
      name: this.localize('isEnabled'),
      hint: this.localize('isEnabled_hint'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
      onChange: (value: unknown) => {
        this.enabled = value as boolean;

        if (this.enabled) {
          this.onModuleEnabled();
        } else {
          this.onModuleDisabled();
        }

        if (this.DEBUG) {
          consola.info(`[TOME::${this.moduleName}] => Module enabled: ${value}`);
        }
      },
    });

    this.settings.forEach((setting) => {
      game.settings?.register('wonderlost', Tome.kebabCase(`${this.lowercaseName}-${setting.name}`), {
        name: setting.name,
        hint: setting.hint,
        scope: setting.scope,
        config: true,
        default: setting?.defaultValue,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        type: setting.type as unknown as any,
        // @ts-ignore -> These are only there when the type is correct, but TS doesn't know that
        choices: setting?.choices,
        // @ts-ignore -> Same as above
        range: setting?.range,
        onChange: setting.onChange,
        requiresReload: setting.requiresReload,
      });
    });

    return this;
  }

  protected onModuleEnabled(): void {
    // Default implementation - override in subclasses if needed
  }

  protected onModuleDisabled(): void {
    // Default implementation - override in subclasses if needed
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public getSetting<ExpectedReturn = any>(settingName: string) {
    return game.settings?.get('wonderlost', Tome.kebabCase(`${this.lowercaseName}-${settingName}`)) as ExpectedReturn;
  }

  public async setSetting(settingName: string, value: unknown) {
    return game.settings?.set('wonderlost', Tome.kebabCase(`${this.lowercaseName}-${settingName}`), value);
  }

  public registerSettingSubmenu<Data extends Record<string, unknown> = Record<string, unknown>>(
    menu: RuleMenu & { data: Data },
  ) {
    game.settings?.register('wonderlost', Tome.kebabCase(`${this.lowercaseName}-allSettings`), {
      scope: 'world',
      config: false,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      type: Object as unknown as DataModel<any, any>,
      default: menu.data,
    });

    const lowercaseName = `${this.lowercaseName}`;
    const moduleName = this.moduleName.toString();

    game.settings?.registerMenu('wonderlost', Tome.kebabCase(`${this.lowercaseName}-allSettings`), {
      name: menu.name,
      label: menu.label,
      hint: menu.hint,
      icon: menu.icon,
      restricted: menu.restricted,
      // @ts-ignore
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

  public initializeSocketListeners() {
    if (this.socketFns.size === 0) return this;

    this.socketFns.forEach((fn, event) => {
      if (this.DEBUG) {
        consola.info(`Registering socket listener for event: ${event}`);
      }

      game.socket?.on(event, (data: unknown) => fn(data));
    });

    return this;
  }

  public initialize() {
    if (this.hasSettings) {
      this.initializeSettings();
    }

    if (this.hasHooks) {
      this.initializeHooks();
    }

    if (this.hasSocketFns) {
      this.initializeSocketListeners();
    }

    this.ready = true;

    return this;
  }

  // Utility function to expand object rules
  static expandObject(value: unknown): Record<string, unknown> {
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value).reduce(
        (acc, [key, val]) => {
          if (typeof val === 'string') {
            try {
              acc[key] = JSON.parse(val);
            } catch (e) {
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
      settings: this.settings,
      hooks: this.hooks,
      socketFns: this.socketFns,
      DEBUG: this.DEBUG,
    };
  }
}
