import consola from "consola";
import type ApplicationV2 from 'src/types/foundry/client-esm/applications/api/application.mjs';
import type { DataModel } from "src/types/foundry/common/abstract/module.mjs";
import type { MaybePromise } from 'src/types/types/utils.mjs';

type HookableEvents = "renderChatLog" | "renderChatMessage";
type HookEvent = (
  app: Application,
  html: JQuery,
  data?: any,
) => void | Promise<void>;

interface RuleMenu extends ClientSettings.PartialSettingSubmenuConfig {

}

interface Rule {
  name: string;
  hint?: string;
  restricted?: boolean;
  onChange?: (value: unknown) => void | Promise<void>;
  /** true if you want to prompt the user to reload */
  requiresReload?: boolean;
  /**
   * @default true
   * @comment false if you dont want it to show in module config
   */
  config?: boolean;
}

// Define rule-specific types
type NumberRule = Rule & {
  type: typeof Number;
  range?: { min?: number; max?: number; step?: number };
  defaultValue?: number;
};
type BooleanRule = Rule & { type: typeof Boolean; defaultValue?: boolean };
type StringRule = Rule & { type: typeof String; defaultValue?: string };
type ObjectRule = Rule & {
  type: typeof Object;
  defaultValue?: Record<string, unknown>;
};
type ArrayRule = Rule & {
  type: typeof Array;
  defaultValue?: unknown[];
};
type ColorRule = Rule & { type: typeof Color; defaultValue?: string };

// Define the Rules union type
type Rules =
  | NumberRule
  | BooleanRule
  | StringRule
  | ObjectRule
  | ArrayRule
  | ColorRule;

interface TomeRuleConstructor {
  globalSettings?: Array<Rules & { scope?: "world" | "client" }>;
  clientSettings?: Array<Rules & { scope?: "world" | "client" }>;
}

export abstract class Tome {
  public moduleName: string;
  public moduleDescription: string;
  public settings: Array<Rules & { scope: "world" | "client" }> = [];
  public hooks = new Map([] as Array<[HookableEvents, HookEvent]>);
  public socketFns: Map<string, (data: unknown) => void> = new Map();
  public DEBUG?: boolean = false;
  public ready = false;

  get name() {
    return this.moduleName;
  }

  get lowercaseName() {
    return this.moduleName.toLowerCase();
  }

  constructor(
    pTome: Pick<Tome, "moduleDescription" | "moduleName"> & {
      settings?: TomeRuleConstructor;
      hooks?: Tome["hooks"];
      socketFns?: Tome["socketFns"];
      DEBUG?: boolean;
    },
  ) {
    this.moduleName = pTome.moduleName;
    this.moduleDescription = pTome.moduleDescription;
    if (pTome?.settings) {
      this.settings =
        pTome.settings.globalSettings?.map((s) => {
          s.scope = "world";
          return s as Rules & { scope: "world" };
        }) ?? [];

      this.settings.push(
        ...(pTome.settings.clientSettings?.map((s) => {
          s.scope = "client";
          return s as Rules & { scope: "client" };
        }) ?? []),
      );
    }

    this.hooks = pTome?.hooks ?? new Map();
    this.socketFns = pTome?.socketFns ?? new Map();
    this.DEBUG = pTome?.DEBUG ?? false;
  }

  public addHook(
    event: HookableEvents,
    callback: HookEvent,
    overwrite: boolean = false,
  ) {
    if (!this.hooks.has(event) || overwrite) {
      this.hooks.set(event, callback);
    } else {
      consola.warn(`Hook for event "${event}" already exists.`);
    }
  }

  public initializeHooks() {
    this.hooks.forEach((callback, event) => {
      if (this.DEBUG) {
        consola.box({
          title: `[TOME::${this.moduleName}] => Registering hook for ${event}`,
          additional: { callback: callback.toString() },
        })
      }

      Hooks.on(event, callback);
    });

    return this;
  }

  // Method to register global settings
  public registerSetting(rule: Rules & { scope: "world" | "client" }): Tome {
    switch (rule.type) {
      case Number:
        this.settings.push({ ...rule } as NumberRule & {
          scope: "world" | "client";
        });
        break;
      case Boolean:
        this.settings.push({ ...rule } as BooleanRule & {
          scope: "world" | "client";
        });
        break;
      case String:
        this.settings.push({ ...rule } as StringRule & {
          scope: "world" | "client";
        });
        break;
      case Object:
        this.settings.push({ ...rule } as ObjectRule & {
          scope: "world" | "client";
        });
        break;
      case Array:
        this.settings.push({ ...rule } as ArrayRule & {
          scope: "world" | "client";
        });
        break;
      case Color:
        this.settings.push({ ...rule } as ColorRule & {
          scope: "world" | "client";
        });
        break;
      default:
        throw new Error(`Unsupported rule type: ${rule.type}`);
    }

    return this;
  }

  public registerSettings(
    rules: Array<Rules & { scope: "world" | "client" }>,
  ): Tome {
    rules.forEach((rule) => {
      this.registerSetting(rule);
    });
    return this;
  }

  public initializeSettings() {
    this.settings.forEach((setting) => {
      if (this.DEBUG) {
        consola.box({
          title: `[TOME::${this.moduleName}] => Registering ${setting.name}`,
          additional: { ...setting },
        });
      }

      game.settings?.register('wonderlost', Tome.kabob(`${this.lowercaseName}-${setting.name}`), {
        name: setting.name,
        hint: setting.hint,
        scope: setting.scope,
        config: true,
        default: setting?.defaultValue,
        type: setting.type as unknown as DataModel<any, any>,
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

  public getSetting<ExpectedReturn = any>(settingName: string) {
    return game.settings?.get('wonderlost', Tome.kabob(`${this.lowercaseName}-${settingName}`)) as ExpectedReturn;
  }

  public async setSetting(settingName: string, value: unknown) {
    return game.settings?.set('wonderlost', Tome.kabob(`${this.lowercaseName}-${settingName}`), value);
  }

  public registerSettingSubmenu<Data extends Record<string, any> = Record<string, any>>(menu: RuleMenu & { data: Data }) {
    game.settings?.register('wonderlost', Tome.kabob(`${this.lowercaseName}-allSettings`), {
      scope: 'world',
      config: false,
      type: Object as unknown as DataModel<any, any>,
      default: menu.data,
    })

    const lowercaseName = `${this.lowercaseName}`;
    const moduleName = this.moduleName.toString();

    game.settings?.registerMenu('wonderlost', Tome.kabob(`${this.lowercaseName}-allSettings`), {
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
            height: "auto",
            popOut: true,
            closeOnSubmit: true as boolean,
            template: `modules/wonderlost/submodules/${lowercaseName}/settings.hbs`,
          });
        }

        static get moduleName() {
          return moduleName
        }

        getData() {
          return foundry.utils.isEmpty(game.settings?.get(moduleName, `${moduleName.toLowerCase()}-allSettings`) as any) ?
            game.settings?.get(moduleName, `${moduleName.toLowerCase()}-allSettings`) as MaybePromise<Data>
            : menu.data as MaybePromise<Data>;
        }

        async _updateObject(_event: Event, formData: Data) {
          await game.settings?.set(moduleName, `${moduleName.toLowerCase()}-allSettings`, formData);
        }
      }
    })
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
    this.initializeSettings()
      .initializeHooks()
      .initializeSocketListeners();

    this.ready = true;


    return this;
  }

  // Utility function to expand object rules
  static expandObject(value: unknown): Record<string, unknown> {
    if (typeof value === "object" && value !== null) {
      return Object.entries(value).reduce(
        (acc, [key, val]) => {
          if (typeof val === "string") {
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

  static kabob(str: string) {
    if (!str) return "";
    return str.split("").join("-");
  }
}
